DO $test$
DECLARE blocked_slot boolean := false; blocked_patient boolean := false;
BEGIN
 BEGIN
  INSERT INTO payment_slots(day,time_window,start_minute,end_minute) VALUES ('2099-12-30','Morning (6am-9am)',360,540),('2099-12-30','Midday (9am-12pm)',540,720);
  INSERT INTO payment_bookings(id,token_hash,request_key,payload,day,time_window,distance_meters,total,travel,policy_version,status,channel)
  VALUES ('00000000-0000-4000-8000-000000000001','test-only','10000000-0000-4000-8000-000000000001','{"email":"synthetic-test@example.invalid"}','2099-12-30','Morning (6am-9am)',64374,9088,1088,'test','pending','checkout');
  BEGIN
   INSERT INTO payment_bookings(id,token_hash,request_key,payload,day,time_window,distance_meters,total,travel,policy_version,status,channel)
   VALUES ('00000000-0000-4000-8000-000000000002','test-only','10000000-0000-4000-8000-000000000002','{"email":"different-test@example.invalid"}','2099-12-30','Morning (6am-9am)',64374,9088,1088,'test','pending','invoice');
  EXCEPTION WHEN unique_violation THEN blocked_slot:=true; END;
  BEGIN
   INSERT INTO payment_bookings(id,token_hash,request_key,payload,day,time_window,distance_meters,total,travel,policy_version,status,channel)
   VALUES ('00000000-0000-4000-8000-000000000003','test-only','10000000-0000-4000-8000-000000000003','{"email":"SYNTHETIC-TEST@example.invalid"}','2099-12-30','Midday (9am-12pm)',64374,9088,1088,'test','pending','invoice');
  EXCEPTION WHEN unique_violation THEN blocked_patient:=true; END;
  IF NOT blocked_slot OR NOT blocked_patient THEN RAISE EXCEPTION 'Duplicate protection failed'; END IF;
  RAISE EXCEPTION USING ERRCODE='Z0001', MESSAGE='Tests passed; discard synthetic rows';
 EXCEPTION WHEN SQLSTATE 'Z0001' THEN NULL;
 END;
END $test$;
