import {randomUUID} from 'node:crypto';
import {admin,db,hash,transaction} from '../server/services.mjs';
import {ensureRecurringSlots,OPEN_WINDOW} from '../server/availability.mjs';
import {chicagoDay} from '../server/pricing.mjs';
import {resendPatientEmail} from '../server/email-recovery.mjs';
import {deliverNotification} from '../server/notifications.mjs';
export const config={maxDuration:60};
const OWNER='gentletouchlabs27@gmail.com';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(process.env.VERCEL_ENV!=='preview'||process.env.VERIFY_RECOVERY!=='true')return res.status(404).end();
 try{
  admin(req);if(req.method!=='POST')return res.status(405).end();const b=req.body||{};
  if(b.action==='seed'){
   const today=chicagoDay();await ensureRecurringSlots(db(),today);
   const {rows}=await db().query(`SELECT to_char(s.day,'YYYY-MM-DD') AS day,s.time_window FROM payment_slots s WHERE s.day>$1 AND ${OPEN_WINDOW} AND NOT EXISTS(SELECT 1 FROM payment_bookings b WHERE b.day=s.day AND lower(b.payload->>'email')=$2 AND b.status IN ('paid','pending','refund_pending')) ORDER BY s.day,s.start_minute LIMIT 1`,[today,OWNER]);
   if(!rows[0])throw Error('No test window');const id=randomUUID(),slot=rows[0];
   const payload={first_name:'TEST',last_name:'Cancellation recovery',email:OWNER,verification_fixture:true,email_alerts:{patient_cancelled:{attempts:1}}};
   await db().query("INSERT INTO payment_bookings(id,token_hash,request_key,payload,day,time_window,distance_meters,total,travel,status,paid_at,refund_amount,policy_version) VALUES($1,$2,$3,$4::jsonb,$5,$6,0,8000,0,'refund_pending',now(),5500,'TEST ONLY')",[id,hash(randomUUID()),randomUUID(),JSON.stringify(payload),slot.day,slot.time_window]);return res.json({id});
  }
  return res.json(await transaction(async c=>{
   const {rows}=await c.query("SELECT *,to_char(day,'YYYY-MM-DD') AS appointment_day FROM payment_bookings WHERE id=$1 FOR UPDATE",[b.id]);const r=rows[0];if(!r?.payload.verification_fixture||r.payload.email!==OWNER)throw Error('Not a fixture');
   if(b.action==='resend')return resendPatientEmail(c,r,'patient_cancelled',{send:(kind,id,options)=>deliverNotification(kind,id,{...options,provider:'resend',fetchImpl:async(url,request)=>{if(url!=='https://api.resend.com/emails')throw Error('Unexpected destination');const message=JSON.parse(request.body);message.to=[OWNER];message.subject='[TEST] '+message.subject;message.text='TEST ONLY — no real appointment was cancelled and no refund or charge was made.\n\n'+message.text;return fetch(url,{...request,body:JSON.stringify(message)});}})});
   if(b.action==='inspect')return {status:r.status,alert:r.payload.email_alerts.patient_cancelled};
   if(b.action==='cleanup'){await c.query("UPDATE payment_bookings SET status='cancelled' WHERE id=$1",[r.id]);return {released:true};}
   throw Error('Unknown action');
  }));
 }catch(e){return res.status(e.status||500).json({error:e.status===401?'Unauthorized':e.status?e.message:'Test operation failed'});}
}
