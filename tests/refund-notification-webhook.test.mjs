import test from 'node:test';
import assert from 'node:assert/strict';
import {createWebhookHandler} from '../api/stripe-webhook.js';
test('verified refund status changes notify once; duplicate state does not reset the notice',async()=>{
 const old=process.env.STRIPE_SECRET_KEY;process.env.STRIPE_SECRET_KEY='sk_test_fixture';
 try{for(const [previous,next,notify] of [['refund_pending','succeeded',true],['refunded','succeeded',false],['refund_pending','failed',true]]){
  const event={id:'evt_fixture',type:'refund.updated',livemode:false,data:{object:{id:'re_fixture'}}};let update;
  const handler=createWebhookHandler({stripeClient:()=>({webhooks:{constructEvent:()=>event},refunds:{retrieve:async()=>({status:next})}}),runTransaction:async fn=>fn({query:async(sql,args)=>{if(sql.startsWith('INSERT'))return {rowCount:1};if(sql.startsWith('SELECT'))return {rowCount:1,rows:[{status:previous,payload:{email_alerts:{patient_cancelled:{accepted_at:'already-sent'}}}}]};update={sql,args};return {};}}),flush:async()=>{}});
  const req=Object.assign((async function*(){yield Buffer.from('{}')})(),{method:'POST',headers:{'stripe-signature':'fixture'}});const res={status(n){this.code=n;return this},json(value){this.body=value;return this}};
  await handler(req,res);assert.equal(res.body.received,true);assert.equal(update.sql.includes('patient_refund_update'),notify);assert.equal(update.args[1],next==='succeeded'?'refunded':'refund_failed');
 }}finally{if(old===undefined)delete process.env.STRIPE_SECRET_KEY;else process.env.STRIPE_SECRET_KEY=old;}
});
