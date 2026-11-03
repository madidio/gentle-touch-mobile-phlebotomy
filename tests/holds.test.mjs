import test from 'node:test';
import assert from 'node:assert/strict';
import {holdDeadline,expireInvoiceHolds} from '../server/holds.mjs';
test('hold deadline is capped at 24 hours or Omaha window start across DST',()=>{
 assert.equal(holdDeadline('2026-11-04','Morning (6am-9am)',Date.parse('2026-11-02T23:00:00Z')),'2026-11-03T23:00:00.000Z');
 assert.equal(holdDeadline('2026-11-03','Morning (6am-9am)',Date.parse('2026-11-02T23:00:00Z')),'2026-11-03T12:00:00.000Z');
 assert.equal(holdDeadline('2026-07-07','Morning (6am-9am)',Date.parse('2026-07-06T23:00:00Z')),'2026-07-07T11:00:00.000Z');
 assert.equal(holdDeadline('2026-03-09','Morning (6am-9am)',Date.parse('2026-03-08T22:00:00Z')),'2026-03-09T11:00:00.000Z');
});
for(const mode of ['no invoice','open','paid','Stripe failure'])test(`expired hold reconciliation: ${mode}`,async()=>{
 const events=[];
 const r={id:'hold',invoice_id:mode==='no invoice'?null:'in_fixture'};
 const c={query:async sql=>{if(sql.startsWith('SELECT')){assert.match(sql,/FOR UPDATE SKIP LOCKED/);return {rows:[r]};}events.push('release');return {};}};
 const deps={transaction:async fn=>fn(c),stripe:()=>({invoices:{retrieve:async()=>{events.push('retrieve');if(mode==='Stripe failure')throw Error('Unavailable');return {id:'in_fixture',status:mode==='paid'?'paid':'open'};},voidInvoice:async()=>{events.push('void');return {status:'void'};}}})};
 if(mode==='Stripe failure')await assert.rejects(expireInvoiceHolds(deps));else await expireInvoiceHolds(deps);
 assert.deepEqual(events,mode==='no invoice'?['release']:mode==='open'?['retrieve','void','release']:['retrieve']);
});
