const fs = require('node:fs');
const path = require('node:path');

const escape = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const absolute = (value, base) => new URL(value, base).href;
const LOGO = 'https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/a44364ff-b9d6-4117-8394-dcd7f0becbd6_compressed_--.webp';

function seoHead(seo, base, lang) {
  const meta = (name, content, property = false) => content ? `<meta ${property ? 'property' : 'name'}="${escape(name)}" content="${escape(content)}">` : '';
  const canonical = seo.canonical ? absolute(seo.canonical, base) : undefined;
  const image = seo.og?.image || LOGO;
  return [
    `<title>${escape(seo.title)}</title>`,
    meta('description', seo.description),
    meta('robots', seo.noIndex ? 'noindex, nofollow' : seo.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'),
    meta('last-modified', seo.lastModified),
    canonical ? `<link rel="canonical" href="${escape(canonical)}">` : '',
    ...(seo.hreflangs || []).map((item) => `<link rel="alternate" hreflang="${escape(item.lang)}" href="${escape(absolute(item.url, base))}">`),
    meta('og:title', seo.og?.title || seo.title, true),
    meta('og:description', seo.og?.description || seo.description, true),
    meta('og:url', seo.og?.url || canonical, true),
    meta('og:type', seo.og?.type || 'website', true),
    meta('og:image', image, true),
    meta('og:locale', seo.og?.locale || (lang === 'en' ? 'en_US' : 'bg_BG'), true),
    meta('og:site_name', 'NP Massage Studio', true),
    ...(seo.og?.localeAlternate || []).map((item) => meta('og:locale:alternate', item, true)),
    meta('twitter:card', seo.twitter?.card || 'summary_large_image'),
    meta('twitter:title', seo.twitter?.title || seo.title),
    meta('twitter:description', seo.twitter?.description || seo.description),
    meta('twitter:image', seo.twitter?.image || image),
    ...Object.entries({ 'geo.placename': seo.geo?.placename, 'geo.region': seo.geo?.region, 'geo.position': seo.geo?.position, ICBM: seo.geo?.icbm }).map(([key, value]) => meta(key, value)),
    ...(seo.schemas || []).map((schema) => `<script type="application/ld+json" data-dynamic-seo="true">${JSON.stringify({ '@context': 'https://schema.org', '@type': schema.type, ...schema.data }).replace(/</g, '\\u003c')}</script>`),
  ].filter(Boolean).join('\n');
}

async function main() {
  const { createServer } = await import('vite');
  const root = path.resolve(__dirname, '..');
  const flag = process.argv.indexOf('--out-dir');
  const out = flag < 0 ? path.join(root, 'out') : path.resolve(process.argv[flag + 1]);
  const template = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  const sitemapPath = path.join(out, 'sitemap.xml');
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const entries = [...sitemap.matchAll(/<url>\s*([\s\S]*?)<\/url>/g)];
  const pageUrls = entries.map((entry) => entry[1].match(/<loc>(.*?)<\/loc>/)[1]);
  const base = new URL(pageUrls[0]).origin;
  // Retain fonts, assets, verification, analytics, favicons and page-independent
  // metadata. Every route gets exactly one set of its own SEO tags.
  const cleanTemplate = template
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\b[^>]*(?:name="(?:description|robots|last-modified|geo\.[^"]*|ICBM|twitter:[^"]*)"|property="og:[^"]*")[^>]*>/gi, '')
    .replace(/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/gi, '')
    .replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
  const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
  const excluded = new Set();
  const results = [];
  try {
    const { renderPage, readPublicPosts } = await server.ssrLoadModule('/scripts/render-pages.tsx');
    const posts = await readPublicPosts();
    for (const url of pageUrls) {
      const pathname = new URL(url).pathname;
      const { html, seo } = await renderPage(pathname, posts);
      if (!seo.canonical || !html.includes('<h1')) throw new Error(`Invalid public page: ${pathname}`);
      const canonical = absolute(seo.canonical, base);
      if (seo.noIndex || canonical !== url) excluded.add(url);
      const lang = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'bg';
      const document = cleanTemplate.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
        .replace('</head>', `${seoHead(seo, base, lang)}\n</head>`)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
      const dir = path.join(out, pathname.replace(/^\//, ''));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), document);
      results.push({ path: pathname, canonical, noIndex: Boolean(seo.noIndex), bytes: Buffer.byteLength(document) });
    }
    const { html, seo } = await renderPage('/404', posts);
    fs.writeFileSync(path.join(out, '404.html'), cleanTemplate.replace('</head>', `${seoHead(seo, base, 'bg')}\n</head>`).replace('<div id="root"></div>', `<div id="root">${html}</div>`));
    fs.writeFileSync(sitemapPath, sitemap.replace(/<url>\s*([\s\S]*?)<\/url>/g, (entry, body) => excluded.has(body.match(/<loc>(.*?)<\/loc>/)[1]) ? '' : entry));
    fs.writeFileSync(path.join(out, 'prerender-manifest.json'), JSON.stringify(results, null, 2));
    console.log(`[SEO] Pre-rendered ${results.length} real routes; removed ${excluded.size} noindex/non-canonical URLs from the build sitemap.`);
  } finally {
    await server.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
