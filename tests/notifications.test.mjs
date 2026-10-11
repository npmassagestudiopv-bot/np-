import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isInternalRequest } from '../supabase/functions/_shared/internal-auth.ts';
import { createTelegramHandler, formatSmartMessage } from '../supabase/functions/telegram-notify/handler.ts';
import { createEmailWorker, createResendSender, DeliveryError } from '../supabase/functions/resend-confirmed-email-worker/worker.ts';
import { buildEmail } from '../supabase/functions/resend-confirmed-email-worker/email-template.ts';

const KEY = 'private-test-service-key';
const request = (path = '', key = KEY, body = {}) => new Request(`https://example.test/worker${path}`, {
  method: 'POST', headers: { authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});
const appointment = { email: 'customer@example.test', name: '<Иван & Мария>', appointment_date: '2030-01-15', appointment_time: '10:00', service: 'classical', location: 'vt', message: '<script>bad</script>' };
const item = (overrides = {}) => ({ id: 'queue-1', appointment_id: 'appointment-1', email_type: 'confirmed', status: 'pending', attempts: 0, created_at: '2030-01-01T00:00:00Z', processing_started_at: null, next_attempt_at: null, appointments: appointment, ...overrides });

// An in-memory PostgREST-shaped client. Updates apply predicates atomically,
// including conditional claims, and can fail without modifying the row.
function memoryDatabase(rows) {
  const database = { rows: structuredClone(rows), reads: 0, writes: 0, failSentSave: 0 };
  database.from = () => {
    let patch, single = false, returning = false, max = Infinity;
    const predicates = [];
    const comparisons = {
      eq: (a, b) => a === b, lt: (a, b) => a != null && a < b,
      lte: (a, b) => a != null && a <= b, gt: (a, b) => a != null && a > b,
      gte: (a, b) => a != null && a >= b, is: (a, b) => b === 'null' && a == null,
    };
    const query = {
      select() { returning = true; return query; },
      update(value) { patch = value; return query; },
      order() { return query; },
      limit(value) { max = value; return query; },
      maybeSingle() { single = true; return query; },
      or(expression) {
        const conditions = expression.split(',').map((part) => {
          const [, column, op, value] = part.match(/^([\w_]+)\.([\w]+)\.(.*)$/);
          return (row) => comparisons[op](row[column], typeof row[column] === 'number' ? Number(value) : value);
        });
        predicates.push((row) => conditions.some((condition) => condition(row)));
        return query;
      },
      then(resolve, reject) {
        const selected = database.rows.filter((row) => predicates.every((predicate) => predicate(row))).slice(0, max);
        if (patch) {
          database.writes++;
          if (patch.status === 'sent' && database.failSentSave-- > 0) return Promise.resolve({ data: null, error: { message: 'Database unavailable' } }).then(resolve, reject);
          selected.forEach((row) => Object.assign(row, patch));
        } else database.reads++;
        const data = returning ? structuredClone(single ? selected[0] ?? null : selected) : null;
        return Promise.resolve({ data, error: null }).then(resolve, reject);
      },
    };
    for (const [op, compare] of Object.entries(comparisons)) query[op] = (column, value) => { predicates.push((row) => compare(row[column], value)); return query; };
    return query;
  };
  return database;
}
const worker = (database, send, now = () => Date.parse('2030-01-15T08:00:00Z')) => createEmailWorker({ database, send, now, keys: [KEY], from: 'reservations@npmassagestudio.com' });

test('Internal endpoints reject public/unknown keys and accept configured service keys', async () => {
  assert.equal(await isInternalRequest(request('', 'public-anon-key'), [KEY]), false);
  assert.equal(await isInternalRequest(request('', KEY), [undefined, KEY]), true);
  assert.equal(await isInternalRequest(request('', ''), [undefined, '']), false);
  assert.equal(await isInternalRequest(new Request('https://example.test'), [KEY]), false);
});

test('Legacy service JWTs require project scope and server verification; forged claims fail', async () => {
  const jwt = (payload) => `${Buffer.from('{"alg":"HS256"}').toString('base64url')}.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
  const claims = { iss: 'supabase', role: 'service_role', ref: 'project', exp: Math.floor(Date.now() / 1000) + 60 };
  let probes = 0;
  const verification = { url: 'https://project.supabase.co', apiKey: 'public-key', fetcher: async (_url, options) => { probes++; assert.equal(options.method, 'HEAD'); return new Response(null, { status: 403 }); } };
  assert.equal(await isInternalRequest(request('', jwt(claims)), [KEY], verification), false);
  assert.equal(probes, 1);
  for (const invalid of [{ ...claims, role: 'anon' }, { ...claims, ref: 'other' }, { ...claims, exp: 1 }]) {
    assert.equal(await isInternalRequest(request('', jwt(invalid)), [KEY], verification), false);
  }
  assert.equal(probes, 1);
  assert.equal(await isInternalRequest(request('', jwt(claims)), [KEY], { ...verification, fetcher: async () => new Response(null, { status: 200 }) }), true);
});

test('Telegram rejects unauthorized callers and diagnostics never send messages', async () => {
  let sends = 0;
  const handler = createTelegramHandler({ keys: [KEY], token: 'secret-bot', chatId: 'secret-chat' }, async () => { sends++; throw new Error('Unexpected send'); });
  assert.equal((await handler(request('', 'public'))).status, 401);
  const response = await handler(request('?dryRun=1', KEY, { table: 'appointments', record: appointment }));
  assert.deepEqual(await response.json(), { ok: true, dryRun: true, configured: true });
  assert.equal(sends, 0);
  assert.equal((await handler(request('', KEY, []))).status, 400);
});

test('Telegram escapes client fields, preserves useful labels and reports API rejection', async () => {
  let payload;
  const handler = createTelegramHandler({ keys: [KEY], token: 'bot', chatId: 'chat' }, async (_url, options) => {
    payload = JSON.parse(options.body);
    return Response.json({ ok: true, result: { message_id: 1 } });
  });
  assert.equal((await handler(request('', KEY, { table: 'appointments', record: { ...appointment, name: 'Иван_Тест <b>&' } }))).status, 200);
  assert.equal(payload.parse_mode, 'HTML');
  assert.ok(payload.text.includes('Иван_Тест &lt;b&gt;&amp;'));
  assert.ok(payload.text.includes('<b>Appointment Date:</b> 2030-01-15'));
  assert.ok(!payload.text.includes('<script>'));
  for (const status of [200, 400, 500]) {
    const rejected = createTelegramHandler({ keys: [KEY], token: 'bot', chatId: 'chat' }, async () => Response.json({ ok: false, error_code: 400 }, { status }));
    assert.equal((await rejected(request())).status, 502);
  }
  const large = formatSmartMessage('appointments', Object.fromEntries(Array.from({ length: 40 }, (_, index) => [`field_${index}`, '<&'.repeat(1000)])));
  const decoded = large.replace(/<\/?b>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  assert.ok(decoded.length <= 4096);
  assert.ok(!large.includes('undefined'));
});

test('Telegram provider diagnostic reads bot/chat metadata without sending', async () => {
  const methods = [];
  const handler = createTelegramHandler({ keys: [KEY], token: 'bot', chatId: 'chat' }, async (url) => {
    methods.push(url.split('/').at(-1));
    return Response.json({ ok: true, result: {} });
  });
  const response = await handler(request('?dryRun=1&verifyProvider=1'));
  assert.deepEqual(methods, ['getMe', 'getChat']);
  assert.equal((await response.json()).providerVerified, true);
});

test('Worker rejects public keys before DB access; dryRun neither claims nor sends', async () => {
  const database = memoryDatabase([item()]);
  let sends = 0;
  const handler = worker(database, async () => { sends++; return 'email-1'; });
  assert.equal((await handler(request('', 'public'))).status, 401);
  assert.equal(database.reads + database.writes, 0);
  const response = await handler(request('?dryRun=1&limit=invalid'));
  const data = await response.json();
  assert.equal(data.processed, 1);
  assert.equal(database.writes, 0);
  assert.equal(sends, 0);
  assert.equal(database.rows[0].status, 'pending');
  assert.ok(!JSON.stringify(data).includes(appointment.email));
});

test('Overlapping cron invocations claim each email once', async () => {
  const database = memoryDatabase([item()]);
  const sends = [];
  const handler = worker(database, async (email, id) => { sends.push({ email, id }); return 'email-1'; });
  const results = await Promise.all([handler(request()), handler(request())]);
  assert.ok(results.every((response) => response.status === 200));
  assert.equal(sends.length, 1);
  assert.equal(sends[0].email.to, appointment.email);
  assert.equal(database.rows[0].status, 'sent');
  assert.equal(database.rows[0].attempts, 1);
});

test('Transient send failure retries when due and stops after three attempts', async () => {
  const database = memoryDatabase([item()]);
  let clock = Date.parse('2030-01-15T08:00:00Z'), sends = 0;
  const handler = worker(database, async () => { sends++; throw new DeliveryError('HTTP 429', true); }, () => clock);
  await handler(request());
  assert.equal(database.rows[0].status, 'pending');
  assert.equal(database.rows[0].attempts, 1);
  await handler(request());
  assert.equal(sends, 1);
  clock += 60_001;
  await handler(request());
  clock += 120_001;
  await handler(request());
  assert.equal(sends, 3);
  assert.equal(database.rows[0].status, 'failed');
  await handler(request());
  assert.equal(sends, 3);
});

test('A failed DB save is visible; lease recovery reuses provider idempotency', async () => {
  const database = memoryDatabase([item()]);
  database.failSentSave = 1;
  let clock = Date.parse('2030-01-15T08:00:00Z'), requests = 0;
  const providerDeliveries = new Map();
  const handler = worker(database, async (_email, id) => {
    requests++;
    if (!providerDeliveries.has(id)) providerDeliveries.set(id, 'email-1');
    return providerDeliveries.get(id);
  }, () => clock);
  assert.equal((await handler(request())).status, 500);
  assert.equal(database.rows[0].status, 'processing');
  clock += 60_000;
  await handler(request());
  assert.equal(requests, 1);
  clock += 5 * 60_000;
  assert.equal((await handler(request())).status, 200);
  assert.equal(requests, 2);
  assert.equal(providerDeliveries.size, 1);
  assert.equal(database.rows[0].status, 'sent');
});

test('Expired ambiguous deliveries and invalid recipients are retained without sending', async () => {
  const old = item({ id: 'old', status: 'processing', attempts: 1, processing_started_at: '2030-01-13T08:00:00Z' });
  const database = memoryDatabase([old, item({ appointments: null })]);
  let sends = 0;
  await worker(database, async () => { sends++; return 'email-1'; })(request());
  assert.equal(sends, 0);
  assert.ok(database.rows.every((row) => row.status === 'failed'));
});

test('Resend requests use stable idempotency headers and distinguish permanent errors', async () => {
  const calls = [];
  const sender = createResendSender('secret-resend', async (url, options) => { calls.push({ url, options }); return Response.json({ id: 'email-1' }); });
  const email = { ...buildEmail({ ...appointment, businessName: 'NP MASSAGE STUDIO' }), from: 'reservations@npmassagestudio.com', to: appointment.email };
  await sender(email, 'queue-1');
  await sender(email, 'queue-1');
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].options.headers['Idempotency-Key'], calls[1].options.headers['Idempotency-Key']);
  assert.equal(JSON.parse(calls[0].options.body).html, email.html);
  assert.deepEqual(JSON.parse(calls[0].options.body).to, [appointment.email]);
  assert.ok(email.html.includes('&lt;Иван &amp; Мария&gt;'));
  assert.ok(!email.html.includes('<script>bad</script>'));
  for (const [status, retryable] of [[400, false], [401, false], [409, false], [429, true], [500, true]]) {
    const failing = createResendSender('key', async () => Response.json({ name: 'error' }, { status }));
    await assert.rejects(failing(email, 'queue-1'), (error) => error instanceof DeliveryError && error.retryable === retryable);
  }
});
