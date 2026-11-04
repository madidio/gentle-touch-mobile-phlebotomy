import {WINDOW_MINUTES} from './schedule.mjs';
export const PATIENT_EMAIL_LABELS={patient_paid:'Payment confirmation',patient_updated:'Updated appointment',patient_reminder:'Appointment reminder',patient_review:'Review request',patient_cancelled:'Cancellation confirmation',patient_refund_update:'Refund update'};
export function patientEmails(booking){
 return Object.entries(booking.email_alerts||{}).filter(([kind])=>PATIENT_EMAIL_LABELS[kind]).map(([kind,event])=>{
  let state='queued',label='Queued';
  if(event.bounced_at||event.failed_at){state='failed';label=event.bounced_at?'Bounced — contact patient':'Failed — contact patient';}
  else if(event.delivered_at){state='delivered';label='Delivered to mail server';}
  else if(event.accepted_at){state='accepted';label='Accepted — delivery unconfirmed';}
  else if(event.skipped_at){state='closed';label='Not sent — no longer applicable';}
  else if((!['paid','pending'].includes(booking.status)&&!['patient_cancelled','patient_refund_update'].includes(kind))||((booking.visit_completed_at)&&kind==='patient_reminder')){state='closed';label='Not sent — booking closed';}
  else if(event.attempts>0){state='retry';label='Retry pending';}
  return {kind,event,state,label,title:PATIENT_EMAIL_LABELS[kind]};
 });
}
export function needsInvoice(b,today){return b.day>=today&&b.invoice_requested&&!b.channel&&['quoted','pending'].includes(b.status);}
export function pendingChange(b){return b.status==='paid'&&b.change_request?.status==='pending';}
export function matchesDashboard(b,filter,today){
 const active=!b.visit_completed_at&&['paid','pending'].includes(b.status);
 switch(filter){
  case 'today':return b.day===today&&active;
  case 'upcoming':return b.day>=today&&active;
  case 'attention':return needsInvoice(b,today)||pendingChange(b);
  case 'invoices':return b.status==='pending'&&b.channel==='invoice';
  case 'emails':return patientEmails(b).some(e=>['retry','failed'].includes(e.state));
  case 'completed':return !!b.visit_completed_at;
  default:return true;
 }
}
export function dashboardCounts(bookings,today){return Object.fromEntries(['today','upcoming','attention','invoices','emails','completed'].map(filter=>[filter,bookings.filter(b=>matchesDashboard(b,filter,today)).length]));}
export function dashboardBookings(bookings,filter,today,search=''){
 const term=search.trim().toLowerCase();
 return bookings.filter(b=>matchesDashboard(b,filter,today)&&(!term||[b.first_name,b.last_name,b.email,b.day].some(v=>String(v||'').toLowerCase().includes(term)))).sort((a,b)=>a.day.localeCompare(b.day)||(WINDOW_MINUTES[a.time_window]?.[0]??9999)-(WINDOW_MINUTES[b.time_window]?.[0]??9999));
}
