import test from 'node:test';
import assert from 'node:assert/strict';
import {patientEmails,dashboardCounts,dashboardBookings} from '../shared/admin-dashboard.mjs';
const today='2026-11-04';
const rows=[
 {id:'later',day:today,status:'paid',first_name:'Pat',time_window:'Midday (9am-12pm)'},
 {id:'earlier',day:today,status:'paid',first_name:'Lee',time_window:'Morning (6am-9am)'},
 {id:'done',day:today,status:'paid',visit_completed_at:'now'},
 {id:'cancelled',day:today,status:'cancelled'},
 {id:'invoice-request',day:'2026-11-05',status:'pending',invoice_requested:true},
 {id:'sent-invoice',day:'2026-11-05',status:'pending',channel:'invoice'},
 {id:'checkout',day:'2026-11-05',status:'pending',channel:'checkout'},
 {id:'change',day:'2026-11-05',status:'paid',change_request:{status:'pending'}},
];
test('daily dashboard separates unpaid invoices, requests and completed visits',()=>{
 const c=dashboardCounts(rows,today);assert.equal(c.today,2);assert.equal(c.upcoming,6);assert.equal(c.attention,2);assert.equal(c.invoices,1);assert.equal(c.completed,1);
 assert.deepEqual(dashboardBookings(rows,'today',today).map(b=>b.id),['earlier','later']);
 assert.deepEqual(dashboardBookings(rows,'all',today,' Lee ').map(b=>b.id),['earlier']);
});
test('patient email states distinguish acceptance, delivery and actionable failures',()=>{
 const emails=patientEmails({status:'paid',email_alerts:{paid:{accepted_at:'now'},patient_paid:{accepted_at:'now'},patient_updated:{attempts:1},patient_reminder:{accepted_at:'then',delivered_at:'now'},patient_review:{}}});
 assert.deepEqual(emails.map(e=>e.state),['accepted','retry','delivered','queued']);assert.equal(emails.length,4);
 const failed=patientEmails({status:'paid',email_alerts:{patient_reminder:{accepted_at:'then',delivered_at:'earlier',bounced_at:'later'}}});assert.equal(failed[0].state,'failed');
 assert.equal(patientEmails({status:'cancelled',email_alerts:{patient_paid:{attempts:3}}})[0].state,'closed');
 const count=dashboardCounts([{day:today,status:'paid',email_alerts:{patient_paid:{accepted_at:'now'}}},{day:today,status:'paid',email_alerts:{patient_review:{attempts:1}}}],today);assert.equal(count.emails,1);
});
