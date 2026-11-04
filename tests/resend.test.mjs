import test from 'node:test';
import assert from 'node:assert/strict';
import {deliverNotification} from '../server/notifications.mjs';
const config={provider:'resend',apiKey:'re_fixture',domain:'omahagentletouchlabs.com'};
test('Resend alert is sent only to owner, deduplicates retries and records acceptance',async()=>{
 const result=await deliverNotification('paid','booking-fixture',{...config,fetchImpl:async(url,options)=>{
  assert.equal(url,'https://api.resend.com/emails');assert.equal(options.headers['Idempotency-Key'],'booking-booking-fixture-paid');
  const body=JSON.parse(options.body);assert.deepEqual(body.to,['gentletouchlabs27@gmail.com']);assert.equal(body.from,'Gentle Touch Blood Draw <alerts@omahagentletouchlabs.com>');assert.equal(body.subject,'Appointment confirmed — payment received');assert.ok(!('first_name' in body));
  return {ok:true,json:async()=>({id:'email-fixture'})};
 }});
 assert.deepEqual(result,{accepted:true,provider:'resend',providerId:'email-fixture'});
});
test('Resend errors never fall back through Formspree or report acceptance',async()=>{
 for(const response of [{ok:false,json:async()=>({message:'unverified domain'})},{ok:true,json:async()=>({})}]){
  let calls=0;await assert.rejects(deliverNotification('paid','fixture',{...config,fetchImpl:async url=>{calls++;assert.equal(url,'https://api.resend.com/emails');return response;}}));assert.equal(calls,1);
 }
 for(const bad of [{apiKey:''},{domain:'other.example'}])await assert.rejects(deliverNotification('paid','fixture',{...config,...bad,fetchImpl:async()=>{throw Error('Must not send');}}));
});
