import type { SeoOptions } from './seoContext';

const pageTypes = new Set(['WebPage', 'CollectionPage', 'AboutPage', 'ContactPage', 'ItemPage']);

export function normalizeSeo(options: SeoOptions, baseUrl: string): SeoOptions {
  const canonical = options.canonical ? new URL(options.canonical, baseUrl).href : undefined;
  const isEn = canonical && (/^\/en(?:\/|$)/).test(new URL(canonical).pathname);
  return {
    ...options,
    canonical,
    og: {
      ...options.og,
      url: canonical || options.og?.url,
      locale: options.og?.locale || (isEn ? 'en_US' : 'bg_BG'),
    },
    schemas: options.schemas?.map((schema) => canonical && pageTypes.has(schema.type)
      ? { ...schema, data: { ...schema.data, '@id': canonical, url: canonical } }
      : schema),
  };
}
