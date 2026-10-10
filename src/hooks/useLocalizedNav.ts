import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { hasEnglishEquivalent, isEnglishPath, localizedPath } from '@/lib/localizedPaths';

export function useLocalizedNav() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // The URL is the single source of truth for the language.
  const isEn = isEnglishPath(location.pathname);

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
      return localizedPath(basePath, isEn ? 'en' : 'bg');
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
    const currentPath = location.pathname + location.search + location.hash;
    const newPath = hasEnglishEquivalent(location.pathname)
      ? localizedPath(currentPath, newLang)
      : '/en';
    navigate(newPath);
  }, [isEn, location.pathname, location.search, location.hash, navigate]);

  return { getPath, handleNav, toggleLang, isEn, location };
}
