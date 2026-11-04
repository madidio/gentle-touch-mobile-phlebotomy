
### Appointment reminder emails

The production cron `/api/appointment-reminders` runs daily at 13:00 UTC (7 AM Omaha standard time / 8 AM daylight time; the hosting scheduler may run within that hour). Set a random production-only `CRON_SECRET` of at least 32 characters. It sends Resend reminders to paid appointments tomorrow, plus same-day catch-up before the arrival window starts. Cancelled/refunded/past appointments are excluded. Accepted reminders are tracked per booking and use a separate provider idempotency key. Up to 40 eligible bookings are processed per daily run; failures are retried on the next daily run if the appointment has not started. Reminders are disabled outside production.
