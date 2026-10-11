import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

let server, root, client, i18n, BookingForm, Navbar, useSeo, paths, availability, articles, dom;
const element = React.createElement;
const requests = [];
const bookings = [];
let bookingResponse = {};

before(async () => {
  dom = new JSDOM('<!doctype html><html><head></head><body><div id="test-root"></div></body></html>', { url: 'https://npmassagestudio.com/' });
  for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Event', 'MouseEvent', 'KeyboardEvent']) {
    Object.defineProperty(globalThis, key, { configurable: true, value: dom.window[key], writable: true });
  }
  window.scrollTo = () => {};
  HTMLElement.prototype.scrollIntoView = () => {};
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.__BOOKING_TEST_OPS__ = {
    fetchAvailableSlots: (date, location) => new Promise((resolve, reject) => requests.push({ date, location, resolve, reject })),
    invokeBooking: async (payload) => { bookings.push(payload); return bookingResponse; },
  };
  server = await createServer({
    server: { middlewareMode: true, hmr: false }, appType: 'custom',
    plugins: [{
      name: 'mock-booking-no-network', enforce: 'pre',
      resolveId(id) { if (id.endsWith('/lib/supabase') || id.endsWith('/lib/supabase.ts')) return '\0booking-test-api'; },
      load(id) { if (id === '\0booking-test-api') return 'export const getBookingOps = async () => globalThis.__BOOKING_TEST_OPS__;'; },
    }],
  });
  paths = await server.ssrLoadModule('/src/lib/localizedPaths.ts');
  availability = await server.ssrLoadModule('/src/lib/bookingAvailability.ts');
  articles = await server.ssrLoadModule('/src/lib/articleContent.ts');
  ({ useSeo } = await server.ssrLoadModule('/src/hooks/useSeo.ts'));
  ({ default: i18n } = await server.ssrLoadModule('/src/i18n/index.ts'));
  ({ default: BookingForm } = await server.ssrLoadModule('/src/pages/booking/components/BookingForm.tsx'));
  ({ default: Navbar } = await server.ssrLoadModule('/src/components/feature/Navbar.tsx'));
  ({ createRoot: client } = await import('react-dom/client'));
  root = client(document.getElementById('test-root'));
});

after(async () => {
  await act(async () => root?.unmount());
  await server?.close();
  dom?.window.close();
});

