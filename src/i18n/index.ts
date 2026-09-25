import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './local';

// Language is determined by the URL path, never by localStorage / navigator.
// Bulgarian pages (no /en prefix) must always render in Bulgarian, English
// pages (under /en) always in English.
function getInitialLanguage(): string {
  if (typeof window === 'undefined') return 'bg';
  const base = (typeof __BASE_PATH__ !== 'undefined' ? String(__BASE_PATH__) : '/').replace(/\/+$/, '') || '';
  const path = base
    ? (window.location.pathname.replace(base, '') || '/')
    : window.location.pathname;
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'bg';
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'bg',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;