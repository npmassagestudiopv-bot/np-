export const languagePaths: Record<string, string> = {
  '/': '/en',
  '/uslugi': '/en/services',
  '/za-nas': '/en/about',
  '/lokacii': '/en/locations',
  '/blog': '/en/blog',
  '/kontakti': '/en/contact',
  '/rezervaciya': '/en/booking',
  '/vaucheri': '/en/vouchers',
  '/za-np-massage-studio': '/en/about-np-massage-studio',
  '/politika-poveritelnost': '/en/privacy',
  '/obshti-usloviya': '/en/terms',
  '/politika-biskvitki': '/en/cookies',
  '/videos-masazhi': '/en/videos-masazhi',
};

export function isEnglishPath(path: string) {
  return path === '/en' || path.startsWith('/en/');
}

// Preserve query strings and anchors, including a preselected booking service.
export function localizedPath(path: string, language: 'bg' | 'en'): string {
  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex < 0 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? '' : path.slice(suffixIndex);
  for (const [bg, en] of Object.entries(languagePaths)) {
    const target = language === 'en' ? en : bg;
    if (pathname === bg || pathname === en) return target + suffix;
    if (bg === '/uslugi' || bg === '/blog') {
      for (const prefix of [bg, en]) {
        if (pathname.startsWith(`${prefix}/`)) {
          return target + pathname.slice(prefix.length) + suffix;
        }
      }
    }
  }
  // Bulgarian local landing pages have no English equivalent. Keep valid URLs.
  return path;
}

export function hasEnglishEquivalent(path: string) {
  return isEnglishPath(path) || localizedPath(path, 'en') !== path;
}
