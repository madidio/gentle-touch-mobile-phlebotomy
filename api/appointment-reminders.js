import {timingSafeEqual,createHash} from 'node:crypto';
import {sendAppointmentReminders} from '../server/reminders.mjs';
export const config={maxDuration:300};
export function createReminderHandler({send=sendAppointmentReminders}={}){
 return async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).end();
  const expected=process.env.CRON_SECRET;
  const actual=req.headers.authorization||'';
  const target=`Bearer ${expected}`;
  if(!expected||expected.length<32||!timingSafeEqual(createHash('sha256').update(actual).digest(),createHash('sha256').update(target).digest()))return res.status(401).json({error:'Unauthorized'});
  if(process.env.VERCEL_ENV!=='production')return res.status(503).json({error:'Reminders are disabled outside production'});
  try{return res.json(await send());}catch{console.error('Appointment reminder run failed');return res.status(500).json({error:'Reminder run failed'});}
 };
}
export default createReminderHandler();
