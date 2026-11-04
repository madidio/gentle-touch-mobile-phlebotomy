import {transaction} from './services.mjs';
const supported={'email.delivered':'delivered','email.bounced':'bounced','email.failed':'failed'};
export async function recordReminderDelivery(event,{runTransaction=transaction,now=()=>Date.now()}={}){
 const status=supported[event.type];
 if(!status||event.data?.tags?.notification!=='patient_reminder')return {ignored:true};
 const id=event.data.tags.booking_id,emailId=event.data.email_id;
 if(typeof id!=='string'||!/^[0-9a-f-]{36}$/i.test(id)||typeof emailId!=='string'||!emailId)throw new Error('Invalid reminder event');
 return runTransaction(async c=>{
  const {rows}=await c.query('SELECT id,payload FROM payment_bookings WHERE id=$1 FOR UPDATE',[id]);
  const row=rows[0],events=row?.payload?.email_alerts,reminder=events?.patient_reminder;
  // A very fast delivery may arrive before the send transaction commits. Retry rather than lose it.
  if(!reminder?.provider_id)throw new Error('Reminder send has not been recorded');
  if(reminder.provider!=='resend'||reminder.provider_id!==emailId)return {ignored:true};
  if(reminder[`${status}_at`])return {duplicate:true};
  const timestamp=Number.isFinite(Date.parse(event.created_at))?new Date(event.created_at).toISOString():new Date(now()).toISOString();
  const updated={...events,patient_reminder:{...reminder,[`${status}_at`]:timestamp}};
  const kind=`reminder_${status}`;
  // Do not follow a known failure with a misleading late success alert.
  if(!events[kind] && !(status==='delivered'&&(reminder.bounced_at||reminder.failed_at)))updated[kind]={queued_at:new Date(now()).toISOString()};
  await c.query("UPDATE payment_bookings SET payload=jsonb_set(payload,'{email_alerts}',$2::jsonb,true) WHERE id=$1",[id,JSON.stringify(updated)]);
  return {recorded:true};
 });
}
