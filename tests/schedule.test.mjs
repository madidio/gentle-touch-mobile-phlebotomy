import test from 'node:test';
import assert from 'node:assert/strict';
import {windowsForDay,recurringSlots,WINDOW_MINUTES,validDay,overlaps,addDays} from '../shared/schedule.mjs';
import handler from '../api/payments.js';

test('weekday windows cover 6am to 6pm without gaps or overlaps',()=>{
 const spans=windowsForDay('2026-11-02').map(w=>WINDOW_MINUTES[w]);
 assert.deepEqual(spans,[[360,540],[540,720],[720,900],[900,1080]]);
});
test('Saturday is exactly 8am to 3pm and Sunday is closed',()=>{
 assert.deepEqual(windowsForDay('2026-11-07').map(w=>WINDOW_MINUTES[w]),[[480,660],[660,840],[840,900]]);
 assert.deepEqual(windowsForDay('2026-11-08'),[]);
 assert.deepEqual(windowsForDay('2026-02-30'),[]);
 assert.equal(validDay('2026-02-30'),false);
});
test('90-day rolling horizon uses local calendar dates across DST and year boundary',()=>{
 for(const today of ['2026-10-31','2026-12-31','2027-03-13']) {
  const slots=recurringSlots(today);assert.ok(slots.length>200);
  for(const slot of slots){assert.ok(slot.day>today&&slot.day<=addDays(today,90));assert.ok(windowsForDay(slot.day).includes(slot.window));}
  assert.equal(new Set(slots.map(s=>s.day+s.window)).size,slots.length);
 }
});
test('legacy windows block overlapping new windows but not adjacent windows',()=>{
 assert.equal(overlaps(WINDOW_MINUTES['Afternoon (1pm-4pm)'],WINDOW_MINUTES['Afternoon (12pm-3pm)']),true);
 assert.equal(overlaps(WINDOW_MINUTES['Afternoon (1pm-4pm)'],WINDOW_MINUTES['Evening (3pm-6pm)']),true);
 assert.equal(overlaps(WINDOW_MINUTES['Morning (6am-9am)'],WINDOW_MINUTES['Midday (9am-12pm)']),false);
});
for(const action of ['schedule','block','unblock'])test(`${action} requires administrator authentication`,async()=>{
 const saved=process.env.PAYMENTS_ENABLED;process.env.PAYMENTS_ENABLED='true';
 try{const r={code:200,setHeader(){},status(n){this.code=n;return this;},json(){return this;}};await handler({method:'POST',query:{action},headers:{},body:{}},r);assert.equal(r.code,401);}
 finally{if(saved===undefined)delete process.env.PAYMENTS_ENABLED;else process.env.PAYMENTS_ENABLED=saved;}
});
