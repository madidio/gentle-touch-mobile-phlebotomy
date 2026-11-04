import {refundBookingStatus,refundUpdateNotificationSQL} from '../server/refund-notices.mjs';
import {flushNotifications,paidNotificationSQL} from '../server/notifications.mjs';
import { stripe, stripeMode, transaction } from '../server/services.mjs';
export const config={api:{bodyParser:false},maxDuration:60};
export function createWebhookHandler({stripeClient=stripe,runTransaction=transaction,flush=flushNotifications}={}){
 return async function handler(req,res){
 if(req.method!=='POST') return res.status(405).end();
 let event;
 try {const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>1024*1024) throw new Error('Too large');chunks.push(chunk);}event=stripeClient().webhooks.constructEvent(Buffer.concat(chunks),req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET);}catch{return res.status(400).json({error:'Invalid webhook signature'});}
 try {
 await runTransaction(async c=>{
  const seen=await c.query('INSERT INTO payment_events(id) VALUES($1) ON CONFLICT DO NOTHING RETURNING id',[event.id]);if(!seen.rowCount)return;
  const o=event.data.object;
  const s=stripeClient();
  if(event.livemode !== (stripeMode()==='live')) throw new Error('Wrong mode');
  if(['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.expired'].includes(event.type)){
   const {rows}=await c.query('SELECT * FROM payment_bookings WHERE checkout_id=$1 FOR UPDATE',[o.id]);const r=rows[0];if(!r){if(o.metadata?.booking_id) throw new Error('Booking not yet linked');return;}
   if(event.type==='checkout.session.expired'){if(r.status==='pending')await c.query("UPDATE payment_bookings SET status='expired' WHERE id=$1",[r.id]);return;}
   if(o.payment_status!=='paid')return;
   const pi=await s.paymentIntents.retrieve(o.payment_intent);
   if(o.amount_total!==r.total||o.currency!=='usd'||pi.status!=='succeeded'||pi.amount_received!==r.total)throw new Error('Amount mismatch');
   if(r.status==='pending')await c.query(`UPDATE payment_bookings SET status='paid',paid_at=now(),payment_intent=$2,${paidNotificationSQL} WHERE id=$1`,[r.id,pi.id]);
  }
  if(event.type==='invoice.payment_succeeded'){
   const {rows}=await c.query('SELECT * FROM payment_bookings WHERE invoice_id=$1 FOR UPDATE',[o.id]);const r=rows[0];if(!r){if(o.metadata?.booking_id)throw new Error('Booking not yet linked');return;}
   const inv=await s.invoices.retrieve(o.id,{expand:['payment_intent']});const pi=inv.payment_intent;
   if(inv.status!=='paid'||inv.amount_paid!==r.total||inv.total!==r.total||inv.currency!=='usd'||!pi||pi.status!=='succeeded'||pi.amount_received!==r.total) throw new Error('Unverified invoice payment');
   if(r.status==='pending') await c.query(`UPDATE payment_bookings SET status='paid',paid_at=now(),payment_intent=$2,${paidNotificationSQL} WHERE id=$1`,[r.id,pi.id]);
  }
  if(event.type==='refund.updated'||event.type==='refund.failed'){
   const r=await c.query('SELECT id,status,payload FROM payment_bookings WHERE refund_id=$1 FOR UPDATE',[o.id]);
   if(!r.rowCount && o.metadata?.booking_id) throw new Error('Refund not yet linked');
   if(r.rowCount){const current=await s.refunds.retrieve(o.id),next=refundBookingStatus(current.status),previous=r.rows[0];const notify=next!==previous.status&&!!previous.payload?.email_alerts?.patient_cancelled?.accepted_at;await c.query(`UPDATE payment_bookings SET status=$2${notify?','+refundUpdateNotificationSQL:''} WHERE refund_id=$1`,[o.id,next]);}
  }
 });await flush({transaction:runTransaction});return res.json({received:true});
 }catch{return res.status(500).json({error:'Webhook processing failed; retry required'});}
}

}
export default createWebhookHandler();
