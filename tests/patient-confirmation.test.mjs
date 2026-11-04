import test from 'node:test';
import assert from 'node:assert/strict';
import {patientConfirmation,deliverNotification,flushNotifications,paidNotificationSQL} from '../server/notifications.mjs';
const booking={status:'paid',paid_at:'2026-11-04T20:00:00Z',day:'2026-11-06',time_window:'Morning (6–9 AM)',total:8075,payload:{email:'patient@example.com',draw_address:'PRIVATE ADDRESS',notes:'PRIVATE NOTES'}};
const config={provider:'resend',apiKey:'re_fixture',domain:'omahagentletouchlabs.com',booking};
test('patient confirmation has date, Omaha window, paid amount and no sensitive visit details',()=>{
 const message=patientConfirmation('fixture',booking);
 assert.equal(message.email,'patient@example.com');
 assert.match(message.message,/Friday, November 6, 2026/);
 assert.match(message.message,/Morning \(6–9 AM\) \(Omaha time\)/);
 assert.match(message.message,/Amount paid: \$80.75/);
 assert.doesNotMatch(message.message,/PRIVATE|admin\/payments/);
 for(const status of ['pending','quoted','refunded','cancelled'])assert.throws(()=>patientConfirmation('fixture',{...booking,status}));
 assert.throws(()=>patientConfirmation('fixture',{...booking,paid_at:null}));
 assert.throws(()=>patientConfirmation('fixture',{...booking,payload:{email:'bad\r\nrecipient@example.com'}}));
});
test('patient confirmation uses its own Resend idempotency key and replies to owner',async()=>{
 let calls=0;
 await deliverNotification('patient_paid','fixture',{...config,fetchImpl:async(url,options)=>{
  calls++;assert.equal(url,'https://api.resend.com/emails');
  assert.equal(options.headers['Idempotency-Key'],'booking-fixture-patient_paid');
  const body=JSON.parse(options.body);assert.deepEqual(body.to,['patient@example.com']);assert.equal(body.reply_to,'gentletouchlabs27@gmail.com');
  return {ok:true,json:async()=>({id:'patient-email'})};
 }});
 assert.equal(calls,1);
 await assert.rejects(deliverNotification('patient_paid','fixture',{...config,provider:'formspree',fetchImpl:()=>{throw Error('No fallback');}}),/requires Resend/);
});
test('patient delivery retries independently without repeating the accepted owner alert',async()=>{
 let current=Date.parse('2026-11-04T20:00:00Z');let calls=0;
 let events={paid:{accepted_at:new Date(current).toISOString()},patient_paid:{queued_at:new Date(current).toISOString()}};
 const transaction=async fn=>fn({query:async(sql,args)=>{
  if(sql.startsWith('SELECT'))return {rows:[{...booking,id:'fixture',email_alerts:events}]};
  events=JSON.parse(args[1]);return {};
 }});
 const options={transaction,enabled:true,now:()=>current,send:async(kind,id,{booking:row})=>{
  assert.equal(kind,'patient_paid');assert.equal(row.payload.email,'patient@example.com');
  if(++calls===1)throw Error('Temporary failure');return {provider:'resend',providerId:'patient-email'};
 }};
 assert.equal((await flushNotifications(options)).failed,1);
 current+=60000;assert.equal((await flushNotifications(options)).accepted,1);
 await flushNotifications(options);assert.equal(calls,2);assert.equal(events.patient_paid.provider_id,'patient-email');
 assert.match(paidNotificationSQL,/'patient_paid'/);
});
