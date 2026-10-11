-- No customer data is changed. Existing server-side handlers keep service-role access.
-- Resolve the confirmed administrator rather than embedding an environment-specific ID.
DO $hardening$
DECLARE
  administrator uuid;
  administrator_count integer;
  notification_key text;
  webhook_definition text;
  cron_id bigint;
BEGIN
  SELECT count(*), min(id::text)::uuid INTO administrator_count, administrator
  FROM auth.users
  WHERE lower(email) = 'npmassagestudiopv@gmail.com'
    AND email_confirmed_at IS NOT NULL;
  IF administrator_count <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one confirmed administrator';
  END IF;

  SELECT pg_get_triggerdef(oid) INTO webhook_definition
  FROM pg_trigger
  WHERE tgrelid = 'public.appointments'::regclass
    AND tgname = 'telegram ' AND tgenabled = 'O';
  notification_key := (regexp_match(webhook_definition, 'Bearer ([A-Za-z0-9._-]+)'))[1];
  IF notification_key IS NULL OR webhook_definition NOT LIKE '%/functions/v1/telegram-notify%' THEN
    RAISE EXCEPTION 'Expected existing authenticated Telegram webhook';
  END IF;
  IF convert_from(decode(
      translate(split_part(notification_key, '.', 2), '-_', '+/') ||
      repeat('=', (4 - length(split_part(notification_key, '.', 2)) % 4) % 4),
      'base64'), 'UTF8')::jsonb ->> 'role' <> 'service_role' THEN
    RAISE EXCEPTION 'Webhook must use a service-role credential';
  END IF;
  IF has_table_privilege('anon', 'vault.decrypted_secrets', 'SELECT')
     OR has_table_privilege('authenticated', 'vault.decrypted_secrets', 'SELECT') THEN
    RAISE EXCEPTION 'Vault must not be readable by browser roles';
  END IF;

  SELECT jobid INTO cron_id FROM cron.job
  WHERE jobname = 'process-confirmed-emails' AND active
    AND schedule = '* * * * *'
    AND command LIKE '%/functions/v1/resend-confirmed-email-worker?limit=10%';
  IF cron_id IS NULL THEN RAISE EXCEPTION 'Expected active one-minute email cron'; END IF;
  IF NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'np_internal_service_role') THEN
    PERFORM vault.create_secret(notification_key, 'np_internal_service_role',
      'Existing database webhook credential for private notification calls');
  ELSE
    RAISE EXCEPTION 'Notification secret name already exists; inspect before changing cron';
  END IF;

  -- Switch cron before restricting the Edge Function. Its schedule and batch
  -- size remain the same, and the existing worker already accepts this key.
  PERFORM cron.alter_job(cron_id, command := $cron$
    SELECT net.http_post(
      url := 'https://ijvawiaeoutidvzkbjuf.supabase.co/functions/v1/resend-confirmed-email-worker?limit=10',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'np_internal_service_role')
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 55000
    );
  $cron$);

  -- Keep the exact webhook, arguments and events, allowing time for its bounded
  -- Telegram API call. The credential never leaves this SQL block.
  IF webhook_definition NOT LIKE '%, ''5000'')' THEN
    RAISE EXCEPTION 'Unexpected Telegram webhook timeout';
  END IF;
  EXECUTE replace(replace(webhook_definition, 'CREATE TRIGGER', 'CREATE OR REPLACE TRIGGER'),
                  ', ''5000'')', ', ''20000'')');

  EXECUTE format('ALTER POLICY "Admin only full access appointments" ON public.appointments TO authenticated USING ((SELECT auth.uid()) = %L::uuid) WITH CHECK ((SELECT auth.uid()) = %L::uuid)', administrator, administrator);
  EXECUTE format('ALTER POLICY "Admin only full access contact" ON public.contact_messages TO authenticated USING ((SELECT auth.uid()) = %L::uuid) WITH CHECK ((SELECT auth.uid()) = %L::uuid)', administrator, administrator);
  EXECUTE format('ALTER POLICY "Admin only full access blog" ON public.blog_posts TO authenticated USING ((SELECT auth.uid()) = %L::uuid) WITH CHECK ((SELECT auth.uid()) = %L::uuid)', administrator, administrator);
  EXECUTE format('ALTER POLICY "Admin only read cookie_consents" ON public.cookie_consents TO authenticated USING ((SELECT auth.uid()) = %L::uuid)', administrator);
  EXECUTE format('ALTER POLICY "Admin full access on blocked_dates" ON public.blocked_dates TO authenticated USING ((SELECT auth.uid()) = %L::uuid) WITH CHECK ((SELECT auth.uid()) = %L::uuid)', administrator, administrator);
END;
$hardening$;

-- Retain legacy policies, restricting them to the existing server role.
-- Browser roles use only the administrator policies above and public blog reads.
ALTER POLICY "Admin full access appointments" ON public.appointments TO service_role;
ALTER POLICY "Allow anon delete appointments" ON public.appointments TO service_role;
ALTER POLICY "Allow anon update appointments" ON public.appointments TO service_role;
ALTER POLICY "Allow anonymous inserts" ON public.appointments TO service_role;
ALTER POLICY "Admin full access contact" ON public.contact_messages TO service_role;
ALTER POLICY "Admin full access blog" ON public.blog_posts TO service_role;
ALTER POLICY "Admin read cookie_consents" ON public.cookie_consents TO service_role;

REVOKE ALL PRIVILEGES ON TABLE
  public.appointments, public.contact_messages, public.blog_posts,
  public.cookie_consents, public.blocked_dates, public.appointment_email_queue
FROM anon, authenticated;

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.appointments, public.contact_messages, public.blog_posts, public.blocked_dates
TO authenticated;
GRANT SELECT ON public.cookie_consents TO authenticated;
-- Existing service_role privileges are preserved for booking/contact/consent/
-- availability handlers and notification processing.

ALTER FUNCTION public.enqueue_appointment_confirmed_email() SET search_path = '';
REVOKE EXECUTE ON FUNCTION public.enqueue_appointment_confirmed_email() FROM PUBLIC, anon, authenticated;

-- Internal delivery metadata only. Existing sent tasks and appointment rows
-- are untouched, and the existing status-confirmation trigger is unchanged.
ALTER TABLE public.appointment_email_queue
  ADD COLUMN processing_started_at timestamptz,
  ADD COLUMN next_attempt_at timestamptz;
ALTER TABLE public.appointment_email_queue ALTER COLUMN status SET DEFAULT 'pending';
CREATE INDEX idx_appointment_email_queue_appointment_id
  ON public.appointment_email_queue (appointment_id);
