import test from 'node:test';
import assert from 'node:assert/strict';
import {sendAppointmentReminders,reminderSQL} from '../server/reminders.mjs';
import {patientConfirmation,flushNotifications} from '../server/notifications.mjs';
import {createReminderHandler} from '../api/appointment-reminders.js';
const booking={id:'fixture',status:'paid',paid_at:'2026-11-04T12:00:00Z',day:'2026-11-06',time_window:'Morning (6–9 AM)',total:8000,payload:{email:'patient@example.com'}};
test('reminders have a distinct subject and correct appointment details',()=>{
 const m=patientConfirmation('fixture',booking,true);assert.equal(m._subject,'Reminder: your Gentle Touch appointment');assert.match(m.message,/Friday, November 6, 2026/);assert.match(m.message,/Omaha time/);assert.equal(m.notification_id,'fixture:patient_reminder');
 assert.match(reminderSQL,/b.status='paid'/);assert.match(reminderSQL,/America\/Chicago/);assert.match(reminderSQL,/accepted_at/);assert.match(reminderSQL,/FOR UPDATE OF b SKIP LOCKED/);
});
test('reminders persist provider acceptance separately and retain failed attempts',async()=>{
 let saved;
 const runTransaction=async fn=>fn({query:async(sql,args)=>{if(sql===reminderSQL)return {rows:[booking]};saved=JSON.parse(args[1]);return {};}});
 const result=await sendAppointmentReminders({runTransaction,send:async(kind,id,{booking:row})=>{assert.equal(kind,'patient_reminder');assert.equal(row.payload.email,'patient@example.com');return {provider:'resend',providerId:'email-reminder'};}});
 assert.equal(result.accepted,1);assert.equal(saved.provider_id,'email-reminder');
 assert.equal((await sendAppointmentReminders({runTransaction,send:async()=>{throw Error('Temporary error');}})).failed,1);assert.equal(saved.accepted_at,undefined);
});
test('ordinary queue processing never sends stale reminder events',async()=>{
 await flushNotifications({enabled:true,transaction:async fn=>fn({query:async(sql)=>sql.startsWith('SELECT')?{rows:[{id:'fixture',email_alerts:{patient_reminder:{attempts:1}}}]}:{}}),send:async()=>assert.fail('Must use reminder date/status filter')});
});
test('cron requires secret and production and returns only counts',async()=>{
 const oldSecret=process.env.CRON_SECRET,oldEnv=process.env.VERCEL_ENV;process.env.CRON_SECRET='x'.repeat(48);process.env.VERCEL_ENV='production';let calls=0;
 const handler=createReminderHandler({send:async()=>{calls++;return {accepted:1,failed:0};}});
 const run=async auth=>{const res={code:200,setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};await handler({method:'GET',headers:{authorization:auth}},res);return res;};
 try{
  assert.equal((await run('')).code,401);assert.equal((await run('Bearer '+'é'.repeat(48))).code,401);assert.equal(calls,0);
  assert.deepEqual((await run('Bearer '+process.env.CRON_SECRET)).body,{accepted:1,failed:0});
  process.env.VERCEL_ENV='preview';assert.equal((await run('Bearer '+process.env.CRON_SECRET)).code,503);assert.equal(calls,1);
 }finally{if(oldSecret===undefined)delete process.env.CRON_SECRET;else process.env.CRON_SECRET=oldSecret;if(oldEnv===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=oldEnv;}
});
