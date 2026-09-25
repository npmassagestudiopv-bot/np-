import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';

const navLinks = [
  { key: 'navHome', path: '/' },
  { key: 'navServices', path: '/uslugi' },
  { key: 'navVouchers', path: '/vaucheri' },
  { key: 'navAbout', path: '/za-nas' },
  { key: 'navLocations', path: '/lokacii' },
  { key: 'navBlog', path: '/blog' },
  { key: 'navContact', path: '/kontakti' },
];

const LOGO_URL = 'https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/a44364ff-b9d6-4117-8394-dcd7f0becbd6_compressed_--.webp';

export default function Navbar() {
  const { t } = useTranslation();
  const { getPath, handleNav, toggleLang, isEn, location } = useLocalizedNav();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    handleNav(path);
  };

  const logoIsInverted = !scrolled && isHome;

  const logoContent = (
    <img
      src={LOGO_URL}
      alt="NP Massage Studio"
      className={`h-11 md:h-12 w-auto object-contain transition-all duration-500 ${
        logoIsInverted ? 'brightness-0 invert' : ''
      }`}
      width="48"
      height="48"
      loading="eager"
      decoding="async"
    />
  );

  return (
    <header>
      {/* ====== DESKTOP + MOBILE NAVBAR BAR ====== */}
      <nav
        data-navbar="main"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background-50 border-b border-background-200 shadow-sm'
            : 'bg-black/30 backdrop-blur-[2px] md:bg-transparent'
        }`}
      >
        <div className="w-full px-5 md:px-6 lg:px-10">
          <div className="flex items-center justify-between h-[68px] md:h-20">
            <a
              href={getPath('/')}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(getPath('/'));
              }}
              className="flex items-center h-full cursor-pointer"
            >
              {isHome ? (
                <h1 className="flex items-center h-full m-0 p-0">
                  {logoContent}
                </h1>
              ) : (
                logoContent
              )}
            </a>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const path = getPath(link.path);
                const isActive = location.pathname === path;
                return (
                  <a
                    key={link.key}
                    href={path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(path);
                    }}
                    className={`relative text-sm font-medium whitespace-nowrap cursor-pointer transition-colors duration-300 hover:text-primary-600 ${
                      isActive ? 'text-primary-600' : 'text-foreground-700'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {t(link.key)}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Desktop right side */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleLang}
                className="flex items-center gap-1 text-sm font-medium text-foreground-700 hover:text-primary-600 transition-colors duration-300 cursor-pointer"
                aria-label={isEn ? 'Switch to Bulgarian' : 'Switch to English'}
              >
                <span className={isEn ? 'text-foreground-400' : 'text-primary-600 font-semibold'}>
                  {t('langBg')}
                </span>
                <span className="text-foreground-300">|</span>
                <span className={isEn ? 'text-primary-600 font-semibold' : 'text-foreground-400'}>
                  {t('langEn')}
                </span>
              </button>
              <a
                href={getPath('/rezervaciya')}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(getPath('/rezervaciya'));
                }}
                className="px-6 py-3 bg-primary-500 text-background-50 text-sm font-semibold rounded-full hover:bg-primary-600 active:scale-[0.97] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium"
              >
                {t('navBook')}
              </a>
            </div>

            {/* Hamburger — mobile only, hidden on lg+ */}
            <button
              className={`lg:hidden w-[42px] h-[42px] flex items-center justify-center cursor-pointer rounded-full transition-all duration-300 ${
                scrolled
                  ? 'text-foreground-800 bg-background-200/80 hover:bg-background-300'
                  : 'text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm'
              }`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <i className="ri-menu-line text-xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* ====== MOBILE SLIDE-IN MENU ====== */}
      <div
        className={`fixed inset-0 z-[9999] lg:hidden ${
          mobileOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-400 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Slide panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[min(320px,85vw)] bg-background-50 transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-background-200">
            <span className="text-sm font-semibold tracking-wide uppercase text-foreground-800">
              {t('navMenu')}
            </span>
            <button
              className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full bg-background-200 hover:bg-background-300 transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <i className="ri-close-line text-xl text-foreground-800" />
            </button>
          </div>

          {/* Links */}
          <div className="px-4 py-5 flex flex-col">
            {navLinks.map((link) => {
              const path = getPath(link.path);
              const isActive = location.pathname === path;
              return (
                <a
                  key={link.key}
                  href={path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(path);
                  }}
                  className={`text-base font-medium py-3.5 px-4 rounded-xl cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-foreground-800 hover:text-primary-600 hover:bg-background-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t(link.key)}
                </a>
              );
            })}
          </div>

          {/* Divider + lang + CTA */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pt-4 pb-6 border-t border-background-200 bg-background-50">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={toggleLang}
                className="flex items-center gap-2 text-sm font-medium text-foreground-800 cursor-pointer py-2 px-3 rounded-lg hover:bg-background-100 transition-colors"
                aria-label={isEn ? 'Switch to Bulgarian' : 'Switch to English'}
              >
                <span className={isEn ? 'text-foreground-400' : 'text-primary-600 font-semibold'}>
                  {t('langBg')}
                </span>
                <span className="text-foreground-300">|</span>
                <span className={isEn ? 'text-primary-600 font-semibold' : 'text-foreground-400'}>
                  {t('langEn')}
                </span>
              </button>
            </div>
            <a
              href={getPath('/rezervaciya')}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(getPath('/rezervaciya'));
              }}
              className="block text-center px-6 py-3.5 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              {t('navBook')}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}