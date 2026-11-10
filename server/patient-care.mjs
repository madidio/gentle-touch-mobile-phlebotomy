import {randomUUID} from 'node:crypto';
import {fail} from './services.mjs';
import {chicagoDay} from './pricing.mjs';
import {addDays,BOOKING_DAYS,validDay,windowsForDay} from '../shared/schedule.mjs';
import {OPEN_WINDOW} from './availability.mjs';
async function checkSameDayReschedule(c, booking, requestedAt) {
 const requestedDay = chicagoDay(new Date(requestedAt));
 if (requestedDay !== booking.appointment_day) return false;
 if (booking.payload.same_day_rescheduled_at) {
  fail('The one-time same-day reschedule has already been used. Please contact us.',409);
 }
 const window = await c.query(
  "SELECT 1 FROM payment_slots WHERE day=$1 AND time_window=$2 AND (day+start_minute*interval '1 minute') AT TIME ZONE 'America/Chicago' > $3::timestamptz",
  [booking.appointment_day,booking.time_window,requestedAt],
 );
 if (!window.rowCount) fail('Same-day reschedule requests must be made before the arrival window begins.',409);
 return true;
}
export async function requestPatientChange(c,r,b,{today=chicagoDay()}={}){
 if(r.status!=='paid'||r.payload.visit_completed_at||r.appointment_day<today)fail('This appointment cannot be changed online. Please contact us.',409);
 if(r.payload.change_request?.status==='pending')return {requested:true,request:r.payload.change_request};
 if(!['reschedule','cancel'].includes(b.kind))fail('Select a change type.',400);
 const requestedAt=new Date().toISOString();
 if(b.kind==='reschedule'){
  await checkSameDayReschedule(c,r,requestedAt);
  if(!validDay(b.day)||b.day<=today||b.day>addDays(today,BOOKING_DAYS)||!windowsForDay(b.day).includes(b.window))fail('Select a future date and arrival window.',400);
  if(b.day===r.appointment_day&&b.window===r.time_window)fail('Choose a different window.',400);
  const open=await c.query(`SELECT 1 FROM payment_slots s WHERE s.day=$1 AND s.time_window=$2 AND ${OPEN_WINDOW}`,[b.day,b.window]);
  if(!open.rowCount)fail('That window is unavailable. Please choose another.',409);
 }
 const request={id:randomUUID(),kind:b.kind,status:'pending',requested_at:requestedAt,...(b.kind==='reschedule'?{day:b.day,window:b.window}:{})};
 const payload={...r.payload,change_request:request,email_alerts:{...r.payload.email_alerts,change_requested:{queued_at:request.requested_at,key:request.id}}};
 await c.query('UPDATE payment_bookings SET payload=$2::jsonb WHERE id=$1',[r.id,JSON.stringify(payload)]);
 return {requested:true,request};
}
export async function completeVisit(c,r,{today=chicagoDay()}={}){
 if(r.status!=='paid')fail('Only paid appointments can be marked completed.',409);
 if(r.appointment_day>today)fail('A future visit cannot be marked completed.',409);
 if(r.payload.change_request?.status==='pending')fail('Resolve the pending change request first.',409);
 if(r.payload.visit_completed_at)return {completed:true};
 const payload={...r.payload,visit_completed_at:new Date().toISOString(),email_alerts:{...r.payload.email_alerts,patient_review:{queued_at:new Date().toISOString()}}};
 await c.query('UPDATE payment_bookings SET payload=$2::jsonb WHERE id=$1',[r.id,JSON.stringify(payload)]);
 return {completed:true};
}
export async function approveReschedule(c,r,requestId){
 const request=r.payload.change_request;
 if(r.status!=='paid'||r.payload.visit_completed_at||request?.status!=='pending'||request.kind!=='reschedule'||request.id!==requestId)fail('No matching pending reschedule request.',409);
 if(request.day<=chicagoDay())fail('The requested date has passed. Contact the patient.',409);
 const sameDay=request.requested_at && await checkSameDayReschedule(c,r,request.requested_at);
 for(const day of [...new Set([r.appointment_day,request.day])].sort())await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[day]);
 const open=await c.query(`SELECT 1 FROM payment_slots s WHERE s.day=$1 AND s.time_window=$2 AND ${OPEN_WINDOW}`,[request.day,request.window]);
 if(!open.rowCount)fail('The requested window is no longer available. Contact the patient.',409);
 const payload={...r.payload,...(sameDay?{same_day_rescheduled_at:new Date().toISOString()}:{}),preferred_date:request.day,preferred_time:request.window,change_request:{...request,status:'approved',resolved_at:new Date().toISOString()},email_alerts:{...r.payload.email_alerts,patient_updated:{queued_at:new Date().toISOString(),key:request.id}}};
 // A new reminder is needed for the new window. Old delivery webhooks no longer match its provider ID.
 delete payload.email_alerts.patient_reminder;
 for(const kind of ['reminder_delivered','reminder_bounced','reminder_failed'])delete payload.email_alerts[kind];
 await c.query('UPDATE payment_bookings SET day=$2,time_window=$3,payload=$4::jsonb WHERE id=$1',[r.id,request.day,request.window,JSON.stringify(payload)]);
 return {rescheduled:true};
}
