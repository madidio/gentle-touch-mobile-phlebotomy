import test from 'node:test';
import assert from 'node:assert/strict';
import {bookingAlert} from '../shared/booking-alerts.mjs';
const today='2026-11-03';const base={id:'fixture',day:'2026-11-04',status:'pending',invoice_requested:true,channel:null};
test('new invoice requests require review while unsubmitted quotes do not',()=>{
 assert.equal(bookingAlert(base,today).title,'New invoice request');
 assert.equal(bookingAlert({...base,status:'quoted',invoice_requested:false},today),null);
 assert.equal(bookingAlert({...base,channel:'invoice'},today),null);
 assert.equal(bookingAlert({...base,channel:'checkout'},today),null);
});
test('paid confirmation creates a distinct alert after the request was reviewed',()=>{
 const request=bookingAlert(base,today);const paid=bookingAlert({...base,status:'paid',channel:'invoice'},today);
 assert.notEqual(paid.key,request.key);assert.match(paid.title,/confirmed/);
 assert.equal(bookingAlert({...base,status:'paid',day:'2026-11-02'},today),null);
});
test('cancelled and expired windows are distinct from confirmed bookings',()=>{
 assert.match(bookingAlert({...base,status:'cancelled'},today).title,/cancelled/);
 assert.match(bookingAlert({...base,status:'expired'},today).title,/expired/);
 assert.equal(bookingAlert({...base,status:'refunded'},today),null);
});
