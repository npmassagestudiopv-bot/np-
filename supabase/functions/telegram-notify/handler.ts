import { isInternalRequest, jsonResponse } from '../_shared/internal-auth.ts';
import type { LegacyVerification } from '../_shared/internal-auth.ts';

type Configuration = { keys: Array<string | undefined>; verification?: LegacyVerification; token?: string; chatId?: string };

const escapeHtml = (text: string) => text.replace(/[&<>]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;',
})[character]!);
const capitalize = (text: string) => text.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export function formatSmartMessage(table: string, data: Record<string, unknown>): string {
  const priorityKeys = ['name', 'phone', 'email', 'service', 'location', 'appointment_date', 'appointment_time', 'date', 'time'];
  const keys = [...priorityKeys, ...Object.keys(data).filter((key) => !priorityKeys.includes(key))];
  const title = `🚀 Ново записване: ${table.toUpperCase().slice(0, 80)}`;
  const lines = [`<b>${escapeHtml(title)}</b>`, '----------------------------------'];
  // Limit is 4096 characters after parsing entities. Shorten before HTML
  // escaping, never inside entities, and keep important fields first.
  let remaining = 3900 - title.length - 36;
  for (const key of keys) {
    if (!data[key] || remaining < 10) continue;
    const label = capitalize(key).slice(0, 80);
    const raw = typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key]);
    const value = raw.slice(0, Math.max(0, Math.min(700, remaining - label.length - 4)));
    if (!value) continue;
    lines.push(`<b>${escapeHtml(label)}:</b> ${escapeHtml(value)}`);
    remaining -= label.length + value.length + 4;
  }
  return lines.join('\n');
}

export function createTelegramHandler(configuration: Configuration, fetcher: typeof fetch = fetch) {
  return async (request: Request): Promise<Response> => {
    if (!await isInternalRequest(request, configuration.keys, configuration.verification)) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
    if (!configuration.token || !configuration.chatId) return jsonResponse({ ok: false, error: 'Telegram configuration missing' }, 503);
    let body: Record<string, unknown>;
    try {
      body = await request.json();
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
    } catch {
      return jsonResponse({ ok: false, error: 'Invalid JSON payload' }, 400);
    }
    const record = body.record ?? body;
    if (!record || typeof record !== 'object' || Array.isArray(record)) return jsonResponse({ ok: false, error: 'Invalid record' }, 400);
    const text = formatSmartMessage(typeof body.table === 'string' ? body.table : 'unknown', record as Record<string, unknown>);
    // This authenticated diagnostic sends nothing and returns no secrets.
    if (new URL(request.url).searchParams.get('dryRun') === '1') {
      if (new URL(request.url).searchParams.get('verifyProvider') === '1') {
        try {
          // These Telegram methods only read bot/chat metadata; no messages.
          for (const [method, payload] of [['getMe', {}], ['getChat', { chat_id: configuration.chatId }]] as const) {
            const response = await fetcher(`https://api.telegram.org/bot${configuration.token}/${method}`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload), signal: AbortSignal.timeout(5000),
            });
            const result = await response.json();
            if (!response.ok || result?.ok !== true) throw new Error('Telegram verification failed');
          }
          return jsonResponse({ ok: true, dryRun: true, configured: true, providerVerified: true });
        } catch {
          return jsonResponse({ ok: false, dryRun: true, error: 'Telegram verification failed' }, 502);
        }
      }
      return jsonResponse({ ok: true, dryRun: true, configured: true });
    }
    try {
      const response = await fetcher(`https://api.telegram.org/bot${configuration.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: configuration.chatId, text, parse_mode: 'HTML' }),
        signal: AbortSignal.timeout(10_000),
      });
      const result = await response.json();
      if (!response.ok || result?.ok !== true) {
        console.error('Telegram rejected notification', response.status, result?.error_code ?? null);
        return jsonResponse({ ok: false, error: 'Telegram rejected notification' }, 502);
      }
      return jsonResponse({ ok: true });
    } catch {
      // Fetch errors may include the URL containing the bot token: never log it.
      console.error('Telegram notification request failed');
      return jsonResponse({ ok: false, error: 'Telegram request failed' }, 502);
    }
  };
}
