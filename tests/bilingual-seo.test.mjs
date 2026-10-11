import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const manifest = JSON.parse(readFileSync(resolve('out/prerender-manifest.json'), 'utf8'));
const pages = new Map(manifest.map((page) => {
  const window = new JSDOM(readFileSync(resolve('out', page.path.slice(1), 'index.html'), 'utf8')).window;
  return [page.path, { ...page, window, document: window.document }];
}));
const isEnglish = (path) => /^\/en(?:\/|$)/.test(path);

test('BG and EN alternates are reciprocal, indexable and canonical', () => {
  for (const page of pages.values()) {
    const links = [...page.document.querySelectorAll('link[hreflang]')];
    if (page.noIndex || new URL(page.canonical).pathname !== page.path) {
      assert.equal(links.length, 0, `${page.path}: non-canonical URLs must not advertise language alternates`);
      continue;
    }
    const expectedLanguage = isEnglish(page.path) ? 'en' : 'bg';
    assert.equal(links.find((link) => link.hreflang === expectedLanguage)?.href, page.canonical, page.path);
    for (const link of links) {
      const target = pages.get(new URL(link.href).pathname);
      assert.ok(target, `${page.path}: missing alternate ${link.href}`);
      assert.equal(target.noIndex, false, link.href);
      assert.equal(target.canonical, link.href, link.href);
      if (link.hreflang !== 'x-default') {
        assert.ok([...target.document.querySelectorAll('link[hreflang]')].some((back) => back.href === page.canonical), `${page.path}: missing reciprocal alternate`);
      }
    }
  }
});

test('every English public page has English content, accessible labels and metadata', () => {
  const paths = ['/en', '/en/services', '/en/about', '/en/locations', '/en/blog', '/en/contact', '/en/booking', '/en/vouchers', '/en/about-np-massage-studio', '/en/privacy', '/en/terms', '/en/cookies', '/en/videos-masazhi'];
  for (const path of paths) assert.ok(pages.has(path), `missing core page ${path}`);
  for (const page of pages.values()) {
    if (!isEnglish(page.path)) continue;
    const d = page.document;
    for (const text of [d.title, d.querySelector('h1')?.textContent, d.querySelector('meta[name=description]')?.content]) {
      assert.ok(text?.trim(), page.path);
      assert.doesNotMatch(text, /[А-Яа-я]/u, `${page.path}: Bulgarian metadata or heading`);
    }
    assert.equal(d.documentElement.lang, 'en', page.path);
    assert.equal(d.querySelector('meta[property="og:locale"]')?.content, 'en_US', page.path);
    assert.equal(d.querySelector('meta[property="og:url"]')?.content, page.canonical, page.path);
    const walker = d.createTreeWalker(d.body, 4);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement.closest('script,style')) assert.doesNotMatch(node.textContent, /[А-Яа-я]/u, `${page.path}: untranslated visible copy`);
    }
    for (const element of d.querySelectorAll('[alt],[title],[aria-label],[placeholder]')) {
      for (const attribute of ['alt', 'title', 'aria-label', 'placeholder']) assert.doesNotMatch(element.getAttribute(attribute) || '', /[А-Яа-я]/u, `${page.path}: untranslated ${attribute}`);
    }
    for (const link of d.querySelectorAll('a[href^="/"]')) {
      const path = new URL(link.getAttribute("href"), page.canonical).pathname;
      const target = pages.get(path);
      if (target?.document.querySelector('link[hreflang="en"]')) assert.ok(isEnglish(path), `${page.path}: link switches language to ${path}`);
    }
  }
});

test('English page schemas describe English content and use real service URLs', () => {
  for (const page of pages.values()) {
    if (!isEnglish(page.path)) continue;
    for (const script of page.document.querySelectorAll('script[type="application/ld+json"]')) {
      const schema = JSON.parse(script.textContent);
      if (['WebPage', 'AboutPage', 'CollectionPage', 'ContactPage'].includes(schema['@type'])) {
        assert.equal(schema.url, page.canonical, page.path);
        assert.equal(schema.inLanguage, 'en', page.path);
        assert.doesNotMatch(`${schema.name} ${schema.description}`, /[А-Яа-я]/u, page.path);
      }
      if (['FAQPage', 'HowTo', 'BreadcrumbList', 'OfferCatalog', 'SiteNavigationElement'].includes(schema['@type'])) {
        assert.doesNotMatch(JSON.stringify(schema), /[А-Яа-я]/u, `${page.path}: Bulgarian ${schema['@type']}`);
      }
      if (schema['@type'] === 'Blog' || schema['@type'] === 'BlogPosting') {
        assert.equal(schema.inLanguage, 'en', page.path);
        for (const article of schema.blogPost || [schema]) assert.ok(isEnglish(new URL(article.mainEntityOfPage['@id']).pathname), page.path);
      }
      if (schema['@type'] === 'Product') {
        const path = new URL(schema.offers.url).pathname;
        assert.ok(isEnglish(path), `${page.path}: offer link is Bulgarian`);
        assert.ok(pages.has(path), `${page.path}: broken offer link ${path}`);
        assert.doesNotMatch(`${schema.name} ${schema.description}`, /[А-Яа-я]/u, page.path);
      }
    }
  }
});

test('Local studio price comparisons publish real services, matching prices and working destinations', () => {
  const expected = [
    ['klasicheski-masazh', '60 мин', '25 €'],
    ['sporten-masazh', '60 мин', '25 €'],
    ['anticeluliten-masazh', '40 мин', '20 €'],
    ['aromaterapiya', '60 мин', '30 €'],
    ['masazh-na-grab', '40 мин', '15 €'],
  ];
  for (const path of ['/masazhi-veliko-tarnovo', '/masazhi-pavlikeni']) {
    const d = pages.get(path).document;
    const table = d.querySelector('table');
    assert.ok(table, path);
    const rows = [...table.querySelectorAll('tbody tr')];
    assert.equal(rows.length, expected.length, path);
    rows.forEach((row, index) => {
      const [slug, duration, price] = expected[index];
      const link = row.querySelector('a');
      const target = `/uslugi/${slug}`;
      assert.equal(link.getAttribute('href'), target, path);
      assert.ok(pages.has(target), target);
      assert.ok(link.textContent.trim(), path);
      assert.deepEqual([...row.querySelectorAll('td')].map(cell => cell.textContent.trim()), [duration, price], path);
    });
  }
  const catalog = [...pages.get('/masazhi-veliko-tarnovo').document.querySelectorAll('script[type="application/ld+json"]')]
    .map(script => JSON.parse(script.textContent)).find(schema => schema['@type'] === 'OfferCatalog');
  assert.ok(catalog);
  assert.deepEqual(catalog.itemListElement.map(entry => entry.item.price + ' €'), expected.map(row => row[2]));
});
