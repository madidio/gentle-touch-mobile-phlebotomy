import {SAME_DAY_RESCHEDULE} from '../shared/cancellation-policy.mjs';
export const POLICY = 'Before the appointment calendar day (America/Chicago): refund minus $25. Same-day cancellations are nonrefundable, subject to applicable law and exceptions. Eligible refunds use the original payment method. ' + SAME_DAY_RESCHEDULE;
export const POLICY_VERSION = '2026-11-10';
export function collectionFee(drawType = 'Standard') {
  if (!['Standard', 'Stat', 'Fasting', 'Not sure'].includes(drawType)) throw Object.assign(new Error('Choose a valid draw type.'), {status:400});
  return drawType === 'Stat' ? 12000 : 8000;
}
export function price(distanceMeters) {
  if (!Number.isSafeInteger(distanceMeters) || distanceMeters < 0) throw new Error('Invalid route distance');
  // Integer arithmetic: 1 mile = 1609.344 meters; $0.75 = 75 cents.
  const travel = Number((BigInt(Math.max(0, distanceMeters * 1000 - 40233600)) * 150n + 1609344n) / 3218688n);
  return { distanceMeters, miles: distanceMeters / 1609.344, collection: 8000, travel, total: 8000 + travel };
}
export function chicagoDay(now = new Date()) {
  const p = new Intl.DateTimeFormat('en-US', {timeZone:'America/Chicago', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(now);
  const get = k => p.find(x=>x.type===k).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function refundAmount(total, appointmentDay, override = false, now = new Date()) {
  return override ? total : chicagoDay(now) < appointmentDay ? Math.max(0, total - 2500) : 0;
}
