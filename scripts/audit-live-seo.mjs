import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const canonicalOrigin = 'https://npmassagestudio.com';
const missingPath = '/__seo_audit_missing_page__';
const agents = {
  browser: 'Mozilla/5.0 NP-Massage-SEO-Audit/1.0',
  googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
};

function sitemapPages() {
  const dom = new JSDOM(readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8'), { contentType: 'application/xml' });
  try {
    return new Map([...dom.window.document.getElementsByTagName('url')].map((entry) => {
      const canonical = entry.getElementsByTagName('loc')[0].textContent.trim();
      const alternates = [...entry.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')]
        .map((link) => ({ lang: link.getAttribute('hreflang'), href: link.getAttribute('href') }));
      return [new URL(canonical).pathname, { canonical, alternates }];
    }));
  } finally {
    dom.window.close();
  }
}

function options(args, pages) {
  let baseUrl = canonicalOrigin;
  let paths = ['/', '/en', '/uslugi', '/en/services', '/masazhi-veliko-tarnovo', '/uslugi/klasicheski-masazh', '/en/services/klasicheski-masazh'];
  const firstArticle = [...pages.keys()].find((path) => path.startsWith('/blog/'));
  if (firstArticle && pages.has(`/en${firstArticle}`)) paths.push(firstArticle, `/en${firstArticle}`);
  let json = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base-url' && args[i + 1]) baseUrl = args[++i];
    else if (args[i] === '--paths' && args[i + 1]) paths = args[++i].split(',');
    else if (args[i] === '--json') json = true;
    else throw new Error(`Unknown argument: ${args[i]}`);
  }
  const url = new URL(baseUrl);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('--base-url must be a plain HTTP(S) origin without credentials.');
  }
  paths = [...new Set(paths)];
  if (!paths.length || paths.some((path) => !pages.has(path))) throw new Error('--paths must contain existing paths from public/sitemap.xml.');
  return { baseUrl: url.origin, paths: [...paths, missingPath], json };
}

async function checkPage(baseUrl, path, agent, expected) {
  const result = { path, agent, status: null, title: '', lang: '', robots: '', canonical: [], errors: [] };
  let dom;
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': agents[agent], 'Cache-Control': 'no-cache' },
    });
    result.status = response.status;
    dom = new JSDOM(await response.text()); // No scripts or page resources are executed.
    const document = dom.window.document;
    result.title = document.title.trim();
    result.lang = document.documentElement.lang;
    result.robots = [...document.querySelectorAll('meta[name="robots"]')].map((meta) => meta.content)
      .concat(response.headers.get('x-robots-tag') || '').filter(Boolean).join('; ');
    result.canonical = [...document.querySelectorAll('link[rel="canonical"]')].map((link) => link.getAttribute('href'));
    const noIndex = /\b(?:noindex|none)\b/i.test(result.robots);
    if (path === missingPath) {
      if (response.status !== 404) result.errors.push(`Unknown URL returns HTTP ${response.status}, expected 404.`);
      if (!noIndex) result.errors.push('Unknown URL is missing noindex.');
    } else {
      if (response.status !== 200) result.errors.push(`HTTP ${response.status}, expected 200.`);
      if (noIndex) result.errors.push('A public, indexable page returns noindex.');
      const language = /^\/en(?:\/|$)/.test(path) ? 'en' : 'bg';
      if (result.lang.split('-')[0].toLowerCase() !== language) result.errors.push(`HTML language is ${result.lang || '(missing)'}, expected ${language}.`);
      const headings = [...document.querySelectorAll('h1')];
      if (headings.length !== 1 || !headings[0].textContent.trim()) result.errors.push('Expected exactly one non-empty H1 in the initial HTML.');
      if (headings.some((heading) => /^404(?:\b|\s)/.test(heading.textContent.trim()))) result.errors.push('The page contains the 404 heading.');
      if (!document.querySelector('main')) result.errors.push('The initial HTML has no main content.');
      if (result.canonical.length !== 1 || result.canonical[0] !== expected.canonical) result.errors.push(`Expected one canonical: ${expected.canonical}`);
      const alternates = [...document.querySelectorAll('link[rel="alternate"][hreflang]')];
      for (const alternate of expected.alternates) {
        const matches = alternates.filter((link) => link.getAttribute('hreflang') === alternate.lang);
        if (matches.length !== 1 || matches[0].getAttribute('href') !== alternate.href) result.errors.push(`Wrong or missing ${alternate.lang} hreflang: ${alternate.href}`);
      }
    }
  } catch (error) {
    result.errors.push(`GET failed: ${error.message}`);
  } finally {
    dom?.window.close();
  }
  return result;
}

async function main() {
  const pages = sitemapPages();
  const config = options(process.argv.slice(2), pages);
  const jobs = config.paths.flatMap((path) => Object.keys(agents).map((agent) => ({ path, agent })));
  const results = Array(jobs.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, jobs.length) }, async () => {
    while (next < jobs.length) {
      const index = next++;
      const { path, agent } = jobs[index];
      results[index] = await checkPage(config.baseUrl, path, agent, pages.get(path));
    }
  }));
  const failures = results.filter((result) => result.errors.length);
  const report = { checkedAt: new Date().toISOString(), baseUrl: config.baseUrl, passed: results.length - failures.length, failed: failures.length, results };
  if (config.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Read-only SEO audit: ${config.baseUrl}`);
    console.log('Browser and Googlebot User-Agent; GET only, no JavaScript, forms or database writes.');
    for (const result of results) {
      console.log(`${result.errors.length ? 'FAIL' : 'PASS'} [${result.agent}] ${result.path} — HTTP ${result.status ?? 'error'} — ${result.title}`);
      for (const error of result.errors) console.log(`  ${error}`);
    }
    console.log(`${report.passed} passed; ${report.failed} failed.`);
  }
  process.exitCode = failures.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
