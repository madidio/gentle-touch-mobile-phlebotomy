// Run with an existing pg client on an isolated test database after migration 002.
// Every synthetic change rolls back, including on failure.
import assert from 'node:assert/strict';
import {ensureRecurringSlots,OPEN_WINDOW} from '../server/availability.mjs';
import {recurringSlots} from '../shared/schedule.mjs';
export async function verifyAvailabilityDatabase(client) {
 await client.query('BEGIN');
 try {
  const today='2098-01-01';await ensureRecurringSlots(client,today);await ensureRecurringSlots(client,today);
  const all=recurringSlots(today);const day=all.find(s=>s.window==='Afternoon (12pm-3pm)').day;
  const count=async window=>(await client.query(`SELECT 1 FROM payment_slots s WHERE s.day=$1 AND s.time_window=$2 AND ${OPEN_WINDOW}`,[day,window])).rowCount;
  assert.equal(await count('Afternoon (12pm-3pm)'),1);
  await client.query("INSERT INTO payment_schedule_blocks(day,time_window,reason) VALUES($1,'','Synthetic holiday')",[day]);
  assert.equal(await count('Morning (6am-9am)'),0);
  await client.query('DELETE FROM payment_schedule_blocks WHERE day=$1',[day]);
  await client.query("INSERT INTO payment_schedule_blocks(day,time_window) VALUES($1,'Morning (6am-9am)')",[day]);
  assert.equal(await count('Morning (6am-9am)'),0);assert.equal(await count('Midday (9am-12pm)'),1);
  await client.query("INSERT INTO payment_slots(day,time_window,start_minute,end_minute) VALUES($1,'Afternoon (1pm-4pm)',780,960) ON CONFLICT DO NOTHING",[day]);
  await client.query(`INSERT INTO payment_bookings(id,token_hash,request_key,payload,day,time_window,distance_meters,total,travel,policy_version,status,channel)
   VALUES('00000000-0000-4000-8000-000000000099','test','10000000-0000-4000-8000-000000000099','{"email":"schedule-test@example.invalid"}',$1,'Afternoon (1pm-4pm)',0,8000,0,'test','pending','checkout')`,[day]);
  assert.equal(await count('Afternoon (12pm-3pm)'),0);assert.equal(await count('Evening (3pm-6pm)'),0);
  assert.equal(await count('Midday (9am-12pm)'),1);
  await client.query('SAVEPOINT overlapping_reservation');
  await assert.rejects(client.query(`INSERT INTO payment_bookings(id,token_hash,request_key,payload,day,time_window,distance_meters,total,travel,policy_version,status,channel)
   VALUES('00000000-0000-4000-8000-000000000098','test','10000000-0000-4000-8000-000000000098','{"email":"other-schedule@example.invalid"}',$1,'Evening (3pm-6pm)',0,8000,0,'test','pending','invoice')`,[day]),e=>e.code==='23505');
  await client.query('ROLLBACK TO SAVEPOINT overlapping_reservation');
 } finally {await client.query('ROLLBACK');}
}
