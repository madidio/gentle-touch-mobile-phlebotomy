import {recurringSlots} from '../shared/schedule.mjs';
export async function ensureRecurringSlots(client,today) {
 const slots=recurringSlots(today);
 await client.query(`INSERT INTO payment_slots(day,time_window,start_minute,end_minute,recurring)
 SELECT x.day::date,x.time_window,x.start,x."end",true FROM jsonb_to_recordset($1::jsonb) AS x(day text,time_window text,start integer,"end" integer)
 ON CONFLICT(day,time_window) DO UPDATE SET start_minute=EXCLUDED.start_minute,end_minute=EXCLUDED.end_minute,recurring=true WHERE payment_slots.recurring=false`,[JSON.stringify(slots.map(s=>({...s,time_window:s.window})))]);
}
export const OPEN_WINDOW = `s.recurring=true
 AND NOT EXISTS (SELECT 1 FROM payment_schedule_blocks x WHERE x.day=s.day AND (x.time_window='' OR x.time_window=s.time_window))
 AND NOT EXISTS (SELECT 1 FROM payment_bookings b JOIN payment_slots booked ON booked.day=b.day AND booked.time_window=b.time_window
 WHERE b.day=s.day AND b.status IN ('pending','paid','refund_pending') AND booked.start_minute<s.end_minute AND s.start_minute<booked.end_minute)`;
