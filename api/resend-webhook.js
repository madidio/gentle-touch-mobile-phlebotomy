import {Webhook} from 'svix';
import {recordReminderDelivery} from '../server/reminder-delivery.mjs';
import {flushNotifications} from '../server/notifications.mjs';
export const config={api:{bodyParser:false},maxDuration:60};
export function createResendWebhookHandler({record=recordReminderDelivery,flush=flushNotifications,secret=()=>process.env.RESEND_WEBHOOK_SECRET}={}){
 return async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).end();
  if(process.env.VERCEL_ENV!=='production'||!secret())return res.status(503).json({error:'Delivery tracking is not configured'});
  let event;
  try{
   const chunks=[];let size=0;for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>256*1024)throw Error('Payload too large');chunks.push(Buffer.from(chunk));}
   event=new Webhook(secret()).verify(Buffer.concat(chunks).toString('utf8'),req.headers);
  }catch{return res.status(400).json({error:'Invalid webhook signature'});}
  try{const result=await record(event);await flush();return res.json({received:true,...result});}
  catch{console.error('Reminder delivery event could not be recorded');return res.status(500).json({error:'Retry required'});}
 };
}
export default createResendWebhookHandler();
