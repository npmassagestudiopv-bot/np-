import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const execute = promisify(execFile);
const script = fileURLToPath(new URL('../scripts/audit-live-seo.mjs', import.meta.url));
const origin = 'https://npmassagestudio.com';

async function runFixture(botFailure) {
  const requests = [];
  const server = createServer((request, response) => {
    requests.push({ method: request.method, path: request.url, agent: request.headers['user-agent'] });
    const missing = request.url === '/__seo_audit_missing_page__';
    const wrongBotPage = botFailure && request.headers['user-agent'].includes('Googlebot');
    const english = request.url.startsWith('/en');
    response.writeHead(missing ? 404 : 200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (missing || wrongBotPage) {
      response.end('<html lang="bg"><head><title>Страницата не е намерена</title><meta name="robots" content="noindex,nofollow"></head><body><h1>404</h1></body></html>');
    } else {
      response.end(`<html lang="${english ? 'en' : 'bg'}"><head><title>${english ? 'Massage services' : 'Масажни услуги'}</title>
        <link rel="canonical" href="${origin}${request.url}">
        <link rel="alternate" hreflang="bg" href="${origin}/uslugi">
        <link rel="alternate" hreflang="en" href="${origin}/en/services">
        <link rel="alternate" hreflang="x-default" href="${origin}/uslugi">
        </head><body><main><h1>${english ? 'Our Services' : 'Нашите услуги'}</h1></main></body></html>`);
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const args = [script, '--base-url', `http://127.0.0.1:${server.address().port}`, '--paths', '/uslugi,/en/services', '--json'];
    try {
      const result = await execute(process.execPath, args);
      return { report: JSON.parse(result.stdout), code: 0, requests };
    } catch (error) {
      return { report: JSON.parse(error.stdout), code: error.code, requests };
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('Live SEO command accepts correct BG/EN HTML and a genuine noindex HTTP 404', async () => {
  const { report, code, requests } = await runFixture(false);
  assert.equal(code, 0);
  assert.equal(report.failed, 0);
  assert.equal(report.passed, 6);
  assert.equal(requests.length, 6);
  assert.ok(requests.every((request) => request.method === 'GET'));
});

test('Live SEO command fails when Googlebot alone receives HTTP 200 with the noindex 404 page', async () => {
  const { report, code, requests } = await runFixture(true);
  assert.equal(code, 1);
  assert.equal(report.failed, 2);
  const badPages = report.results.filter((page) => page.errors.length);
  assert.ok(badPages.every((page) => page.agent === 'googlebot' && page.status === 200));
  assert.ok(badPages.every((page) => page.errors.some((error) => error.includes('returns noindex'))));
  assert.ok(badPages.every((page) => page.errors.some((error) => error.includes('404 heading'))));
  assert.ok(requests.every((request) => request.method === 'GET'));
});
