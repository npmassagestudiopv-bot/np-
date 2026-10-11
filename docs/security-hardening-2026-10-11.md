# Security and notification reliability — 11 October 2026

Applied to Supabase project `ijvawiaeoutidvzkbjuf`. The site's existing colours,
public forms, booking payloads, business rules and BG/EN SEO are preserved.

## Database access

- Migration `20261011092155_harden_access_and_notifications` resolves the existing
  confirmed administrator by email and binds the administrator policies to that
  account's immutable Auth ID. Other authenticated users cannot read or change
  appointments, contact messages, cookie consents or blocked dates.
- Legacy broad policies are retained with access restricted to `service_role`.
  Browser roles have no appointment writes without the administrator policy,
  no queue access and no `TRUNCATE`, `TRIGGER` or `REFERENCES` grants.
- Public blog reads and administrator CRUD remain available. Existing service-role
  permissions for booking, contact, consent, availability and notifications remain.
- The existing confirmation trigger stays a security-definer trigger, with an
  empty search path and no direct execution grant for browser roles.
- The queue gains two nullable internal fields: `processing_started_at` and
  `next_attempt_at`. Its default status is aligned with the existing trigger's
  `pending` value. A foreign-key index supports appointment deletion/cascades.

## Cron, Telegram and email

| Component | Current behavior |
| --- | --- |
| Cron | Existing `process-confirmed-emails` job runs every minute with `limit=10`. Its credential is read from encrypted Vault; HTTP timeout is 55 seconds. |
| Telegram | Existing INSERT/UPDATE webhook and bot/chat secrets are preserved. The webhook timeout is 20 seconds; the API request has a 10-second timeout. |
| Internal authorization | Both endpoints retain gateway JWT verification, reject public callers and accept configured service credentials. A different, valid legacy service JWT must match this project and pass a read-only PostgREST authorization check against the private queue. Decoding claims alone never grants access. |
| Telegram formatting | HTML escaping protects names, email addresses and messages from breaking formatting. The handler checks both the HTTP response and Telegram's `ok` result, and returns failure when delivery is rejected. |
| Email processing | Conditional DB claims prevent concurrent workers from processing the same pending item. Expired five-minute leases are recovered within the safe retry window. |
| Email retries | Network failures, HTTP 429 and server errors receive up to three attempts with backoff. Permanent errors remain failed. Old ambiguous deliveries require manual review. |
| Duplicate protection | Resend receives a stable idempotency key per queue item. Automatic recovery stops before the provider's 24-hour idempotency window expires. |
| Email content | Existing subject, text, HTML template and `reservations@npmassagestudio.com` sender are unchanged. |

The confirmation trigger retains its current behavior: an UPDATE from a status
outside `confirmed`/`completed` into either status enqueues an email. Changing
`confirmed` to `completed` does not enqueue another. No historical tasks are resent.

Keep JWT verification enabled when deploying either notification function. Deploy
the database migration before the new email worker; the worker uses the new queue
columns and the cron must already use its private credential.

## Website fixes

- Article previews in both administrator editors sanitize HTML while retaining
  the existing Markdown formatting and links.
- Appointment reads and mutations check returned Supabase errors. A failed update
  cannot appear as a successful confirmation; failed bulk operations reload data.
- Administrator booking waits for checked availability, rejects stale responses
  and normalizes database time values. A failed availability request disables
  booking slots and displays an error.

## Validation

- 27 regression tests cover public booking, BG/EN routes and SEO, HTML sanitization,
  administrator errors, internal authorization, concurrent email processing,
  retries, provider rejection and lease recovery. Type checks and production build pass.
- `supabase/tests/security_and_notification_regression.sql` exercises outsider
  isolation, administrator insert/confirmation, a single queued email, three
  Telegram webhook events. Conditional claims and recovery are tested locally
  with mocked senders. Every synthetic
  row and webhook request is rolled back. `pg_net` dispatches only after COMMIT.
- Live requests with the existing service credential succeed. Telegram's read-only
  `getMe`/`getChat` checks succeed; authenticated email dry-run returns HTTP 200.
- Public JWT calls to both notification endpoints return HTTP 401. Public blog
  and availability return HTTP 200. Invalid booking/contact/consent requests
  reach their normal HTTP 400 validation; direct private appointment reads are denied.
- Cron remains active and its service-role worker requests return HTTP 200.
  Existing queue records are unchanged; no test customer or test notification persists.

No real test email or Telegram message was sent. These checks establish access,
configuration and processing behavior; delivery of the next genuine confirmation
must still be observed at the provider/recipient.

The remaining security-advisor warning is disabled
[leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
Auth plan/settings have not been changed. Performance notices concern the newly
created, not-yet-used FK index and overlapping administrator/public blog SELECT
policies; neither grants private access.

References:

- [Supabase pg_net transaction behavior](https://supabase.com/docs/guides/database/extensions/pg_net)
- [Supabase scheduled functions and Vault](https://supabase.com/docs/guides/functions/schedule-functions)
- [Resend idempotency headers](https://resend.com/docs/api-reference/emails/send-email)
- [Telegram message formatting](https://core.telegram.org/bots/api#formatting-options)
