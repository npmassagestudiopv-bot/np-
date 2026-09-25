import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const enPathMap: Record<string, string> = {
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
};

const bgPathMap: Record<string, string> = {
  '/en': '/',
  '/en/services': '/uslugi',
  '/en/about': '/za-nas',
  '/en/locations': '/lokacii',
  '/en/blog': '/blog',
  '/en/contact': '/kontakti',
  '/en/booking': '/rezervaciya',
  '/en/vouchers': '/vaucheri',
  '/en/about-np-massage-studio': '/za-np-massage-studio',
  '/en/privacy': '/politika-poveritelnost',
  '/en/terms': '/obshti-usloviya',
  '/en/cookies': '/politika-biskvitki',
};

export function useLocalizedNav() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // The URL is the single source of truth for the language.
  const isEn = location.pathname === '/en' || location.pathname.startsWith('/en/');

  // Keep i18n and <html lang> in sync with the URL on every navigation.
  useEffect(() => {
    const targetLang = isEn ? 'en' : 'bg';
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
    if (typeof document !== 'undefined' && document.documentElement.lang !== targetLang) {
      document.documentElement.lang = targetLang;
    }
  }, [isEn, i18n]);

  const getPath = useCallback(
    (basePath: string) => {
      if (isEn) {
        return enPathMap[basePath] || `/en${basePath === '/' ? '' : basePath}`;
      }
      return basePath;
    },
    [isEn]
  );

  const handleNav = useCallback(
    (path: string) => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate]
  );

  const toggleLang = useCallback(() => {
    const newLang = isEn ? 'bg' : 'en';
    const currentPath = location.pathname;
    let newPath = currentPath;
    if (isEn && bgPathMap[currentPath]) {
      newPath = bgPathMap[currentPath];
    } else if (!isEn && enPathMap[currentPath]) {
      newPath = enPathMap[currentPath];
    }
    i18n.changeLanguage(newLang);
    navigate(newPath);
  }, [isEn, location.pathname, i18n, navigate]);

  return { getPath, handleNav, toggleLang, isEn, location };
}