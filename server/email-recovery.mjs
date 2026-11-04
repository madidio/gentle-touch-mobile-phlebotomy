import {randomUUID} from 'node:crypto';
import {deliverNotification,patientCareMessage} from './notifications.mjs';
import {fail} from './services.mjs';
import {PATIENT_EMAIL_LABELS} from '../shared/admin-dashboard.mjs';
export async function resendPatientEmail(c,booking,kind,{send=deliverNotification,now=()=>Date.now()}={}){
 if(!PATIENT_EMAIL_LABELS[kind])fail('Choose a supported patient email.',400);
 const previous=booking.payload.email_alerts?.[kind];
 if(!previous||(!previous.bounced_at&&!previous.failed_at&&(previous.accepted_at||!previous.attempts)))fail('Only failed emails or messages awaiting retry can be resent.',409);
 if(previous.last_manual_at&&now()-Date.parse(previous.last_manual_at)<60000)fail('Please wait one minute before retrying.',429);
 // Validate against current booking state, not the state at the original send.
 try{patientCareMessage(kind,booking.id,{...booking,day:booking.appointment_day});}catch{fail('This email no longer matches the current appointment. Contact the patient directly.',409);}
 if(['patient_paid','patient_updated','patient_reminder'].includes(kind)){
  if(booking.payload.visit_completed_at)fail('This visit is already completed.',409);
  const upcoming=await c.query("SELECT 1 FROM payment_slots WHERE day=$1 AND time_window=$2 AND (day+start_minute*interval '1 minute') AT TIME ZONE 'America/Chicago'>now()",[booking.appointment_day,booking.time_window]);
  if(!upcoming.rowCount)fail('This appointment window has already started. Contact the patient directly.',409);
 }
 const timestamp=new Date(now()).toISOString(),key=randomUUID();
 const history=[...(previous.history||[]),{provider_id:previous.provider_id,accepted_at:previous.accepted_at,bounced_at:previous.bounced_at,failed_at:previous.failed_at}].slice(-3);
 const event={queued_at:timestamp,last_manual_at:timestamp,key,history,attempts:1};let accepted=false;
 try{const result=await send(kind,booking.id,{booking:{...booking,day:booking.appointment_day},deliveryKey:key});if(!result?.accepted)throw Error('Not accepted');Object.assign(event,{accepted_at:new Date(now()).toISOString(),provider:result.provider,provider_id:result.providerId});accepted=true;}
 catch{event.next_attempt_at=new Date(now()+60000).toISOString();}
 const events={...booking.payload.email_alerts,[kind]:event};
 await c.query("UPDATE payment_bookings SET payload=jsonb_set(payload,'{email_alerts}',$2::jsonb,true) WHERE id=$1",[booking.id,JSON.stringify(events)]);
 return {accepted,queued:!accepted};
}
