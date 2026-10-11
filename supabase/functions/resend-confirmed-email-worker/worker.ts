import { isInternalRequest, jsonResponse } from '../_shared/internal-auth.ts';
import type { LegacyVerification } from '../_shared/internal-auth.ts';
import { buildEmail } from './email-template.ts';

export class DeliveryError extends Error {
  retryable: boolean;
  constructor(message: string, retryable: boolean) { super(message); this.retryable = retryable; }
}

type Email = { from: string; to: string; subject: string; text: string; html: string };
export function createResendSender(apiKey: string, fetcher: typeof fetch = fetch) {
  return async (email: Email, queueId: string): Promise<string> => {
    let response: Response;
    try {
      response = await fetcher('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          // A queue item is one delivery, including lease recovery and retries.
          'Idempotency-Key': `appointment-confirmed/${queueId}`,
        },
        body: JSON.stringify({ ...email, to: [email.to] }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new DeliveryError('Resend network request failed', true);
    }
    let result: { id?: string; name?: string };
    try { result = await response.json(); } catch {
      throw new DeliveryError('Invalid Resend response', response.status >= 500 || response.ok);
    }
    if (!response.ok || !result.id) {
      throw new DeliveryError(`Resend rejected request (HTTP ${response.status})`, response.status === 429 || response.status >= 500);
    }
    return result.id;
  };
}

type Configuration = {
  keys: Array<string | undefined>;
  verification?: LegacyVerification;
  // The live supabase-js client, or an in-memory client in regression tests.
  database: { from: (table: string) => any };
  send: (email: Email, queueId: string) => Promise<string>;
  from: string;
  region?: string;
  now?: () => number;
};
const MAX_ATTEMPTS = 3;
const LEASE_MS = 5 * 60_000;
// Resend keeps idempotency keys for 24 hours. Never automatically resend an
// ambiguous delivery after this window; keep a failed item for manual review.
const RETRY_WINDOW_MS = 23 * 60 * 60_000;
const queueTable = 'appointment_email_queue';

export function createEmailWorker(configuration: Configuration) {
  const now = configuration.now ?? Date.now;
  const table = () => configuration.database.from(queueTable);
  return async (request: Request): Promise<Response> => {
    if (!await isInternalRequest(request, configuration.keys, configuration.verification)) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
    const url = new URL(request.url);
    const requestedLimit = Number.parseInt(url.searchParams.get('limit') ?? '10', 10);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 10;
    const dryRun = url.searchParams.get('dryRun') === '1';
    const started = now();
    const timestamp = new Date(started).toISOString();
    const stale = new Date(started - LEASE_MS).toISOString();
    const expired = new Date(started - RETRY_WINDOW_MS).toISOString();
    const details: Array<Record<string, unknown>> = [];
    let processed = 0, sent = 0, failed = 0;
    try {
      if (!dryRun) {
        // Only the service role can access this queue. Recover a crashed worker
        // within the provider's idempotency window; do not revive old failures.
        for (const query of [
          () => table().update({ status: 'failed', processing_started_at: null, last_error: 'Delivery outcome requires manual review' })
            .eq('status', 'processing').or(`processing_started_at.lt.${expired},attempts.gte.${MAX_ATTEMPTS}`).lt('processing_started_at', stale),
          () => table().update({ status: 'pending', processing_started_at: null, next_attempt_at: timestamp, last_error: 'Recovered expired processing lease' })
            .eq('status', 'processing').lt('processing_started_at', stale).gte('processing_started_at', expired).lt('attempts', MAX_ATTEMPTS),
          () => table().update({ status: 'failed', last_error: 'Retry window expired; delivery requires manual review' })
            .eq('status', 'pending').gt('attempts', 0).lt('next_attempt_at', expired),
        ]) {
          const { error } = await query();
          if (error) throw new Error('Queue recovery failed');
        }
      }
      const { data: rows, error } = await table()
        .select('id,appointment_id,attempts,next_attempt_at,appointments:appointment_id(email,name,appointment_date,appointment_time,service,location,message)')
        .eq('email_type', 'confirmed').eq('status', 'pending')
        .or(`next_attempt_at.is.null,next_attempt_at.lte.${timestamp}`)
        .order('created_at', { ascending: true }).limit(limit);
      if (error) throw new Error('Queue fetch failed');
      for (const row of rows ?? []) {
        // Leave unfinished items pending for the next minute, with room for the
        // provider timeout. The DB webhook timeout is independent of sending.
        if (!dryRun && now() - started >= 34_000) break;
        const appointment = Array.isArray(row.appointments) ? row.appointments[0] : row.appointments;
        if (dryRun) {
          processed++;
          if (appointment?.email) sent++; else failed++;
          details.push({ id: row.id, ok: Boolean(appointment?.email) });
          continue;
        }
        const claimTimestamp = new Date(now()).toISOString();
        const attempts = (row.attempts ?? 0) + 1;
        const { data: claim, error: claimError } = await table()
          .update({ status: 'processing', processing_started_at: claimTimestamp, attempts })
          .eq('id', row.id).eq('status', 'pending').eq('attempts', row.attempts ?? 0)
          .select('id').maybeSingle();
        if (claimError) throw new Error('Queue claim failed');
        if (!claim) continue; // Another cron invocation already claimed this item.
        processed++;
        let providerId: string | undefined;
        let deliveryError: DeliveryError | undefined;
        if (!appointment?.email) {
          deliveryError = new DeliveryError('Missing appointments.email', false);
        } else {
          try {
            const email = buildEmail({
              name: appointment.name ?? '', appointment_date: appointment.appointment_date ?? '',
              appointment_time: appointment.appointment_time ?? '', service: appointment.service ?? '',
              location: appointment.location ?? '', message: appointment.message,
              businessName: 'NP MASSAGE STUDIO',
            });
            providerId = await configuration.send({ ...email, from: configuration.from, to: appointment.email }, row.id);
          } catch (error) {
            deliveryError = error instanceof DeliveryError ? error : new DeliveryError('Email delivery failed', false);
          }
        }
        const retry = Boolean(deliveryError?.retryable && attempts < MAX_ATTEMPTS);
        const patch = deliveryError
          ? { status: retry ? 'pending' : 'failed', last_error: deliveryError.message, processing_started_at: null,
              next_attempt_at: retry ? new Date(now() + attempts * 60_000).toISOString() : null }
          : { status: 'sent', last_error: null, processing_started_at: null, next_attempt_at: null };
        const { data: saved, error: saveError } = await table().update(patch)
          .eq('id', row.id).eq('status', 'processing').eq('processing_started_at', claimTimestamp)
          .select('id').maybeSingle();
        // On failure retain the processing lease. Recovery uses the same
        // idempotency key, instead of silently recording a false success.
        if (saveError || !saved) throw new Error('Queue result persistence failed');
        if (deliveryError) { failed++; details.push({ id: row.id, ok: false, retry }); }
        else { sent++; details.push({ id: row.id, ok: true, resend_id: providerId }); }
      }
      return jsonResponse({ ok: true, processed, sent, failed, dryRun, region: configuration.region ?? null, details });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Queue processing failed';
      console.error(message); // Fixed internal messages; no customer data or keys.
      return jsonResponse({ ok: false, processed, sent, failed, dryRun, error: message }, 500);
    }
  };
}
