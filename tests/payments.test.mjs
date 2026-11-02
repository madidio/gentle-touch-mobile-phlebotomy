import test from 'node:test';
import assert from 'node:assert/strict';
import {price,refundAmount,chicagoDay} from '../server/pricing.mjs';
test('included mileage and fractional mileage cent rounding',()=>{
 assert.equal(price(0).total,8000);assert.equal(price(40233).travel,0);
 assert.equal(price(64374).travel,1088);assert.equal(price(80467).travel,1812);
 assert.throws(()=>price(-1));assert.throws(()=>price(NaN));
});
test('calendar-day refund uses Omaha midnight, including DST',()=>{
 assert.equal(chicagoDay(new Date('2026-10-31T04:59:59Z')),'2026-10-30');
 assert.equal(refundAmount(9088,'2026-10-31',false,new Date('2026-10-31T04:59:59Z')),6588);
 assert.equal(refundAmount(9088,'2026-10-31',false,new Date('2026-10-31T05:00:00Z')),0);
 assert.equal(refundAmount(9088,'2026-10-31',true,new Date('2026-10-31T05:00:00Z')),9088);
});
import handler from '../api/payments.js';
import webhook from '../api/stripe-webhook.js';
function response(){return {code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(data){this.data=data;return this;},end(){return this;}};}
test('payments fail closed until explicitly enabled',async()=>{delete process.env.PAYMENTS_ENABLED;const r=response();await handler({method:'POST',query:{action:'checkout'}},r);assert.equal(r.code,503);});
test('invalid webhook signature cannot update appointments',async()=>{const r=response();await webhook({method:'POST',headers:{},async *[Symbol.asyncIterator](){yield Buffer.from('{}');}},r);assert.equal(r.code,400);});
test('admin routes reject missing credentials before reading appointments',async()=>{process.env.PAYMENTS_ENABLED='true';delete process.env.PAYMENTS_ADMIN_TOKEN;const r=response();await handler({method:'POST',query:{action:'list'},headers:{},body:{}},r);assert.equal(r.code,401);delete process.env.PAYMENTS_ENABLED;});

import Stripe from 'stripe';
import {createWebhookHandler} from '../api/stripe-webhook.js';
for(const version of ['2024-06-20','2026-03-25.dahlia']) {
 for(const scenario of ['paid','wrong amount','unpaid','duplicate']) {
  test(`${version} signed invoice snapshot: ${scenario}`,async()=>{
   const previous=process.env.STRIPE_SECRET_KEY;
   const previousSigning=process.env.STRIPE_WEBHOOK_SECRET;
   process.env.STRIPE_SECRET_KEY='sk_test_fixture';
   process.env.STRIPE_WEBHOOK_SECRET='whsec_fixture';
   try {
    const sdk=new Stripe('sk_test_fixture',{apiVersion:'2024-06-20'});
    const updates=[];let retrieved=false;
    const client={webhooks:sdk.webhooks,invoices:{retrieve:async(id,options)=>{
     retrieved=true;assert.equal(id,'in_fixture');assert.deepEqual(options,{expand:['payment_intent']});
     return {status:scenario==='unpaid'?'open':'paid',amount_paid:scenario==='wrong amount'?7900:8000,total:8000,currency:'usd',payment_intent:{id:'pi_fixture',status:'succeeded',amount_received:8000}};
    }}};
    const handler=createWebhookHandler({stripeClient:()=>client,runTransaction:async fn=>fn({query:async(sql,args)=>{
     if(sql.startsWith('INSERT'))return {rowCount:scenario==='duplicate'?0:1};
     if(sql.startsWith('SELECT'))return {rows:[{id:'booking_fixture',total:8000,status:'pending'}]};
     updates.push(args);return {rowCount:1};
    }})});
    // Modern snapshots deliberately omit the removed invoice.payment_intent field.
    const payload=JSON.stringify({id:'evt_fixture',api_version:version,type:'invoice.payment_succeeded',livemode:false,data:{object:{id:'in_fixture',object:'invoice',metadata:{booking_id:'booking_fixture'},...(version==='2024-06-20'?{payment_intent:'pi_fixture'}:{payments:{data:[]}})}}});
    const signature=sdk.webhooks.generateTestHeaderString({payload,secret:'whsec_fixture'});
    const res=response();await handler({method:'POST',headers:{'stripe-signature':signature},async *[Symbol.asyncIterator](){yield Buffer.from(payload);}},res);
    assert.equal(res.code,['paid','duplicate'].includes(scenario)?200:500);
    assert.equal(updates.length,scenario==='paid'?1:0);
    assert.equal(retrieved,scenario!=='duplicate');
   }finally{
    if(previous===undefined)delete process.env.STRIPE_SECRET_KEY;else process.env.STRIPE_SECRET_KEY=previous;
    if(previousSigning===undefined)delete process.env.STRIPE_WEBHOOK_SECRET;else process.env.STRIPE_WEBHOOK_SECRET=previousSigning;
   }
  });
 }
}
