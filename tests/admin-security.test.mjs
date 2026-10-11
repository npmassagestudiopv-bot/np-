import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';

let server, root, page, dom, readsFail = false, mutationFail = false;
let mutations = 0;
const element = React.createElement;
const day = new Date().toISOString().slice(0, 10);
const record = { id: 'appt-1', name: 'Тестов клиент', email: 'test@example.invalid', phone: '0000', service: 'classical', location: 'vt', appointment_date: day, appointment_time: '10:00', status: 'pending' };

before(async () => {
  dom = new JSDOM('<html><body><div id="root"></div></body></html>', { url: 'https://example.test/admin/appointments' });
  for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Event', 'MouseEvent']) Object.defineProperty(globalThis, key, { configurable: true, value: dom.window[key], writable: true });
  window.scrollTo = () => {};
  globalThis.confirm = () => true;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.__ADMIN_TEST_DB__ = {
    from(table) {
      let fields, mutation = false;
      const query = {
        select(value) { fields = value; return query; },
        update() { mutation = true; mutations++; return query; },
        delete() { mutation = true; mutations++; return query; },
        single() { return query; },
        eq() { return query; }, neq() { return query; }, gte() { return query; }, lte() { return query; }, order() { return query; },
        then(resolve, reject) {
          if (mutation) return Promise.resolve({ data: mutationFail ? null : { id: record.id }, error: mutationFail ? { message: 'Permission denied', code: '42501' } : null }).then(resolve, reject);
          if (readsFail) return Promise.resolve({ data: null, error: { message: 'Network failure' } }).then(resolve, reject);
          const data = table === 'blocked_dates' ? [] : fields === 'appointment_time' ? [{ appointment_time: '10:00:00' }] : [record];
          return Promise.resolve({ data, error: null }).then(resolve, reject);
        },
      };
      return query;
    },
  };
  server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', plugins: [{
    name: 'mock-admin-without-network', enforce: 'pre',
    resolveId(id) {
      if (id.endsWith('/lib/supabase') || id.endsWith('/lib/supabase.ts')) return '\0admin-test-db';
      if (id.endsWith('/admin/components/AdminLayout') || id.endsWith('/admin/components/AdminLayout.tsx')) return '\0admin-test-layout';
    },
    load(id) {
      if (id === '\0admin-test-db') return 'export const supabase = globalThis.__ADMIN_TEST_DB__;';
      if (id === '\0admin-test-layout') return 'export default function AdminLayout({ children }) { return children; }';
    },
  }] });
  ({ default: page } = await server.ssrLoadModule('/src/pages/admin/appointments/page.tsx'));
  const { createRoot } = await import('react-dom/client');
  root = createRoot(document.getElementById('root'));
});
after(async () => { await act(async () => root?.unmount()); await server?.close(); dom?.window.close(); });
const button = (text) => [...document.querySelectorAll('button')].find((item) => item.textContent.trim() === text);
async function mount(key) { await act(async () => root.render(element(page, { key }))); }
async function click(control) { assert.ok(control); await act(async () => control.dispatchEvent(new MouseEvent('click', { bubbles: true }))); }

test('Admin does not show a successful status change after a rejected DB operation', async () => {
  readsFail = false; mutationFail = true; mutations = 0;
  await mount('failed-update');
  await click(button('Потвърди'));
  assert.equal(mutations, 1);
  assert.ok(document.body.textContent.includes('Грешка при обновяване.'));
  assert.ok(button('Потвърди'), 'the appointment remains pending');
});

test('Admin reports failed reads and never offers unchecked booking slots', async () => {
  readsFail = true; mutationFail = false;
  await mount('failed-read');
  assert.ok(document.body.textContent.includes('Грешка при зареждане'));
  const newButton = button('Запази час');
  await click(newButton);
  assert.ok(document.body.textContent.includes('Свободните часове не могат да се проверят.'));
  assert.equal(button('09:00')?.disabled, true);
  assert.equal(document.querySelector('button[type="submit"]')?.disabled, true);
});

test('Admin accepts checked availability and normalizes DB time values', async () => {
  readsFail = false;
  await mount('valid-read');
  await click(button('Запази час'));
  assert.equal(button('10:00')?.disabled, true);
  assert.equal(button('09:00')?.disabled, false);
});
