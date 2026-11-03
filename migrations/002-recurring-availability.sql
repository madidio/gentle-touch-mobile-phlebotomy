BEGIN;
ALTER TABLE payment_slots ADD COLUMN IF NOT EXISTS start_minute integer;
ALTER TABLE payment_slots ADD COLUMN IF NOT EXISTS end_minute integer;
ALTER TABLE payment_slots ADD COLUMN IF NOT EXISTS recurring boolean NOT NULL DEFAULT false;
UPDATE payment_slots SET start_minute=CASE time_window WHEN 'Morning (6am-9am)' THEN 360 WHEN 'Midday (9am-12pm)' THEN 540 WHEN 'Afternoon (1pm-4pm)' THEN 780 WHEN 'Evening (4pm-6pm)' THEN 960 END,
 end_minute=CASE time_window WHEN 'Morning (6am-9am)' THEN 540 WHEN 'Midday (9am-12pm)' THEN 720 WHEN 'Afternoon (1pm-4pm)' THEN 960 WHEN 'Evening (4pm-6pm)' THEN 1080 END WHERE start_minute IS NULL;
ALTER TABLE payment_slots DROP CONSTRAINT IF EXISTS payment_slots_time_window_check;
ALTER TABLE payment_slots ADD CONSTRAINT payment_slots_time_window_check CHECK(time_window IN ('Morning (6am-9am)','Midday (9am-12pm)','Afternoon (1pm-4pm)','Evening (4pm-6pm)','Afternoon (12pm-3pm)','Evening (3pm-6pm)','Morning (8am-11am)','Midday (11am-2pm)','Afternoon (2pm-3pm)'));
ALTER TABLE payment_slots ALTER COLUMN start_minute SET NOT NULL;
ALTER TABLE payment_slots ALTER COLUMN end_minute SET NOT NULL;
-- Let older deployments continue inserting the original window labels during rollout.
CREATE OR REPLACE FUNCTION payment_fill_slot_bounds() RETURNS trigger LANGUAGE plpgsql AS $bounds$
BEGIN
 IF NEW.start_minute IS NULL THEN
  NEW.start_minute:=CASE NEW.time_window WHEN 'Morning (6am-9am)' THEN 360 WHEN 'Midday (9am-12pm)' THEN 540 WHEN 'Afternoon (1pm-4pm)' THEN 780 WHEN 'Evening (4pm-6pm)' THEN 960 WHEN 'Afternoon (12pm-3pm)' THEN 720 WHEN 'Evening (3pm-6pm)' THEN 900 WHEN 'Morning (8am-11am)' THEN 480 WHEN 'Midday (11am-2pm)' THEN 660 WHEN 'Afternoon (2pm-3pm)' THEN 840 END;
 END IF;
 IF NEW.end_minute IS NULL THEN
  NEW.end_minute:=CASE NEW.time_window WHEN 'Morning (6am-9am)' THEN 540 WHEN 'Midday (9am-12pm)' THEN 720 WHEN 'Afternoon (1pm-4pm)' THEN 960 WHEN 'Evening (4pm-6pm)' THEN 1080 WHEN 'Afternoon (12pm-3pm)' THEN 900 WHEN 'Evening (3pm-6pm)' THEN 1080 WHEN 'Morning (8am-11am)' THEN 660 WHEN 'Midday (11am-2pm)' THEN 840 WHEN 'Afternoon (2pm-3pm)' THEN 900 END;
 END IF;
 RETURN NEW;
END $bounds$;
CREATE OR REPLACE TRIGGER payment_slot_bounds BEFORE INSERT ON payment_slots FOR EACH ROW EXECUTE FUNCTION payment_fill_slot_bounds();
CREATE TABLE IF NOT EXISTS payment_schedule_blocks (
 day date NOT NULL, time_window text NOT NULL DEFAULT '',reason text NOT NULL DEFAULT '',created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(day,time_window)
);
CREATE OR REPLACE FUNCTION payment_guard_reservation() RETURNS trigger LANGUAGE plpgsql AS $guard$
BEGIN
 IF NEW.status NOT IN ('pending','paid','refund_pending') THEN RETURN NEW; END IF;
 PERFORM pg_advisory_xact_lock(hashtext(NEW.day::text));
 IF TG_OP='INSERT' OR OLD.status NOT IN ('pending','paid','refund_pending') OR OLD.day<>NEW.day OR OLD.time_window<>NEW.time_window THEN
  IF EXISTS(SELECT 1 FROM payment_schedule_blocks x WHERE x.day=NEW.day AND (x.time_window='' OR x.time_window=NEW.time_window)) THEN
   RAISE EXCEPTION 'Appointment window is blocked' USING ERRCODE='23505';
  END IF;
 END IF;
 IF EXISTS(SELECT 1 FROM payment_bookings b JOIN payment_slots booked ON booked.day=b.day AND booked.time_window=b.time_window
  JOIN payment_slots selected ON selected.day=NEW.day AND selected.time_window=NEW.time_window
  WHERE b.day=NEW.day AND b.id<>NEW.id AND b.status IN ('pending','paid','refund_pending') AND booked.start_minute<selected.end_minute AND selected.start_minute<booked.end_minute) THEN
  RAISE EXCEPTION 'Appointment window overlaps a reservation' USING ERRCODE='23505';
 END IF;
 RETURN NEW;
END $guard$;
CREATE OR REPLACE TRIGGER payment_reservation_guard BEFORE INSERT OR UPDATE OF status,day,time_window ON payment_bookings FOR EACH ROW EXECUTE FUNCTION payment_guard_reservation();
COMMIT;
