import { useLayoutEffect, useContext, useRef } from 'react';
import { SeoRenderContext, type SeoOptions } from '@/lib/seoContext';
import { normalizeSeo } from '@/lib/seoMetadata';
export type { SeoOptions, SeoSchema } from '@/lib/seoContext';

const baseUrl = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SITE_URL || 'https://npmassagestudio.com';

export { baseUrl };

export function useSeo(input: SeoOptions) {
  const options = normalizeSeo(input, baseUrl);
  const appliedKey = useRef('');
  const collect = useContext(SeoRenderContext);
  collect?.(options);

  useLayoutEffect(() => {
    const key = JSON.stringify(options);
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

    if (!lastModified) document.querySelector('meta[name="last-modified"]')?.remove();
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
      link.setAttribute('href', canonical.startsWith('http') ? canonical : new URL(canonical, baseUrl).href);
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
      { property: 'og:url', value: og?.url || (canonical ? new URL(canonical, baseUrl).href : undefined) },
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
      } else {
        document.querySelector(`meta[property="${tag.property}"]`)?.remove();
      }
    });

    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((el) => el.remove());
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

    document.querySelectorAll('meta[name^="geo."], meta[name="ICBM"]').forEach((el) => el.remove());
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
    // Replace page schemas even when the next page has none. This also removes
    // the pre-rendered schemas so initial HTML and client navigation agree.
    document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());
    for (const schema of options.schemas || []) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.dynamicSeo = 'true';
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': schema.type, ...schema.data });
      document.head.appendChild(script);
    }
  }, [options]);
}
