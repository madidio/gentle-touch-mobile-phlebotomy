import {randomUUID} from 'node:crypto';
import {admin,db,hash,transaction} from '../server/services.mjs';
import {ensureRecurringSlots,OPEN_WINDOW} from '../server/availability.mjs';
import {chicagoDay} from '../server/pricing.mjs';
import {patientManageURL} from '../server/patient-links.mjs';
import {deliverNotification} from '../server/notifications.mjs';
import {completeVisit} from '../server/patient-care.mjs';
export const config={maxDuration:60};
const OWNER='gentletouchlabs27@gmail.com';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(process.env.VERCEL_ENV!=='preview'||process.env.VERIFY_PATIENT_CARE!=='true')return res.status(404).end();
 try{
  admin(req);if(req.method!=='POST')return res.status(405).end();
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
  if(body.action==='seed'){
   const today=chicagoDay();await ensureRecurringSlots(db(),today);
   const {rows}=await db().query(`SELECT to_char(s.day,'YYYY-MM-DD') AS day,s.time_window FROM payment_slots s WHERE s.day>$1 AND ${OPEN_WINDOW} ORDER BY s.day,s.start_minute LIMIT 1`,[today]);
   const slot=rows[0];if(!slot)throw Error('No test slot available');
   const id=randomUUID(),payload={first_name:'TEST',last_name:'Patient Care',email:OWNER,phone:'0000000000',draw_address:'TEST ONLY — no visit',verification_fixture:true};
   await db().query("INSERT INTO payment_bookings(id,token_hash,request_key,payload,day,time_window,distance_meters,total,travel,status,paid_at,policy_version) VALUES($1,$2,$3,$4::jsonb,$5,$6,0,8000,0,'paid',now(),'TEST ONLY')",[id,hash(randomUUID()),randomUUID(),JSON.stringify(payload),slot.day,slot.time_window]);
   return res.json({id,day:slot.day,window:slot.time_window,url:patientManageURL(id,slot.day).replace('https://omahagentletouchlabs.com',`https://${process.env.VERCEL_URL}`)});
  }
  const {rows}=await db().query("SELECT *,to_char(day,'YYYY-MM-DD') AS day,to_char(day,'YYYY-MM-DD') AS appointment_day FROM payment_bookings WHERE id=$1",[body.id]);const row=rows[0];
  if(!row?.payload.verification_fixture||row.payload.email!==OWNER)throw Error('Not a test fixture');
  if(body.action==='inspect')return res.json({status:row.status,day:row.day,window:row.time_window,request:row.payload.change_request,completed:!!row.payload.visit_completed_at,alerts:row.payload.email_alerts});
  if(body.action==='complete'){
   // Move only this synthetic test fixture to a free window today to exercise completion.
   const today=chicagoDay();const {rows:slots}=await db().query(`SELECT s.time_window FROM payment_slots s WHERE s.day=$1 AND ${OPEN_WINDOW} ORDER BY s.start_minute LIMIT 1`,[today]);
   if(!slots[0])throw Error('No completion test slot');
   await db().query("UPDATE payment_bookings SET day=$2,time_window=$3,payload=payload-'change_request' WHERE id=$1",[row.id,today,slots[0].time_window]);
   await transaction(async c=>{const {rows}=await c.query("SELECT *,to_char(day,'YYYY-MM-DD') AS appointment_day FROM payment_bookings WHERE id=$1 FOR UPDATE",[row.id]);await completeVisit(c,rows[0]);});
   return res.json({completed:true});
  }
  if(body.action==='email'){
   if(!['patient_paid','patient_updated','patient_review'].includes(body.kind))throw Error('Unsupported template');
   const result=await deliverNotification(body.kind,row.id,{provider:'resend',booking:row,fetchImpl:async(url,options)=>{
    if(url!=='https://api.resend.com/emails')throw Error('Unexpected provider');
    const message=JSON.parse(options.body);message.to=[OWNER];message.subject='[TEST] '+message.subject;message.text='TEST ONLY — no real appointment, payment or charge.\n\n'+message.text.replaceAll('https://omahagentletouchlabs.com/manage-appointment',`https://${process.env.VERCEL_URL}/manage-appointment`);
    return fetch(url,{...options,body:JSON.stringify(message)});
   }});return res.json(result);
  }
  if(body.action==='cleanup'){await db().query("UPDATE payment_bookings SET status='cancelled' WHERE id=$1",[row.id]);return res.json({released:true});}
  return res.status(400).json({error:'Unknown action'});
 }catch(e){return res.status(e.status||500).json({error:e.status===401?'Unauthorized':'Test operation failed'});}
}
