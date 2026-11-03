import test from 'node:test';
import assert from 'node:assert/strict';
import {createPaymentHandler} from '../api/payments.js';
import {collectionFee,chicagoDay} from '../server/pricing.mjs';
import {addDays,windowsForDay} from '../shared/schedule.mjs';
const id='00000000-0000-4000-8000-000000000001';
test('draw fees match advertised prices and reject unsupported types',()=>{
 assert.equal(collectionFee(),8000);
 for(const type of ['Standard','Fasting','Not sure'])assert.equal(collectionFee(type),8000);
 assert.equal(collectionFee('Stat'),12000);
 assert.throws(()=>collectionFee('Other'),e=>e.status===400);
});
for(const action of ['checkout','invoice'])for(const [total,collection] of [[8086,8000],[12086,12000]])test(`${action} sends stored collection ${collection} and mileage separately`,async()=>{
 const old={enabled:process.env.PAYMENTS_ENABLED,url:process.env.APP_URL};
 process.env.PAYMENTS_ENABLED='true';process.env.APP_URL='https://example.invalid';
 try{
  let day=addDays(chicagoDay(),1);while(!windowsForDay(day).length)day=addDays(day,1);
  const row={id,appointment_day:day,time_window:windowsForDay(day)[0],payload:{email:'test@example.invalid'},status:'quoted',channel:null,created_at:new Date(),token_hash:'fixture',total,travel:86,customer_id:'cus_fixture'};
  const c={query:async sql=>{
   if(sql.startsWith('SELECT *,to_char'))return {rows:[row]};
   if(sql.startsWith('SELECT start_minute'))return {rows:[{start_minute:360,end_minute:540}]};
   return {rows:[],rowCount:0};
  }};
  let amounts=[];
  const sdk={checkout:{sessions:{create:async body=>{amounts=body.line_items.map(x=>x.price_data.unit_amount);return {id:'cs_fixture',status:'open',url:'https://example.invalid/pay'};}}},
   invoices:{create:async()=>({id:'in_fixture',status:'draft'}),finalizeInvoice:async()=>({id:'in_fixture',status:'open',hosted_invoice_url:'https://example.invalid/pay'}),sendInvoice:async()=>{}},
   invoiceItems:{create:async body=>{amounts.push(body.amount);}}};
  const handler=createPaymentHandler({admin:()=>{},hash:()=> 'fixture',transaction:fn=>fn(c),stripe:()=>sdk});
  const res={code:200,setHeader(){},status(code){this.code=code;return this;},json(data){this.data=data;return this;}};
  await handler({method:'POST',headers:{},query:{action},body:{id,token:'fixture'}},res);
  assert.equal(res.code,200);assert.deepEqual(amounts,[collection,86]);assert.equal(amounts.reduce((a,b)=>a+b,0),total);
 }finally{for(const [key,value] of [['PAYMENTS_ENABLED',old.enabled],['APP_URL',old.url]])if(value===undefined)delete process.env[key];else process.env[key]=value;}
});
