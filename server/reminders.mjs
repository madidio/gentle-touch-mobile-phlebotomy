import {transaction} from './services.mjs';
import {deliverNotification} from './notifications.mjs';
// The row lock serializes cancellation and concurrent reminder runs. No patient data is logged.
export const reminderSQL=`SELECT b.id,b.status,b.paid_at,b.day::text AS day,b.time_window,b.total,b.payload
FROM payment_bookings b JOIN payment_slots s ON s.day=b.day AND s.time_window=b.time_window
WHERE b.payload->>'visit_completed_at' IS NULL AND b.status='paid' AND b.paid_at IS NOT NULL
AND b.day BETWEEN (now() AT TIME ZONE 'America/Chicago')::date AND (now() AT TIME ZONE 'America/Chicago')::date+1
AND (b.day+s.start_minute*interval '1 minute') AT TIME ZONE 'America/Chicago'>now()
AND NOT (COALESCE(b.payload->'email_alerts'->'patient_reminder','{}'::jsonb) ? 'accepted_at')
ORDER BY b.day,s.start_minute LIMIT 40 FOR UPDATE OF b SKIP LOCKED`;
export async function sendAppointmentReminders({runTransaction=transaction,send=deliverNotification,now=()=>Date.now()}={}){
 return runTransaction(async c=>{
  const {rows}=await c.query(reminderSQL);const result={accepted:0,failed:0};
  for(const booking of rows){
   const previous=booking.payload.email_alerts?.patient_reminder||{};
   const event={...previous,attempts:(previous.attempts||0)+1,last_attempt_at:new Date(now()).toISOString()};
   try{
    const delivery=await send('patient_reminder',booking.id,{booking});
    Object.assign(event,{accepted_at:new Date(now()).toISOString(),provider:delivery.provider,provider_id:delivery.providerId});result.accepted++;
   }catch{result.failed++;}
   await c.query("UPDATE payment_bookings SET payload=jsonb_set(payload,'{email_alerts}',COALESCE(payload->'email_alerts','{}'::jsonb)||jsonb_build_object('patient_reminder',$2::jsonb),true) WHERE id=$1",[booking.id,JSON.stringify(event)]);
  }
  return result;
 });
}
