import {WINDOW_MINUTES} from '../shared/schedule.mjs';
export function holdDeadline(day,window,now=Date.now()) {
 const minutes=WINDOW_MINUTES[window]?.[0];if(minutes===undefined)throw new Error('Invalid appointment window');
 const [year,month,date]=day.split('-').map(Number);
 const target=Date.UTC(year,month-1,date,Math.floor(minutes/60),minutes%60);
 let epoch=target;
 const format=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 for(let i=0;i<3;i++){
  const p=Object.fromEntries(format.formatToParts(new Date(epoch)).map(x=>[x.type,x.value]));
  const shown=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);
  epoch+=target-shown;
 }
 return new Date(Math.min(now+24*60*60*1000,epoch)).toISOString();
}
// Expiration is reconciled on availability, quote, and admin reads. Never release
// an invoice-backed reservation until Stripe confirms it cannot be paid anymore.
export async function expireInvoiceHolds({transaction,stripe}) {
 return transaction(async c=>{
  const {rows}=await c.query(`SELECT * FROM payment_bookings WHERE status='pending' AND payload->>'hold_expires_at' IS NOT NULL AND (payload->>'hold_expires_at')::timestamptz<=now() ORDER BY created_at LIMIT 20 FOR UPDATE SKIP LOCKED`);
  for(const r of rows){
   if(r.invoice_id){
    const s=stripe();let inv=await s.invoices.retrieve(r.invoice_id);
    if(inv.status==='paid')continue;
    if(inv.status==='open'||inv.status==='uncollectible')inv=await s.invoices.voidInvoice(inv.id,{}, {idempotencyKey:`expire-hold-${r.id}`});
    else if(inv.status==='draft'){await s.invoices.del(inv.id);inv={status:'void'};}
    if(inv.status!=='void')continue;
   }
   // The request path only allows these holds to use the administrator invoice channel.
   if(r.checkout_id)continue;
   await c.query("UPDATE payment_bookings SET status='expired' WHERE id=$1 AND status='pending'",[r.id]);
  }
 });
}
