import test from 'node:test';
import assert from 'node:assert/strict';
import {patientToken,verifyPatientToken} from '../server/patient-links.mjs';
import {requestPatientChange,completeVisit,approveReschedule} from '../server/patient-care.mjs';
import {createPatientAppointmentHandler} from '../api/patient-appointment.js';
import {patientCareMessage} from '../server/notifications.mjs';
import {refundAmount} from '../server/pricing.mjs';
const id='11111111-1111-4111-8111-111111111111';
const row=()=>({id,status:'paid',paid_at:'2026-11-04T12:00:00Z',appointment_day:'2026-11-06',day:'2026-11-06',time_window:'Morning (6–9 AM)',total:8000,payload:{email:'patient@example.com'}});
test('private links bind booking and expiry and fail closed without a secret',()=>{
 const secret='fixture-'.repeat(8),now=Date.parse('2026-11-04T12:00:00Z');const token=patientToken(id,String(now+60000),secret);
 assert.equal(verifyPatientToken(id,token,{secret,now}),true);
 for(const [booking,value] of [[id,token+'a'],['22222222-2222-4222-8222-222222222222',token]])assert.equal(verifyPatientToken(booking,value,{secret,now}),false);
 assert.equal(verifyPatientToken(id,token,{secret,now:now+60001}),false);assert.equal(verifyPatientToken(id,token,{secret:''}),false);
});
test('cancel request is durable, alerts owner and does not cancel or refund automatically',async()=>{
 let saved;const c={query:async(sql,args)=>{assert.equal(sql,'UPDATE payment_bookings SET payload=$2::jsonb WHERE id=$1');saved=JSON.parse(args[1]);}};
 const r=row();const result=await requestPatientChange(c,r,{kind:'cancel'},{today:'2026-11-04'});
 assert.equal(result.request.kind,'cancel');assert.equal(saved.change_request.status,'pending');assert.ok(saved.email_alerts.change_requested.key);assert.equal(r.status,'paid');
 r.payload=saved;assert.equal((await requestPatientChange({query:()=>assert.fail('Duplicate must not write')},r,{kind:'cancel'},{today:'2026-11-04'})).requested,true);
 assert.equal(refundAmount(8000,'2026-11-06',false,new Date('2026-11-05T20:00:00Z')),5500);
});
test('unavailable reschedule, completed and unpaid bookings cannot submit changes',async()=>{
 const c={query:async()=>({rowCount:0})};
 await assert.rejects(requestPatientChange(c,row(),{kind:'reschedule',day:'2026-11-07',window:'Morning (8–11 AM)'},{today:'2026-11-04'}));
 for(const r of [{...row(),status:'pending'},{...row(),payload:{visit_completed_at:'now'}}])await assert.rejects(requestPatientChange(c,r,{kind:'cancel'},{today:'2026-11-04'}));
});
test('completion queues one optional review email and repeated completion is idempotent',async()=>{
 let payload;const c={query:async(sql,args)=>{payload=JSON.parse(args[1]);}};const r=row();
 await completeVisit(c,r,{today:'2026-11-07'});assert.ok(payload.visit_completed_at);assert.ok(payload.email_alerts.patient_review);
 await completeVisit({query:()=>assert.fail('Must not queue twice')},{...r,payload},{today:'2026-11-07'});
 await assert.rejects(completeVisit(c,r,{today:'2026-11-05'}));
 await assert.rejects(completeVisit(c,{...r,payload:{change_request:{status:'pending'}}},{today:'2026-11-07'}));
 const mail=patientCareMessage('patient_review',id,{...r,payload:{...payload,email:'patient@example.com'}});assert.match(mail.message,/honest review/);assert.match(mail.message,/Reviews are optional/);assert.doesNotMatch(mail.message,/five.star|5.star|positive review/i);
 assert.throws(()=>patientCareMessage('patient_review',id,r),/not completed/);
});
test('reschedule approval rechecks availability and keeps paid amount and address unchanged',async()=>{
 const r=row();r.payload.change_request={id:'request',kind:'reschedule',status:'pending',day:'2099-11-06',window:'Afternoon'};r.payload.email_alerts={patient_reminder:{provider_id:'old'}};
 let update;const c={query:async(sql,args)=>{if(sql.startsWith('SELECT 1'))return {rowCount:1};if(sql.startsWith('UPDATE'))update=args;return {};}};
 await approveReschedule(c,r,'request');assert.equal(update[1],'2099-11-06');const payload=JSON.parse(update[3]);assert.equal(payload.change_request.status,'approved');assert.equal(payload.email_alerts.patient_reminder,undefined);assert.equal(payload.email_alerts.patient_updated.key,'request');assert.equal(r.total,8000);
 await assert.rejects(approveReschedule({query:async()=>({rowCount:0})},r,'request'),/no longer available/);
});
test('patient API denies invalid links before database access and omits identifying data',async()=>{
 const old=process.env.PATIENT_LINK_SECRET;process.env.PATIENT_LINK_SECRET='fixture-'.repeat(8);
 const token=patientToken(id,String(Date.now()+60000));let reads=0;
 const handler=createPatientAppointmentHandler({runTransaction:async fn=>{reads++;return fn({query:async()=>({rows:[row()]})})},flush:async()=>{}});
 const run=async(body)=>{const res={code:200,setHeader(){},status(n){this.code=n;return this},json(value){this.body=value;return this}};await handler({method:'POST',body},res);return res;};
 try{assert.equal((await run({action:'view',id,token:'bad'})).code,403);assert.equal(reads,0);const result=await run({action:'view',id,token});assert.equal(result.code,200);assert.equal(result.body.day,'2026-11-06');assert.equal(result.body.email,undefined);assert.equal(result.body.payload,undefined);}
 finally{if(old===undefined)delete process.env.PATIENT_LINK_SECRET;else process.env.PATIENT_LINK_SECRET=old;}
});
test('confirmation includes checklist and a private management link when configured',()=>{
 const old=process.env.PATIENT_LINK_SECRET;process.env.PATIENT_LINK_SECRET='fixture-'.repeat(8);
 try{const m=patientCareMessage('patient_paid',id,row());assert.match(m.message,/Before your visit/);assert.match(m.message,/Fast only if they instructed you/);assert.match(m.message,/manage-appointment#id=/);assert.doesNotMatch(m.message,/manage-appointment\?token=/);}
 finally{if(old===undefined)delete process.env.PATIENT_LINK_SECRET;else process.env.PATIENT_LINK_SECRET=old;}
});
