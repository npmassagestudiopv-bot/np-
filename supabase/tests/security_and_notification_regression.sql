-- Transaction-only regression test. pg_net dispatches only after COMMIT;
-- this script ROLLBACKs every synthetic row and queued webhook request.
BEGIN;
DO $assert$
BEGIN
  IF has_table_privilege('anon', 'public.appointments', 'INSERT')
     OR has_table_privilege('anon', 'public.appointments', 'UPDATE')
     OR has_table_privilege('anon', 'public.appointments', 'DELETE')
     OR has_table_privilege('authenticated', 'public.appointments', 'TRUNCATE')
     OR has_table_privilege('authenticated', 'public.appointment_email_queue', 'SELECT') THEN
    RAISE EXCEPTION 'Unexpected browser permissions';
  END IF;
  IF NOT has_table_privilege('service_role', 'public.appointments', 'INSERT')
     OR NOT has_table_privilege('service_role', 'public.contact_messages', 'INSERT')
     OR NOT has_table_privilege('service_role', 'public.cookie_consents', 'INSERT')
     OR NOT has_table_privilege('service_role', 'public.appointment_email_queue', 'UPDATE') THEN
    RAISE EXCEPTION 'Server-side function access must remain';
  END IF;
END;
$assert$;

SELECT set_config('request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","email":"security-outsider@example.invalid"}', true);
SET LOCAL ROLE authenticated;
DO $assert$
DECLARE affected integer;
BEGIN
  IF (SELECT count(*) FROM public.appointments) <> 0
     OR (SELECT count(*) FROM public.contact_messages) <> 0
     OR (SELECT count(*) FROM public.cookie_consents) <> 0
     OR (SELECT count(*) FROM public.blocked_dates) <> 0 THEN
    RAISE EXCEPTION 'Non-admin can see private data';
  END IF;
  UPDATE public.appointments SET status = status;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Non-admin can update private data'; END IF;
  UPDATE public.blog_posts SET title_bg = title_bg;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Non-admin can modify the public blog'; END IF;
  BEGIN
    INSERT INTO public.appointments (name,email,phone,service,location,appointment_date,appointment_time)
    VALUES ('Security regression - rolled back','security-test@example.invalid','0000','classical','vt','2199-12-30','09:00');
    RAISE EXCEPTION 'Non-admin appointment insert unexpectedly succeeded';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$assert$;
RESET ROLE;

SELECT set_config('request.jwt.claims', jsonb_build_object(
  'sub', id, 'role', 'authenticated', 'email', email)::text, true)
FROM auth.users WHERE lower(email)='npmassagestudiopv@gmail.com' AND email_confirmed_at IS NOT NULL;
SET LOCAL ROLE authenticated;
WITH inserted AS (
  INSERT INTO public.appointments (name,email,phone,service,location,appointment_date,appointment_time,status)
  VALUES ('Security regression - rolled back','security-test@example.invalid','0000','classical','vt','2199-12-30','09:00','pending')
  RETURNING id
) SELECT set_config('np.test_appointment_id', id::text, true) FROM inserted;
UPDATE public.appointments SET status='confirmed' WHERE id=current_setting('np.test_appointment_id')::uuid;
UPDATE public.appointments SET status='completed' WHERE id=current_setting('np.test_appointment_id')::uuid;
RESET ROLE;
DO $assert$
BEGIN
  IF (SELECT count(*) FROM public.appointment_email_queue WHERE appointment_id=current_setting('np.test_appointment_id')::uuid AND status='pending') <> 1 THEN
    RAISE EXCEPTION 'Confirmation must enqueue exactly one email; completion must not enqueue another';
  END IF;
  IF (SELECT count(*) FROM net.http_request_queue WHERE convert_from(body,'UTF8')::jsonb->'record'->>'id'=current_setting('np.test_appointment_id')) <> 3 THEN
    RAISE EXCEPTION 'Insert and both status updates must retain Telegram webhooks';
  END IF;
  IF EXISTS (SELECT 1 FROM net.http_request_queue WHERE convert_from(body,'UTF8')::jsonb->'record'->>'id'=current_setting('np.test_appointment_id') AND timeout_milliseconds<>20000) THEN
    RAISE EXCEPTION 'Webhook timeout is incorrect';
  END IF;
END;
$assert$;
SELECT jsonb_build_object(
  'outsider_private_access',false, 'admin_insert_and_confirm',true,
  'email_tasks', (SELECT count(*) FROM public.appointment_email_queue WHERE appointment_id=current_setting('np.test_appointment_id')::uuid),
  'telegram_requests', (SELECT count(*) FROM net.http_request_queue WHERE convert_from(body,'UTF8')::jsonb->'record'->>'id'=current_setting('np.test_appointment_id')),
  'transaction_will_be_rolled_back',true) AS regression_result;

ROLLBACK;
