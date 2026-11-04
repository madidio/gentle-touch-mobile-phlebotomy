import {transaction,fail} from '../server/services.mjs';
import {verifyPatientToken} from '../server/patient-links.mjs';
import {requestPatientChange} from '../server/patient-care.mjs';
import {flushNotifications} from '../server/notifications.mjs';
export const config={maxDuration:60};
export function createPatientAppointmentHandler({runTransaction=transaction,verify=verifyPatientToken,flush=flushNotifications}={}){
 return async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');
  if(req.method!=='POST')return res.status(405).json({error:'POST required'});
  try{
   const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
   if(!verify(b.id,b.token))fail('This private link is invalid or expired. Please reply to your appointment email for help.',403);
   if(!['view','request'].includes(b.action))fail('Unknown action',400);
   const result=await runTransaction(async c=>{
    const {rows}=await c.query("SELECT id,status,paid_at,to_char(day,'YYYY-MM-DD') AS appointment_day,time_window,payload FROM payment_bookings WHERE id=$1 FOR UPDATE",[b.id]);
    const r=rows[0];if(!r)fail('Appointment not found.',404);
    if(b.action==='request')return requestPatientChange(c,r,b);
    return {day:r.appointment_day,window:r.time_window,status:r.status,completed:!!r.payload.visit_completed_at,request:r.payload.change_request||null};
   });
   if(b.action==='request')await flush();
   return res.json(result);
  }catch(e){const status=e.status||500;return res.status(status).json({error:status===500?'Unable to load your appointment. Please reply to your appointment email for help.':e.message});}
 };
}
export default createPatientAppointmentHandler();
