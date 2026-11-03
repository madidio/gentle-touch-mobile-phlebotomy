import test from 'node:test';
import assert from 'node:assert/strict';
import {routePrice} from '../server/services.mjs';
test('the business address has zero travel without a zero-length Google route',async()=>{
 const original=global.fetch;global.fetch=async()=>{throw new Error('No route request expected');};
 try{for(const address of ['623 N 132nd St Omaha NE 68154','623 N 132nd St, Omaha, NE 68154']){
  const quote=await routePrice(address);assert.equal(quote.distanceMeters,0);assert.equal(quote.travel,0);assert.equal(quote.total,8000);
 }}finally{global.fetch=original;}
});
