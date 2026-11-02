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
