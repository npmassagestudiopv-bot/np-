import { useLayoutEffect, useEffect, useRef } from 'react';

interface SeoSchema {
  type: string;
  data: Record<string, unknown>;
}

interface SeoOptions {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  hreflangs?: Array<{ lang: string; url: string }>;
  og?: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    type?: string;
    locale?: string;
    localeAlternate?: string[];
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: string;
    card?: string;
  };
  schemas?: SeoSchema[];
  robots?: string;
  lastModified?: string;
  noIndex?: boolean;
  geo?: {
    placename?: string;
    region?: string;
    position?: string;
    icbm?: string;
  };
}

const baseUrl = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SITE_URL || 'https://npmassagestudio.com';

export { baseUrl };

function getSeoKey(options: SeoOptions): string {
  return `${options.title || ''}|${options.description || ''}|${(options.schemas || []).length}`;
}

function scheduleIdle(callback: () => void) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 2000 });
  } else {
    setTimeout(callback, 1);
  }
}

export function useSeo(options: SeoOptions) {
  const appliedKey = useRef('');

  useLayoutEffect(() => {
    const key = getSeoKey(options);
    if (appliedKey.current === key) return;
    appliedKey.current = key;

    const {
      title,
      description,
      canonical,
      hreflangs,
      og,
      twitter,
      robots,
      lastModified,
      noIndex,
      geo,
    } = options;

    if (title) {
      document.title = title;
    }

    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    const robotsContent = noIndex ? 'noindex, nofollow' : (robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', robotsContent);

    if (lastModified) {
      let meta = document.querySelector('meta[name="last-modified"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'last-modified');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', lastModified);
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`);
    } else {
      const existingCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (existingCanonical) {
        existingCanonical.remove();
      }
    }

    document.querySelectorAll('link[rel="alternate"]').forEach((el) => {
      if (el.getAttribute('hreflang')) el.remove();
    });
    if (hreflangs && hreflangs.length > 0) {
      hreflangs.forEach((hl) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', hl.lang);
        link.setAttribute('href', hl.url.startsWith('http') ? hl.url : `${baseUrl}${hl.url}`);
        document.head.appendChild(link);
      });
    }

    const ogTags = [
      { property: 'og:title', value: og?.title || title },
      { property: 'og:description', value: og?.description || description },
      { property: 'og:url', value: og?.url || (canonical ? `${baseUrl}${canonical}` : undefined) },
      { property: 'og:image', value: og?.image || 'https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/a44364ff-b9d6-4117-8394-dcd7f0becbd6_compressed_--.webp' },
      { property: 'og:type', value: og?.type || 'website' },
      { property: 'og:locale', value: og?.locale || 'bg_BG' },
      { property: 'og:site_name', value: 'NP Massage Studio' },
      { property: 'og:image:width', value: '512' },
      { property: 'og:image:height', value: '512' },
    ];
    ogTags.forEach((tag) => {
      if (tag.value) {
        let meta = document.querySelector(`meta[property="${tag.property}"]`) as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', tag.property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', tag.value);
      }
    });

    if (og?.localeAlternate && og.localeAlternate.length > 0) {
      og.localeAlternate.forEach((locale) => {
        let meta = document.querySelector(`meta[property="og:locale:alternate"][content="${locale}"]`) as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', 'og:locale:alternate');
          meta.setAttribute('content', locale);
          document.head.appendChild(meta);
        }
      });
    }

    const twitterTags = [
      { name: 'twitter:card', value: twitter?.card || 'summary_large_image' },
      { name: 'twitter:title', value: twitter?.title || title },
      { name: 'twitter:description', value: twitter?.description || description },
      { name: 'twitter:image', value: twitter?.image || og?.image || 'https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/a44364ff-b9d6-4117-8394-dcd7f0becbd6_compressed_--.webp' },
    ];
    twitterTags.forEach((tag) => {
      if (tag.value) {
        let meta = document.querySelector(`meta[name="${tag.name}"]`) as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', tag.name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', tag.value);
      }
    });

    if (geo) {
      const geoMap: Record<string, string> = {
        'geo.placename': geo.placename || '',
        'geo.region': geo.region || '',
        'geo.position': geo.position || '',
        'ICBM': geo.icbm || '',
      };
      Object.entries(geoMap).forEach(([attrName, value]) => {
        if (!value) return;
        let meta = document.querySelector(`meta[name="${attrName}"]`) as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', attrName);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', value);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  // Heavy schema injection — defer to idle time so it does not block paint
  useEffect(() => {
    const { schemas } = options;
    if (!schemas || schemas.length === 0) return;

    let cancelled = false;
    const timer = scheduleIdle(() => {
      if (cancelled) return;

      document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
        if (el.getAttribute('data-dynamic-seo') === 'true') el.remove();
      });

      schemas.forEach((schema) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-dynamic-seo', 'true');
        script.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': schema.type,
          ...schema.data,
        });
        document.head.appendChild(script);
      });
    });

    return () => {
      cancelled = true;
      if (typeof timer === 'number') clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.schemas]);
}