import {dashboardCounts,patientEmails} from '../../../shared/admin-dashboard.mjs';
export const DASHBOARD_FILTERS=[['today','Today’s appointments'],['upcoming','Upcoming'],['attention','Needs your attention'],['invoices','Unpaid invoices'],['emails','Email issues'],['completed','Completed visits'],['all','All records']];
export default function AdminDashboard({bookings,today,filter,onFilter,lastChecked,refreshError,onRefresh,busy}){
 const counts=dashboardCounts(bookings,today);
 const delivered=bookings.flatMap(patientEmails).filter(e=>e.state==='delivered').length;
 const accepted=bookings.flatMap(patientEmails).filter(e=>e.state==='accepted').length;
 const date=new Date(today+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'America/Chicago',weekday:'long',month:'long',day:'numeric'});
 return <section aria-label="Daily appointment dashboard" className="rounded-2xl border border-border bg-white p-5 sm:p-7 space-y-5">
  <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wide text-primary">Your day at a glance</p><h2 className="mt-1 text-2xl font-bold text-primary">{date}</h2><p className="mt-2 text-sm text-muted-foreground">All appointments use Omaha time.</p></div><button disabled={busy} onClick={onRefresh} className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-50">Refresh dashboard</button></div>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[['today','Today’s appointments','Paid and awaiting payment'],['attention','Needs your attention','Invoice or change requests'],['invoices','Unpaid invoices','Sent and awaiting payment'],['emails','Email issues','Failed or awaiting retry']].map(([key,label,hint])=><button key={key} aria-pressed={filter===key} onClick={()=>onFilter(key)} className={`rounded-xl border p-4 text-left transition-colors ${filter===key?'border-primary bg-primary/10 ring-1 ring-primary':'border-border bg-muted/30 hover:bg-muted'}`}><span className="block text-3xl font-bold text-primary">{counts[key]}</span><span className="mt-2 block font-semibold">{label}</span><span className="mt-1 block text-xs text-muted-foreground">{hint}</span></button>)}</div>
  <p className="rounded-lg bg-muted/50 p-3 text-sm">Patient emails: <strong>{delivered}</strong> delivered to mail servers · <strong>{accepted}</strong> accepted by the email service, delivery unconfirmed. Delivery does not mean the patient read it. Live delivery tracking currently covers reminders.</p>
  <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><p>Refreshes every 30 seconds while this page is open. Last checked: {lastChecked?.toLocaleTimeString('en-US',{timeZone:'America/Chicago'})||'—'}.</p><p className="text-muted-foreground">Counts cover the records loaded below.</p></div>
  {refreshError&&<p role="alert" className="rounded-lg border border-destructive p-3 text-sm text-destructive">{refreshError} Displayed records may be out of date.</p>}
 </section>;
}
export function PatientEmailStatus({booking}){
 const emails=patientEmails(booking);
 if(!emails.length)return <p className="mt-3 text-sm text-muted-foreground">No patient email queued for this booking yet.</p>;
 return <details className="mt-4 rounded-lg border bg-muted/20 p-3"><summary className="cursor-pointer font-semibold">Patient email status{emails.some(e=>['failed','retry'].includes(e.state))?' — needs attention':''}</summary><ul className="mt-3 space-y-3">{emails.map(e=><li key={e.kind} className="flex flex-wrap justify-between gap-2 text-sm"><span>{e.title}</span><span className={e.state==='failed'||e.state==='retry'?'font-semibold text-destructive':'text-muted-foreground'}>{e.label}</span></li>)}</ul><p className="mt-3 text-xs text-muted-foreground">“Accepted” confirms the email service accepted the message, not that the patient received or read it. For failures, verify the patient’s address and contact them directly.</p></details>;
}
