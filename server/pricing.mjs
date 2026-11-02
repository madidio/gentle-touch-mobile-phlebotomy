export const POLICY = 'Before the appointment calendar day (America/Chicago): refund minus $25. Same-day cancellations are nonrefundable, subject to applicable law and exceptions. Eligible refunds use the original payment method.';
export const POLICY_VERSION = '2026-10-30';
export function price(distanceMeters) {
  if (!Number.isSafeInteger(distanceMeters) || distanceMeters < 0) throw new Error('Invalid route distance');
  // Integer arithmetic: 1 mile = 1609.344 meters; $0.725 = 72.5 cents.
  const travel = Number((BigInt(Math.max(0, distanceMeters * 1000 - 40233600)) * 145n + 1609344n) / 3218688n);
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
