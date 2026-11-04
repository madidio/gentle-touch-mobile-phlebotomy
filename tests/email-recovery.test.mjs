import test from 'node:test';
import assert from 'node:assert/strict';
import {resendPatientEmail} from '../server/email-recovery.mjs';
import {cancellationMessage,refundBookingStatus,cancellationNotificationSQL} from '../server/refund-notices.mjs';
import {createPaymentHandler} from '../api/payments.js';
import {flushNotifications} from '../server/notifications.mjs';
const id='11111111-1111-4111-8111-111111111111';
const row=()=>({id,status:'paid',paid_at:'2026-11-01T12:00:00Z',appointment_day:'2099-11-06',day:'2099-11-06',time_window:'Morning (6am-9am)',total:8000,refund_amount:5500,payload:{email:'patient@example.com',email_alerts:{patient_paid:{attempts:1}}}});
test('failed patient emails resend with a new key, preserve history and record acceptance',async()=>{
 let saved;const r=row();r.payload.email_alerts.patient_paid={accepted_at:'before',provider_id:'old',bounced_at:'after'};
 const c={query:async(sql,args)=>{if(sql.startsWith('SELECT'))return {rowCount:1};saved=JSON.parse(args[1]);return {};}};
 const result=await resendPatientEmail(c,r,'patient_paid',{send:async(kind,id,{deliveryKey})=>{assert.ok(deliveryKey);return {accepted:true,provider:'resend',providerId:'new'};}});
 assert.equal(result.accepted,true);assert.equal(saved.patient_paid.provider_id,'new');assert.equal(saved.patient_paid.bounced_at,undefined);assert.equal(saved.patient_paid.history[0].provider_id,'old');
 await assert.rejects(resendPatientEmail(c,{...r,payload:{...r.payload,email_alerts:saved}},'patient_paid'),/Only failed/);
});
test('failed resend remains durable and enforces a cooldown',async()=>{
 let saved;const c={query:async(sql,args)=>{if(sql.startsWith('SELECT'))return {rowCount:1};saved=JSON.parse(args[1]);return {};}};const r=row();
 const result=await resendPatientEmail(c,r,'patient_paid',{send:async()=>{throw Error('Rejected')},now:()=>100000});assert.equal(result.queued,true);assert.ok(saved.patient_paid.next_attempt_at);assert.equal(saved.patient_paid.accepted_at,undefined);
 await assert.rejects(resendPatientEmail(c,{...r,payload:{...r.payload,email_alerts:saved}},'patient_paid',{now:()=>100001}),/one minute/);
 await assert.rejects(resendPatientEmail({query:async()=>({rowCount:0})},r,'patient_paid'),/already started/);
});
test('cancellation emails distinguish processed, pending, failed, unpaid and no-refund outcomes',()=>{
 const r=row();
 for(const [status,phrase] of [['refunded','Refund processed: $55.00'],['refund_pending','Refund requested: $55.00'],['refund_failed','could not be completed'],['cancelled','No refund was issued']]){
  const m=cancellationMessage('patient_cancelled',id,{...r,status});assert.ok(m.message.includes(phrase));assert.equal(m.email,'patient@example.com');assert.doesNotMatch(m.message,/appointment is confirmed/);
 }
 assert.match(cancellationMessage('patient_cancelled',id,{...r,status:'cancelled',paid_at:null}).message,/No completed payment was recorded/);
 assert.throws(()=>cancellationMessage('patient_cancelled',id,r));
 assert.equal(refundBookingStatus('failed'),'refund_failed');assert.equal(refundBookingStatus('succeeded'),'refunded');assert.equal(refundBookingStatus('pending'),'refund_pending');assert.match(cancellationNotificationSQL,/patient_cancelled/);
});
test('resend endpoint requires admin authentication before reading appointments',async()=>{
 const old=process.env.PAYMENTS_ENABLED;process.env.PAYMENTS_ENABLED='true';let read=false;
 const handler=createPaymentHandler({admin:()=>{throw Object.assign(Error('Unauthorized'),{status:401})},transaction:()=>{read=true;}});
 const res={status(n){this.code=n;return this},setHeader(){},json(b){this.body=b;return this}};
 try{await handler({method:'POST',query:{action:'resend_email'},headers:{},body:{id,kind:'patient_paid'}},res);assert.equal(res.code,401);assert.equal(read,false);}finally{if(old===undefined)delete process.env.PAYMENTS_ENABLED;else process.env.PAYMENTS_ENABLED=old;}
});
test('stale confirmation does not block cancellation email processing',async()=>{
 let events={patient_paid:{attempts:1},patient_cancelled:{queued_at:'now'}},sent=[];
 await flushNotifications({enabled:true,transaction:async fn=>fn({query:async(sql,args)=>{if(sql.startsWith('SELECT'))return {rows:[{...row(),status:'cancelled',email_alerts:events}]};events=JSON.parse(args[1]);return {};}}),send:async kind=>{sent.push(kind);return {accepted:true}}});
 assert.deepEqual(sent,['patient_cancelled']);assert.ok(events.patient_paid.skipped_at);assert.ok(events.patient_cancelled.accepted_at);
});
test('admin cancellation queues a notice for each verified refund outcome without changing policy amount',async()=>{
 const old=process.env.PAYMENTS_ENABLED;process.env.PAYMENTS_ENABLED='true';
 try{for(const status of ['succeeded','pending','failed']){
  let saved,amount;const r=row();r.payment_intent='pi_fixture';
  const handler=createPaymentHandler({admin:()=>{},stripe:()=>({refunds:{create:async(params)=>{amount=params.amount;return {id:'re_fixture',status}}}}),transaction:async fn=>fn({query:async(sql,args)=>{if(sql.startsWith('SELECT *,to_char'))return {rows:[r]};if(sql.startsWith('UPDATE'))saved={sql,args};return {rows:[]};}})});
  const res={setHeader(){},status(n){this.code=n;return this},json(value){this.body=value;return this}};
  await handler({method:'POST',query:{action:'cancel'},body:{id},headers:{}},res);
  assert.equal(amount,5500);assert.equal(saved.args[1],refundBookingStatus(status));assert.match(saved.sql,/patient_cancelled/);assert.equal(res.body.refund,5500);
 }}finally{if(old===undefined)delete process.env.PAYMENTS_ENABLED;else process.env.PAYMENTS_ENABLED=old;}
});
