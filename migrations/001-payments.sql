BEGIN;
CREATE TABLE IF NOT EXISTS payment_slots (
 day date NOT NULL, time_window text NOT NULL CHECK(time_window IN ('Morning (6am-9am)','Midday (9am-12pm)','Afternoon (1pm-4pm)','Evening (4pm-6pm)')), PRIMARY KEY(day,time_window)
);
CREATE TABLE IF NOT EXISTS payment_bookings (
 id uuid PRIMARY KEY, token_hash text NOT NULL, request_key uuid UNIQUE NOT NULL,
 payload jsonb NOT NULL, day date NOT NULL, time_window text NOT NULL,
 distance_meters integer NOT NULL, total integer NOT NULL CHECK(total>=8000), travel integer NOT NULL,
 status text NOT NULL DEFAULT 'quoted', channel text,
 customer_id text, checkout_id text UNIQUE, invoice_id text UNIQUE, payment_intent text UNIQUE,
 paid_at timestamptz, policy_version text NOT NULL, accepted_at timestamptz NOT NULL DEFAULT now(),
 refund_id text, refund_amount integer, exception_reason text,
 created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(day,time_window) REFERENCES payment_slots(day,time_window)
);
CREATE UNIQUE INDEX IF NOT EXISTS payment_slot_reserved ON payment_bookings(day,time_window) WHERE status IN ('pending','paid','refund_pending');
CREATE TABLE IF NOT EXISTS payment_events (id text PRIMARY KEY, processed_at timestamptz NOT NULL DEFAULT now());
COMMIT;
-- One active appointment per patient email per day, across invoice and checkout.
CREATE UNIQUE INDEX IF NOT EXISTS payment_patient_day_reserved ON payment_bookings(lower(payload->>'email'),day) WHERE status IN ('pending','paid','refund_pending');

CREATE TABLE IF NOT EXISTS payment_rate_limits(bucket text PRIMARY KEY,hits integer NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
