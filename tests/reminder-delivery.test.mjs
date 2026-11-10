import test from 'node:test';
import assert from 'node:assert/strict';
import {Webhook} from 'svix';
import {createResendWebhookHandler} from '../api/resend-webhook.js';
import {recordReminderDelivery} from '../server/reminder-delivery.mjs';
import {deliverNotification,notificationMessage} from '../server/notifications.mjs';
const id='11111111-1111-4111-8111-111111111111';
const event=(type='email.delivered')=>({type,created_at:'2026-11-05T13:00:00Z',data:{email_id:'mail-fixture',tags:{notification:'patient_reminder',booking_id:id}}});
function fixture(){let alerts={patient_reminder:{provider:'resend',provider_id:'mail-fixture',accepted_at:'2026-11-05T12:59:59Z'}};let writes=0;return {get alerts(){return alerts},get writes(){return writes},runTransaction:async fn=>fn({query:async(sql,args)=>{if(sql.startsWith('SELECT'))return {rows:[{id,payload:{email_alerts:alerts}}]};alerts=JSON.parse(args[1]);writes++;return {};}})};}
test('delivery events queue one owner alert and do not equate delivery with reading',async()=>{
 const db=fixture();assert.equal((await recordReminderDelivery(event(),db)).recorded,true);
 assert.ok(db.alerts.reminder_delivered.queued_at);assert.equal(db.alerts.patient_reminder.delivered_at,'2026-11-05T13:00:00.000Z');
 assert.equal((await recordReminderDelivery(event(),db)).duplicate,true);assert.equal(db.writes,1);
 assert.match(notificationMessage('reminder_delivered',id).message,/does not confirm inbox placement/);
});
test('bounce and failure alert owner; late delivery cannot overwrite a failure',async()=>{
 for(const type of ['email.bounced','email.failed']){const db=fixture();await recordReminderDelivery(event(type),db);assert.ok(db.alerts[`reminder_${type.split('.')[1]}`]);await recordReminderDelivery(event(),db);assert.equal(db.alerts.reminder_delivered,undefined);}
});
test('unrelated emails, unrequested events and wrong provider IDs cannot create alerts',async()=>{
 const db=fixture();const e=event();e.data.tags.notification='owner_alert';assert.equal((await recordReminderDelivery(e,db)).ignored,true);
 const other=event();other.data.email_id='different';assert.equal((await recordReminderDelivery(other,db)).ignored,true);
 assert.equal((await recordReminderDelivery(event('email.opened'),db)).ignored,true);assert.equal(db.writes,0);
 await assert.rejects(recordReminderDelivery(event(),{runTransaction:async fn=>fn({query:async()=>({rows:[]})})}),/not been recorded/);
});
test('reminder emails carry correlation tags but owner emails do not',async()=>{
 const booking={status:'paid',paid_at:'2026-11-04T12:00:00Z',day:'2026-11-06',time_window:'Morning',total:8000,payload:{email:'patient@example.com'}};
 for(const kind of ['patient_reminder','reminder_delivered'])await deliverNotification(kind,id,{provider:'resend',apiKey:'re_fixture',domain:'omahagentletouchlabs.com',booking,fetchImpl:async(url,options)=>{const body=JSON.parse(options.body);if(kind==='patient_reminder')assert.deepEqual(body.tags,[{name:'notification',value:'patient_reminder'},{name:'booking_id',value:id}]);else{assert.equal(body.tags,undefined);assert.deepEqual(body.to,['gentletouchlabs27@gmail.com']);}return {ok:true,json:async()=>({id:'mail'})};}});
});
test('signed raw webhook works; tampered and missing signatures never access data',async()=>{
 const prior=process.env.VERCEL_ENV;process.env.VERCEL_ENV='production';
 const secret='whsec_'+Buffer.from('test-only-secret-for-webhook-verification').toString('base64');let records=0;
 const handler=createResendWebhookHandler({secret:()=>secret,record:async event=>{assert.equal(event.type,'email.delivered');records++;return {recorded:true}},flush:async()=>({accepted:1})});
 const payload=JSON.stringify(event()),timestamp=new Date(),wh=new Webhook(secret);
 const headers={'svix-id':'msg_fixture','svix-timestamp':String(Math.floor(timestamp.getTime()/1000)),'svix-signature':wh.sign('msg_fixture',timestamp,payload)};
 const run=async(body,h)=>{const req=Object.assign((async function*(){yield Buffer.from(body)})(),{method:'POST',headers:h});const res={code:200,setHeader(){},status(n){this.code=n;return this},json(body){this.body=body;return this}};await handler(req,res);return res};
 try{assert.equal((await run(payload,headers)).code,200);assert.equal((await run(payload+' ',headers)).code,400);assert.equal((await run(payload,{})).code,400);assert.equal(records,1);}
 finally{if(prior===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=prior;}
});
