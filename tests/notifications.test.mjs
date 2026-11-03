import test from 'node:test';
import assert from 'node:assert/strict';
import {deliverNotification,flushNotifications,notificationMessage,paidNotificationSQL} from '../server/notifications.mjs';
import handler from '../api/payments.js';
test('email content uses the verified owner and admin link, without patient details',()=>{
 for(const kind of ['requested','paid','test']){const body=notificationMessage(kind,'reference');assert.equal(body.email,'gentletouchlabs27@gmail.com');assert.match(body.message,/https:\/\/omahagentletouchlabs.com\/admin\/payments/);assert.equal(body.notification_id,`reference:${kind}`);assert.equal(body.first_name,undefined);assert.equal(body.draw_address,undefined);}
 assert.match(paidNotificationSQL,/jsonb_set/);
});
test('provider acceptance is required and only the Formspree endpoint is allowed',async()=>{
 let calls=0;
 const fetchImpl=async(url,options)=>{calls++;assert.equal(url,'https://formspree.io/f/xgogzqep');assert.equal(options.method,'POST');return {ok:true,json:async()=>({ok:true})};};
 assert.deepEqual(await deliverNotification('test','fixture',{fetchImpl,endpoint:'https://formspree.io/f/xgogzqep'}),{accepted:true});
 for(const endpoint of ['https://example.invalid/f/x','http://formspree.io/f/x','https://formspree.io/f/x?to=other'])await assert.rejects(deliverNotification('test','fixture',{fetchImpl,endpoint}));
 assert.equal(calls,1);
 for(const response of [{ok:false,json:async()=>({})},{ok:true,json:async()=>({})},{ok:true,json:async()=>{throw Error('HTML');}}])await assert.rejects(deliverNotification('test','fixture',{fetchImpl:async()=>response}));
});
test('notification failures are retained with backoff, then accepted once on retry',async()=>{
 const time=Date.parse('2026-11-03T12:00:00Z');let current=time;let events={requested:{queued_at:new Date(time).toISOString()}};let calls=0;
 const transaction=async fn=>fn({query:async(sql,args)=>{if(sql.startsWith('SELECT'))return {rows:[{id:'fixture',email_alerts:events}]};events=JSON.parse(args[1]);return {};}});
 const send=async()=>{if(++calls===1)throw Error('Delivery rejected');};
 const options={transaction,send,enabled:true,now:()=>current};
 const failed=await flushNotifications(options);assert.equal(failed.failed,1);assert.equal(events.requested.accepted_at,undefined);assert.equal(events.requested.next_attempt_at,'2026-11-03T12:01:00.000Z');
 await flushNotifications(options);assert.equal(calls,1);
 current+=60000;const sent=await flushNotifications(options);assert.equal(sent.accepted,1);assert.ok(events.requested.accepted_at);
 await flushNotifications(options);assert.equal(calls,2);
});
test('notification processing failure never throws into a booking or webhook',async()=>{
 const result=await flushNotifications({enabled:true,transaction:async()=>{throw Error('Database temporarily unavailable');}});assert.equal(result.retryPending,true);
});
test('preview does not send email and tests require administrator authentication',async()=>{
 let called=false;await flushNotifications({enabled:false,transaction:async()=>{called=true;}});assert.equal(called,false);
 const old=process.env.PAYMENTS_ENABLED,token=process.env.PAYMENTS_ADMIN_TOKEN;process.env.PAYMENTS_ENABLED='true';delete process.env.PAYMENTS_ADMIN_TOKEN;
 const res={code:200,setHeader(){},status(n){this.code=n;return this;},json(body){this.body=body;return this;}};
 try{await handler({method:'POST',headers:{},query:{action:'test_notification'},body:{}},res);assert.equal(res.code,401);}finally{if(old===undefined)delete process.env.PAYMENTS_ENABLED;else process.env.PAYMENTS_ENABLED=old;if(token!==undefined)process.env.PAYMENTS_ADMIN_TOKEN=token;}
});