async function mount(component, path = '/') {
  await act(async () => {
    root.render(element(I18nextProvider, { i18n }, element(MemoryRouter, { initialEntries: [path], key: path }, component)));
  });
}
async function click(button) {
  assert.ok(button, 'expected a visible control');
  await act(async () => button.dispatchEvent(new MouseEvent('click', { bubbles: true })));
}
function buttonContaining(text) { return [...document.querySelectorAll('button')].find((button) => button.textContent.includes(text)); }
function slot(time) { return [...document.querySelectorAll('button')].find((button) => button.textContent.trim().startsWith(time)); }
async function fill(id, value) {
  const input = document.getElementById(id);
  await act(async () => {
    const prototype = input.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
async function settle(request, value, fail = false) {
  await act(async () => { fail ? request.reject(new Error('network failure')) : request.resolve(value); });
}

test('Language navigation preserves real service/blog URLs, queries and anchors', () => {
  assert.equal(paths.localizedPath('/uslugi/klasicheski-masazh', 'en'), '/en/services/klasicheski-masazh');
  assert.equal(paths.localizedPath('/en/services/aromaterapiya?source=home#details', 'bg'), '/uslugi/aromaterapiya?source=home#details');
  assert.equal(paths.localizedPath('/blog/polzi-ot-masazh', 'en'), '/en/blog/polzi-ot-masazh');
  assert.equal(paths.localizedPath('/videos-masazhi', 'en'), '/en/videos-masazhi');
  assert.equal(paths.localizedPath('/rezervaciya?service=back#booking-form', 'en'), '/en/booking?service=back#booking-form');
  assert.equal(paths.localizedPath('/masazhi-pavlikeni', 'en'), '/masazhi-pavlikeni');
});

test('Availability rejects failures/stale responses and uses Sofia time including DST', () => {
  assert.equal(availability.availabilityIsReady('2030-01-15', 'vt', '2030-01-14|vt', false, false), false);
  assert.equal(availability.availabilityIsReady('2030-01-15', 'vt', '2030-01-15|vt', true, false), false);
  assert.equal(availability.availabilityIsReady('2030-01-15', 'vt', '2030-01-15|vt', false, true), false);
  assert.equal(availability.availabilityIsReady('2030-01-15', 'vt', '2030-01-15|vt', false, false), true);
  assert.equal(availability.studioNow(new Date('2026-10-10T21:30:00Z')).date, '2026-10-11');
  assert.equal(availability.isPastStudioSlot('2026-01-15', '10:00', new Date('2026-01-15T08:00:00Z')), true);
  assert.equal(availability.isPastStudioSlot('2026-07-15', '10:00', new Date('2026-07-15T07:00:00Z')), true);
  assert.deepEqual(availability.parseAvailability({ takenSlots: ['10:00:00'], blocked: true }), { takenSlots: ['10:00'], blocked: true });
  for (const result of [null, {}, { error: 'unavailable' }, { takenSlots: [null] }]) assert.throws(() => availability.parseAvailability(result));
});

test('Blog HTML preserves article links/formatting and removes executable content', () => {
  const html = articles.articleContentToHtml('## Грижа за гърба\n\n<strong>Полезно</strong> <a href="https://example.com" target="_blank">Прочети</a>\n<script>alert(1)</script><img src=x onerror=alert(1)><svg onload=alert(1)></svg><a href="java&#x73;cript:alert(1)">bad</a>');
  const document = new JSDOM(html).window.document;
  assert.equal(document.querySelector('h2').id, 'грижа-за-гърба');
  assert.equal(document.querySelector('strong').textContent, 'Полезно');
  assert.equal(document.querySelector('a').href, 'https://example.com/');
  assert.match(document.querySelector('a').rel, /noopener/);
  assert.equal(document.querySelectorAll('script,img,svg,[onerror],[onload]').length, 0);
  assert.equal(document.querySelectorAll('a[href^="javascript:"]').length, 0);
});

test('Admin article previews preserve Markdown while blocking executable HTML', () => {
  const html = articles.adminArticlePreviewToHtml('# Заглавие\n\n**Удебелен** и *курсив*\n- Точка\n<a href="https://example.test" target="_blank">Линк</a><img src=x onerror=alert(1)><svg onload=alert(1)></svg><script>alert(1)</script><a href="javascript:alert(1)">bad</a>');
  const document = new JSDOM(html).window.document;
  assert.equal(document.querySelector('h1')?.textContent, 'Заглавие');
  assert.equal(document.querySelector('strong')?.textContent, 'Удебелен');
  assert.equal(document.querySelector('em')?.textContent, 'курсив');
  assert.equal(document.querySelector('li')?.textContent, 'Точка');
  assert.equal(document.querySelectorAll('script,img,svg,[onerror],[onload],[href^="javascript:"]').length, 0);
  assert.ok(document.querySelector('a[href="https://example.test"]')?.rel.includes('noopener'));
});

test('SEO updates canonical/locale/schema content even with unchanged titles and schema counts', async () => {
  function SeoProbe({ options }) { useSeo(options); return null; }
  const shared = { title: 'Same title', description: 'Same description' };
  await mount(element(SeoProbe, { options: { ...shared, canonical: '/blog', og: { localeAlternate: ['en_US'] }, schemas: [{ type: 'WebPage', data: { name: 'A' } }] } }));
  await mount(element(SeoProbe, { options: { ...shared, canonical: 'https://npmassagestudio.com/en/blog', schemas: [{ type: 'WebPage', data: { name: 'B' } }] } }));
  assert.equal(document.querySelector('link[rel=canonical]').href, 'https://npmassagestudio.com/en/blog');
  assert.equal(document.querySelector('meta[property="og:url"]').content, 'https://npmassagestudio.com/en/blog');
  assert.equal(document.querySelector('meta[property="og:locale"]').content, 'en_US');
  assert.equal(document.querySelectorAll('meta[property="og:locale:alternate"]').length, 0);
  const schema = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  assert.equal(schema.name, 'B');
  assert.equal(schema.url, 'https://npmassagestudio.com/en/blog');
  await mount(element(SeoProbe, { options: { title: '404', description: 'Missing', noIndex: true } }));
  assert.equal(document.querySelectorAll('script[type="application/ld+json"],link[rel=canonical]').length, 0);
  assert.match(document.querySelector('meta[name=robots]').content, /noindex/);
});

test('Mobile menu contains focus, closes on Escape and restores the trigger', async () => {
  await mount(element(Navbar));
  const trigger = document.querySelector('button[aria-controls="mobile-navigation"]');
  await click(trigger);
  const menu = document.getElementById('mobile-navigation');
  const controls = menu.querySelectorAll('a[href],button');
  assert.equal(menu.getAttribute('aria-modal'), 'true');
  assert.equal(document.activeElement, controls[0]);
  await act(async () => controls[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })));
  assert.equal(document.activeElement, controls[controls.length - 1]);
  await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(document.activeElement, trigger);
  assert.equal(document.body.style.overflow, '');
  assert.equal(document.querySelectorAll('h1').length, 0, 'logo is not a second page heading');
});

test('Booking keeps payload/409/success flows and never offers unchecked slots', async () => {
  await mount(element(BookingForm), '/rezervaciya');
  await click(buttonContaining('Класически'));
  await click(buttonContaining('Велико Търново'));
  await fill('booking-date', '2030-01-15');
  assert.equal(requests.length, 1);
  assert.equal(slot('09:00'), undefined);
  assert.equal(document.querySelector('button[type=submit]').disabled, true);
  await settle(requests.at(-1), null, true);
  assert.ok(buttonContaining('Опитай отново'));
  assert.equal(slot('09:00'), undefined);
  assert.doesNotMatch(document.body.textContent, /Има свободни часове/);
  await click(buttonContaining('Опитай отново'));
  await settle(requests.at(-1), { takenSlots: ['10:00'], blocked: false });
  assert.equal(slot('10:00').disabled, true);
  await click(slot('09:00'));
  assert.equal(slot('09:00').getAttribute('aria-pressed'), 'true');
  await fill('booking-name', 'Test Client');
  await fill('booking-email', 'test@example.com');
  await fill('booking-phone', '+359888000000');
  await click(document.querySelector('#booking-form details summary'));
  await fill('booking-message', 'Prefer lighter pressure');
  bookingResponse = { error: 'Slot already taken' };
  await act(async () => document.getElementById('booking-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  assert.equal(bookings.length, 1);
  assert.deepEqual(bookings[0], { name: 'Test Client', email: 'test@example.com', phone: '+359888000000', service: 'classical', location: 'vt', appointment_date: '2030-01-15', appointment_time: '09:00', message: 'Prefer lighter pressure' });
  await settle(requests.at(-1), { takenSlots: ['09:00', '10:00'], blocked: false });
  assert.equal(slot('09:00').disabled, true);
  assert.ok(document.body.textContent.includes('Часът вече е зает'));
  await click(slot('11:00'));
  bookingResponse = { success: true };
  await act(async () => document.getElementById('booking-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  assert.equal(bookings.length, 2);
  assert.equal(bookings[1].message, 'Prefer lighter pressure', 'optional notes survive a slot conflict and retry');
  assert.ok(document.body.textContent.includes('Резервацията е получена'));
  assert.equal(document.getElementById('booking-date').value, '');
  assert.equal(document.getElementById('booking-message').value, '', 'successful booking resets optional notes');
  await click(buttonContaining('Велико Търново'));
  await fill('booking-date', '2030-01-16');
  await settle(requests.at(-1), { takenSlots: [], blocked: true });
  assert.equal(slot('09:00'), undefined);
  assert.equal(document.querySelector('button[type=submit]').disabled, true);
  await fill('booking-date', '2030-01-17');
  assert.equal(slot('09:00'), undefined, 'previous date is not reused');
  await settle(requests.at(-1), { takenSlots: [], blocked: false });
  assert.equal(slot('09:00').disabled, false);
});

test('All 103 sitemap routes have real content, unique metadata, correct language and clean schemas', () => {
  const manifest = JSON.parse(readFileSync(resolve('out/prerender-manifest.json'), 'utf8'));
  assert.equal(manifest.length, 103);
  const sitemap = readFileSync(resolve('out/sitemap.xml'), 'utf8');
  for (const page of manifest) {
    const file = resolve('out', page.path.slice(1), 'index.html');
    const window = new JSDOM(readFileSync(file, 'utf8')).window;
    const document = window.document;
    assert.equal(document.querySelectorAll('h1').length, 1, page.path);
    assert.equal(document.querySelectorAll('link[rel=canonical]').length, 1, page.path);
    assert.equal(document.querySelector('link[rel=canonical]').href, page.canonical, page.path);
    assert.ok(document.querySelector('main#main-content'), page.path);
    const expectedLanguage = /^\/en(?:\/|$)/.test(page.path) ? 'en' : 'bg';
    assert.equal(document.documentElement.lang, expectedLanguage, page.path);
    const languages = [...document.querySelectorAll('link[hreflang]')].map((link) => link.hreflang);
    assert.equal(new Set(languages).size, languages.length, page.path);
    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) JSON.parse(script.textContent);
    if (page.noIndex || page.canonical !== `https://npmassagestudio.com${page.path}`) {
      assert.equal(sitemap.includes(`<loc>https://npmassagestudio.com${page.path}</loc>`), false, page.path);
    }
    window.close();
  }
  const notFound = new JSDOM(readFileSync(resolve('out/404.html'), 'utf8')).window.document;
  assert.match(notFound.querySelector('meta[name=robots]').content, /noindex/);
});
