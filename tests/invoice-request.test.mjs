import test from 'node:test';
import assert from 'node:assert/strict';
import {createPaymentHandler} from '../api/payments.js';
import {chicagoDay} from '../server/pricing.mjs';
import {addDays,windowsForDay} from '../shared/schedule.mjs';
function response(){return {code:200,setHeader(){},status(n){this.code=n;return this;},json(data){this.data=data;return this;}};}
const id='00000000-0000-4000-8000-000000000001';
let day=addDays(chicagoDay(),1);while(!windowsForDay(day).length) day=addDays(day,1);
const form={first_name:'Test',last_name:'Patient',email:'test@example.invalid',phone:'4025550100',draw_address:'Test address',preferred_date:day,preferred_time:windowsForDay(day)[0],cancellation_acknowledged:true};
test('invoice request atomically reserves a hold without charging; retries reuse it',async()=>{
 const old=process.env.PAYMENTS_ENABLED;process.env.PAYMENTS_ENABLED='true';
 try {
 let saved;let insertions=0;
 const client={query:async(sql,args)=>{
  if(sql.startsWith('INSERT INTO payment_rate_limits'))return {rows:[{hits:1}]};
  if(sql.includes('FOR UPDATE SKIP LOCKED'))return {rows:[]};
  if(sql.startsWith('SELECT * FROM payment_bookings'))return {rows:saved?[saved]:[]};
  if(sql.startsWith('SELECT 1 FROM payment_slots'))return {rowCount:1};
  if(sql.startsWith('INSERT INTO payment_bookings')){insertions++;saved={id:args[0],token_hash:args[1],payload:args[3],total:args[7],travel:args[8],distance_meters:1000,status:args[10]};}
  return {rows:[],rowCount:0};
 }};
 const h=createPaymentHandler({db:()=>client,transaction:fn=>fn(client),routePrice:async()=>({distanceMeters:1000,total:8000,travel:0}),stripe:()=>{throw Error('Must not contact Stripe');}});
 const req={method:'POST',headers:{},query:{action:'request_invoice'},body:{form,requestKey:id,token:'x'.repeat(64)}};
 const r=response();await h(req,r);assert.equal(r.code,200);assert.equal(saved.payload.invoice_requested,true);assert.equal(r.data.status,'pending');assert.ok(saved.payload.hold_expires_at);assert.equal(saved.payload.hold_expires_at,r.data.holdExpiresAt);
 const retry=response();await h(req,retry);assert.equal(retry.data.id,r.data.id);assert.equal(insertions,1);
 }finally{if(old===undefined)delete process.env.PAYMENTS_ENABLED;else process.env.PAYMENTS_ENABLED=old;}
});
for(const blocked of [false,true]) test(`reviewed invoice request older than 30 minutes: ${blocked?'blocked window rejected':'invoice can be sent'}`,async()=>{
 const old=process.env.PAYMENTS_ENABLED;process.env.PAYMENTS_ENABLED='true';
 try{
 let sent=false;
 const row={id,appointment_day:day,time_window:form.preferred_time,payload:{...form,invoice_requested:true},status:'quoted',channel:null,created_at:new Date(Date.now()-86400000),customer_id:'cus_fixture',invoice_id:'in_fixture',travel:0};
 const c={query:async(sql)=>{
  if(sql.startsWith('SELECT *,to_char'))return {rows:[row]};
  if(sql.startsWith('SELECT start_minute'))return {rows:[{start_minute:360,end_minute:540}]};
  if(sql.startsWith('SELECT 1 FROM payment_schedule_blocks'))return {rowCount:blocked?1:0};
  return {rows:[],rowCount:0};
 }};
 const h=createPaymentHandler({admin:()=>{},transaction:fn=>fn(c),stripe:()=>({invoices:{retrieve:async()=>({id:'in_fixture',status:'open',hosted_invoice_url:'https://example.invalid/invoice'}),sendInvoice:async()=>{sent=true;}}})});
 const r=response();await h({method:'POST',headers:{},query:{action:'invoice'},body:{id}},r);
 assert.equal(sent,!blocked);assert.equal(r.code,blocked?409:200);
 }finally{if(old===undefined)delete process.env.PAYMENTS_ENABLED;else process.env.PAYMENTS_ENABLED=old;}
});
for(const scenario of [
 {name:'one-hour quote accepted',age:3600000},
 {name:'exactly 24 hours accepted',age:86400000},
 {name:'over 24 hours rejected',age:86400001,expired:true},
 {name:'valid quote cannot book a blocked window',age:3600000,blocked:true},
 {name:'valid quote cannot book an occupied window',age:3600000,reserved:true},
]) test(scenario.name,async()=>{
 const old=process.env.PAYMENTS_ENABLED;process.env.PAYMENTS_ENABLED='true';
 const originalNow=Date.now;const now=originalNow();Date.now=()=>now;
 try{
 let stripeCalled=false;
 const row={id,appointment_day:day,time_window:form.preferred_time,payload:form,status:'quoted',channel:null,created_at:new Date(now-scenario.age),token_hash:'fixture',travel:0};
 const c={query:async sql=>{
  if(sql.startsWith('SELECT *,to_char'))return {rows:[row]};
  if(sql.startsWith('SELECT start_minute'))return {rows:[{start_minute:360,end_minute:540}]};
  if(sql.startsWith('SELECT 1 FROM payment_schedule_blocks'))return {rowCount:scenario.blocked?1:0};
  if(sql.startsWith('SELECT 1 FROM payment_bookings b'))return {rowCount:scenario.reserved?1:0};
  return {rows:[],rowCount:0};
 }};
 const h=createPaymentHandler({hash:()=> 'fixture',transaction:fn=>fn(c),stripe:()=>{stripeCalled=true;return {checkout:{sessions:{create:async()=>({id:'cs_fixture',status:'open',url:'https://example.invalid/checkout'})}}};}});
 const oldUrl=process.env.APP_URL;process.env.APP_URL='https://example.invalid';
 const r=response();try{await h({method:'POST',headers:{},query:{action:'checkout'},body:{id,token:'fixture'}},r);}finally{if(oldUrl===undefined)delete process.env.APP_URL;else process.env.APP_URL=oldUrl;}
 const rejected=!!(scenario.expired||scenario.blocked||scenario.reserved);
 assert.equal(r.code,rejected?409:200);assert.equal(stripeCalled,!rejected);
 if(scenario.expired)assert.match(r.data.error,/Quote expired/);
 }finally{Date.now=originalNow;if(old===undefined)delete process.env.PAYMENTS_ENABLED;else process.env.PAYMENTS_ENABLED=old;}
});
for(const scenario of [
 {name:'active held request can be invoiced',action:'invoice',age:-3600000,ok:true},
 {name:'expired hold cannot be invoiced',action:'invoice',age:1,ok:false},
 {name:'held request cannot switch to public checkout',action:'checkout',age:-3600000,ok:false},
 {name:'administrator can release an unbilled hold',action:'cancel',age:-3600000,ok:true},
])test(scenario.name,async()=>{
 const old=process.env.PAYMENTS_ENABLED;process.env.PAYMENTS_ENABLED='true';
 try{
 let sent=false,cancelled=false;
 const row={id,appointment_day:day,time_window:form.preferred_time,payload:{...form,invoice_requested:true,hold_expires_at:new Date(Date.now()-scenario.age).toISOString()},status:'pending',channel:null,created_at:new Date(),token_hash:'fixture',customer_id:'cus_fixture',invoice_id:'in_fixture',travel:0};
 const c={query:async sql=>{
  if(sql.startsWith('SELECT *,to_char'))return {rows:[row]};
  if(sql.startsWith('SELECT start_minute'))return {rows:[{start_minute:360,end_minute:540}]};
  if(sql.includes("SET status='cancelled'"))cancelled=true;
  return {rows:[],rowCount:0};
 }};
 const h=createPaymentHandler({admin:()=>{},hash:()=> 'fixture',transaction:fn=>fn(c),stripe:()=>({invoices:{retrieve:async()=>({id:'in_fixture',status:'open'}),sendInvoice:async()=>{sent=true;}}})});
 const r=response();await h({method:'POST',headers:{},query:{action:scenario.action},body:{id,token:'fixture'}},r);
 assert.equal(r.code,scenario.ok?200:409);assert.equal(sent,scenario.ok&&scenario.action==='invoice');assert.equal(cancelled,scenario.action==='cancel');
 }finally{if(old===undefined)delete process.env.PAYMENTS_ENABLED;else process.env.PAYMENTS_ENABLED=old;}
});
