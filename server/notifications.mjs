import {transaction as runTransaction} from './services.mjs';
export const paidNotificationSQL = "payload=jsonb_set(payload,'{email_alerts}',COALESCE(payload->'email_alerts','{}'::jsonb)||jsonb_build_object('paid',jsonb_build_object('queued_at',now())),true)";
export function notificationMessage(kind,id){
 const titles={requested:'New appointment request — review and send invoice',paid:'Appointment confirmed — payment received',test:'Gentle Touch email alerts — delivery test'};
 if(!titles[kind])throw new Error('Unknown email notification');
 return {_subject:(process.env.PAID_EMAIL_VERIFICATION==='true'?'[TEST] ':'')+titles[kind],email:'gentletouchlabs27@gmail.com',form_type:'Booking notification',notification_id:`${id}:${kind}`,message:`${titles[kind]}. ${kind==='test'?'This is a test only. No appointment, invoice, or charge was created.':'Open Payments Admin to review the details.'} Sign in at https://omahagentletouchlabs.com/admin/payments. Patient details are available in the administrator page.`};
}
export async function deliverNotification(kind,id,{fetchImpl=fetch,endpoint=process.env.VITE_FORMSPREE_ENDPOINT||'https://formspree.io/f/xgogzqep'}={}){
 const url=new URL(endpoint);if(url.protocol!=='https:'||url.hostname!=='formspree.io'||!/^\/f\/[a-zA-Z0-9]+$/.test(url.pathname)||url.search||url.username||url.password)throw new Error('Email notification endpoint is invalid.');
 const response=await fetchImpl(url.href,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(notificationMessage(kind,id)),signal:AbortSignal.timeout(5000)});
 const data=await response.json().catch(()=>null);
 if(!response.ok || !(data?.ok===true||data?.success===true))throw new Error('Email service did not accept the notification. Delivery has not been confirmed.');
 return {accepted:true};
}
// Queued in the same booking transaction; sending happens only after it commits.
// Failed sends remain durable and are retried on availability/admin reads or webhooks.
export async function flushNotifications({transaction=runTransaction,send=deliverNotification,enabled=(process.env.VERCEL_ENV==='production'||(process.env.VERCEL_ENV==='preview'&&process.env.PAID_EMAIL_VERIFICATION==='true')),now=()=>Date.now()}={}){
 if(!enabled)return {accepted:0,failed:0,disabled:true};
 try{return await transaction(async c=>{
  const result={accepted:0,failed:0};
  const {rows}=await c.query(`SELECT id,payload->'email_alerts' AS email_alerts FROM payment_bookings b WHERE EXISTS (SELECT 1 FROM jsonb_each(COALESCE(b.payload->'email_alerts','{}'::jsonb)) e WHERE NOT (e.value ? 'accepted_at') AND (e.value->>'next_attempt_at' IS NULL OR (e.value->>'next_attempt_at')::timestamptz<=now())) ORDER BY created_at LIMIT 3 FOR UPDATE SKIP LOCKED`);
  for(const row of rows){
   const events={...row.email_alerts};
   for(const [kind,event] of Object.entries(events)){
    if(event.accepted_at || (event.next_attempt_at&&Date.parse(event.next_attempt_at)>now()))continue;
    const attempts=(event.attempts||0)+1;
    try{await send(kind,row.id);events[kind]={...event,attempts,accepted_at:new Date(now()).toISOString()};result.accepted++;}
    catch{events[kind]={...event,attempts,next_attempt_at:new Date(now()+Math.min(3600,60*2**Math.min(attempts-1,6))*1000).toISOString()};result.failed++;}
   }
   await c.query("UPDATE payment_bookings SET payload=jsonb_set(payload,'{email_alerts}',$2::jsonb,true) WHERE id=$1",[row.id,JSON.stringify(events)]);
  }
  return result;
 });}catch{console.error('Email notification queue could not be processed; retry remains pending.');return {accepted:0,failed:0,retryPending:true};}
}
