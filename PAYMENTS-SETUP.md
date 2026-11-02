# Gentle Touch payment integration — test deployment

Implementation is in the existing Vite/Vercel project. Live payment is disabled by default. No old Formspree records are moved, overwritten, or deleted. The existing Formspree form continues operating when VITE_PAYMENTS_ENABLED is false. When enabled, new appointments are managed in the database and /admin/payments; new paid appointments are not forwarded to Formspree. Existing records remain in Formspree/email.

## Provision securely

1. Create a managed PostgreSQL database with TLS, restricted access, backups and retention appropriate to patient appointment information. Run migrations/001-payments.sql once (for example using the provider's SQL console). The migration only creates new payment_* tables. Clean up payment_rate_limits entries older than 48 hours periodically.
2. In Vercel project environment settings, configure the server-only values shown in .env.example. Use Stripe **test** keys. Generate PAYMENTS_ADMIN_TOKEN with `openssl rand -hex 32`; enter it only in Vercel and your private administrator session. Do not add secrets to Git or VITE_ variables. Set APP_URL to the exact test deployment origin. Database and Google credentials are not needed in client code.
3. Enable Google Routes API and billing. Restrict its key to Routes API and appropriate server restrictions; set billing quotas. Only the starting address and destination address go to Google. Restrict access to database backups and Vercel logs. Never log request bodies or credentials.
4. Register a Stripe test webhook at https://YOUR-TEST-HOST/api/stripe-webhook, with API version **2024-06-20**, listening to checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.expired, invoice.payment_succeeded, refund.updated and refund.failed. Save its signing secret in STRIPE_WEBHOOK_SECRET. The server Stripe API version is pinned to match.
5. On a test deployment set PAYMENTS_ENABLED=true and VITE_PAYMENTS_ENABLED=true; keep PAYMENTS_LIVE_ENABLED=false. Rebuild after changing the VITE_ flag. Never enable frontend payments without a configured backend.
6. Open /admin/payments, enter the administrator token, and add future available date/windows. Each broad existing window has capacity one. Same-day bookings are intentionally unavailable. There is no new external calendar integration. Administrative credentials have full access; rotate them when staff access changes.

## Patient flow

The existing fields and visual classes remain. Calculate Total produces a server quote valid for 30 minutes until payment starts. Travel is computed using Google's recommended driving route from 623 N 132nd St, Omaha, NE 68154, excluding the first 25 one-way miles, at $0.725 per additional mile, rounded only at final cents. Display miles are rounded for readability; charge uses full route meters. Checkout is card-only, for immediate payment verification. No medical fields, addresses, appointment dates, special instructions or fasting details are sent to Stripe. Stripe receives email, an opaque booking ID, and generic item descriptions.

Pending sessions reserve windows until paid, expired via webhook, or cancelled by the administrator. Paid webhooks confirm the window, not a precise arrival minute. The return page polls for verified database status; it never marks payment successful on redirect alone. A lost return-page browser token requires staff confirmation. Formspree email notifications for new paid appointments are not implemented; staff must monitor the administrator page and Stripe receipts.

For invoices: create a quote in /admin/payments after documenting patient policy acceptance. Review its total, then explicitly choose Email invoice. Test-mode Stripe may not deliver invoice emails automatically; verify in the test Dashboard and use its hosted invoice preview/test delivery controls. Live email delivery must be verified before launch. Existing patient email requests can be manually entered; no automatic historical import occurs.

A record can use Checkout OR an invoice. It cannot switch channels while payable. Reservation indexes enforce one active appointment per window and per email/day; they also prevent repeated requests with new browser IDs from charging that email twice that day. This intentionally limits multiple patients sharing one email on the same day. Patients using different email addresses are not automatically identity-matched. Old standalone Stripe/Venmo payments cannot be reconciled automatically. With payments enabled the public Stripe button points to booking, and Venmo directs to staff contact; stop distributing the old standalone payment link for new bookings.

Requests use database row locks plus Stripe idempotency keys. Unknown Stripe results must be retried with the same record; do not create new payment requests to work around an error. Quotes cannot start new payment requests after 30 minutes. If a Stripe operation succeeded but database commit failed, retry promptly; after quote expiration staff must reconcile the Stripe record before any new charge. Never bypass a reserved-window error.

## Cancellation and refunds

Staff use Cancel under policy. Before the appointment calendar day in America/Chicago, refund the total minus $25; same-day and past appointments receive no automatic refund. Full refund exception requires a recorded reason (including provider cancellations or legal exceptions). Refunds use the original PaymentIntent. Pending/failed refunds are distinct states; reconcile failed refunds in Stripe, do not charge again. Partial refunds leave the original invoice as paid with a refund; the booking records the refund separately. Refunds initiated manually in Stripe outside this app require staff reconciliation. Old payments are handled manually through Stripe's Dashboard.

## Required test-mode acceptance checks (not yet performed)

- Provision actual database, apply schema, seed a window and test the Google route distance against the same Google driving route. Verify 25-mile inclusion, fractional mileage and itemized totals.
- Complete Checkout with a Stripe test card, verify one paid appointment only after webhook; decline a card and verify no confirmation. Tamper with client amounts and verify no change.
- Retry/double-click Checkout; concurrently attempt two bookings for the same slot/email. Verify one reservation and one payment object. Close/reopen the browser and verify an existing payable request cannot create a second channel.
- Send invoice in test mode, complete its hosted payment, verify invoice.payment_succeeded and the paid status; verify subsequent Checkout is rejected.
- Replay webhook events and deliver them out of order; invalid signatures and wrong totals must never confirm payment. Confirm a server/database failure yields retryable webhook errors.
- Cancel unpaid sessions/invoices and verify their old payment URLs can no longer collect payment. Cancel paid appointments before/same day, test full-refund exceptions, pending refunds and failures.
- Review records, patient policy acceptance and administrator access; confirm old Formspree submissions remain available.
- Check mobile/desktop UI, all existing fields, policy links, no medical data in Stripe, and no secrets in built assets.

Local checks: `node --test tests/payments.test.mjs` and `npm run build`. These do not replace database/concurrency, real API, email delivery, or browser acceptance tests.

## Live enablement only after acceptance

Use the production database and actual production APP_URL, live Stripe secret and separately configured live webhook signing secret. Set PAYMENTS_LIVE_ENABLED=true only after the above tests pass. Keep Google server key restricted. Verify Stripe account invoicing settings and email delivery. Rebuild frontend and deploy the matching code. To disable new payments, set PAYMENTS_ENABLED=false and VITE_PAYMENTS_ENABLED=false and rebuild; keep webhooks working for existing charges. Do not delete payment records or restore an old database over new payments.

## Verified test results

Completed with synthetic information and Stripe test credentials:

- Google route below 25 miles: 26,545 meters, $0 travel, $80 total.
- Google route above 25 miles: 88,639 meters, $21.81 travel, $101.81 total.
- Checkout creation retries returned the same session; a paid booking rejected another Checkout request.
- Completed Checkout payment updated the booking to paid through the signed webhook.
- The normal browser booking flow returned and displayed verified payment confirmation.
- Administrator cancellation refunded $55 of an $80 test payment, retaining $25.
- A separately created administrator invoice was paid and its booking was marked paid by the webhook.
- Database uniqueness checks rejected competing reservations for one window and the same email/day; fixtures were rolled back. This is not a full concurrency/load test.

Remaining launch work: synchronize this branch, review and merge it, configure separate production credentials and live webhook, seed real availability, verify account readiness and live invoice email delivery, and retire outdated credential-bearing previews. Payment flags must remain false until readiness is verified. No automated real-card test is authorized by these tests.

Production uses a separate empty database; do not copy synthetic test bookings into it. Existing Formspree records remain unchanged. New paid bookings are managed on the administrator page; they are not automatically forwarded to Formspree/email.
