import { useTranslation } from 'react-i18next';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';

export default function Footer() {
  const { t } = useTranslation();
  const { getPath, handleNav } = useLocalizedNav();

  const serviceLinks = [
    { key: 'serviceClassical', path: '/uslugi/klasicheski-masazh' },
    { key: 'serviceSport', path: '/uslugi/sporten-masazh' },
    { key: 'serviceAnticellulite', path: '/uslugi/anticeluliten-masazh' },
    { key: 'serviceAromatherapy', path: '/uslugi/aromaterapiya' },
    { key: 'serviceBack', path: '/uslugi/masazh-na-grab' },
  ];

  const navLinks = [
    { key: 'navHome', path: '/' },
    { key: 'navServices', path: '/uslugi' },
    { key: 'navAbout', path: '/za-nas' },
    { key: 'navLocations', path: '/lokacii' },
    { key: 'navBlog', path: '/blog' },
    { key: 'navContact', path: '/kontakti' },
  ];

  return (
    <footer className="bg-foreground-900 text-background-200" role="contentinfo">
      <div className="w-full px-4 md:px-6 lg:px-10 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 md:mb-8">
          <a
            href={getPath('/')}
            onClick={(e) => {
              e.preventDefault();
              handleNav(getPath('/'));
            }}
            className="flex items-center cursor-pointer"
          >
            <img
              src="https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/a44364ff-b9d6-4117-8394-dcd7f0becbd6_compressed_--.webp"
              alt="NP Massage Studio"
              className="h-7 md:h-9 w-auto object-contain brightness-200"
              width="36"
              height="36"
              loading="lazy"
              decoding="async"
            />
          </a>
          <p className="text-sm text-background-200 max-w-md leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 pb-6 md:pb-8 border-b border-foreground-700">
          <div>
            <h4 className="text-sm font-semibold text-background-50 uppercase tracking-wider mb-2">
              {t('footerNav')}
            </h4>
            <ul className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={getPath(link.path)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(getPath(link.path));
                    }}
                    className="text-sm text-background-200 hover:text-background-50 transition-colors duration-300 cursor-pointer inline-block"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-background-50 uppercase tracking-wider mb-2">
              {t('footerServices')}
            </h4>
            <ul className="flex flex-col gap-1.5">
              {serviceLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={getPath(link.path)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(getPath(link.path));
                    }}
                    className="text-sm text-background-200 hover:text-background-50 transition-colors duration-300 cursor-pointer inline-block"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-background-50 uppercase tracking-wider mb-2">
              {t('footerContact')}
            </h4>
            <ul className="flex flex-col gap-1.5">
              <li>
                <a
                  href="tel:+359988926120"
                  className="text-sm text-background-200 hover:text-background-50 transition-colors duration-300 cursor-pointer inline-flex items-center gap-2"
                >
                  <i className="ri-phone-line text-xs" />
                  +359 988 926 120
                </a>
              </li>
              <li>
                <a
                  href="mailto:npmassagestudiopv@gmail.com"
                  className="text-sm text-background-200 hover:text-background-50 transition-colors duration-300 cursor-pointer inline-flex items-center gap-2"
                >
                  <i className="ri-mail-line text-xs" />
                  npmassagestudiopv@gmail.com
                </a>
              </li>
              <li className="text-sm text-background-200 flex items-start gap-2">
                <i className="ri-map-pin-line text-xs mt-0.5" />
                <span>{t('footerVelikoTarnovo')}: {t('locationVtAddress')}</span>
              </li>
              <li className="text-sm text-background-200 flex items-start gap-2">
                <i className="ri-map-pin-line text-xs mt-0.5" />
                <span>{t('footerPavlikeni')}: {t('locationPvAddress')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-background-50 uppercase tracking-wider mb-2">
              {t('footerFollow')}
            </h4>
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/profile.php?id=61569758628011"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground-800 text-background-400 hover:text-background-50 hover:bg-foreground-700 transition-all duration-300 cursor-pointer"
                aria-label="Facebook"
              >
                <i className="ri-facebook-fill text-sm" />
              </a>
              <a
                href="https://www.instagram.com/np_massage_studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground-800 text-background-400 hover:text-background-50 hover:bg-foreground-700 transition-all duration-300 cursor-pointer"
                aria-label="Instagram"
              >
                <i className="ri-instagram-fill text-sm" />
              </a>
              <a
                href="https://www.tiktok.com/@npmassagestudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground-800 text-background-400 hover:text-background-50 hover:bg-foreground-700 transition-all duration-300 cursor-pointer"
                aria-label="TikTok"
              >
                <i className="ri-tiktok-fill text-sm" />
              </a>
              <a
                href="https://www.google.com/maps/place/NP+Massage+Studio+%7C+%D0%9C%D0%B0%D1%81%D0%B0%D0%B6%D0%BD%D0%BE+%D1%81%D1%82%D1%83%D0%B4%D0%B8%D0%BE+%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE+%D0%A2%D1%8A%D1%80%D0%BD%D0%BE%D0%B2%D0%BE/@43.080935,25.6127656,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground-800 text-background-400 hover:text-background-50 hover:bg-foreground-700 transition-all duration-300 cursor-pointer"
                aria-label={t('footerGoogleMaps')}
              >
                <i className="ri-google-fill text-sm" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-background-50 uppercase tracking-wider mb-2">
              {t('footerHours')}
            </h4>
            <ul className="flex flex-col gap-1.5">
              <li className="text-sm text-background-200 flex items-center gap-2">
                <i className="ri-time-line text-xs flex-shrink-0" />
                {t('footerMonFri')}
              </li>
              <li className="text-sm text-background-200 flex items-center gap-2">
                <i className="ri-time-line text-xs flex-shrink-0" />
                {t('footerSat')}
              </li>
              <li className="text-sm text-background-200 flex items-center gap-2">
                <i className="ri-time-line text-xs flex-shrink-0" />
                {t('footerSun')}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-center">
          <div className="flex items-center gap-3 text-sm text-background-200">
            <span className="font-medium text-background-100">NP Massage Studio</span>
            <span>|</span>
            <span>{t('footerRights')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-background-200">
            <a href="/politika-poveritelnost" onClick={(e) => { e.preventDefault(); handleNav('/politika-poveritelnost'); }} className="hover:text-background-50 transition-colors duration-300 cursor-pointer">
              {t('footerPrivacy')}
            </a>
            <a href="/obshti-usloviya" onClick={(e) => { e.preventDefault(); handleNav('/obshti-usloviya'); }} className="hover:text-background-50 transition-colors duration-300 cursor-pointer">
              {t('footerTerms')}
            </a>
            <a href="/politika-biskvitki" onClick={(e) => { e.preventDefault(); handleNav('/politika-biskvitki'); }} className="hover:text-background-50 transition-colors duration-300 cursor-pointer">
              {t('footerCookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}