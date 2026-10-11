import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useTranslation } from 'react-i18next';
import { useLayoutEffect } from 'react';

const HERO_IMAGE_MOBILE = 'https://readdy.ai/api/search-image?query=Relaxing%20massage%20studio%20interior%20with%20warm%20ambient%20lighting%20candles%20natural%20wood%20elements%20minimalist%20zen%20aesthetic%20soft%20neutral%20tones%20professional%20wellness%20atmosphere%20editorial%20photography&width=800&height=450&seq=booking-hero-mobile-2026&orientation=landscape';
const HERO_IMAGE_DESKTOP = 'https://readdy.ai/api/search-image?query=Relaxing%20massage%20studio%20interior%20with%20warm%20ambient%20lighting%20candles%20natural%20wood%20elements%20minimalist%20zen%20aesthetic%20soft%20neutral%20tones%20professional%20wellness%20atmosphere%20editorial%20photography&width=1600&height=600&seq=booking-hero-2026&orientation=landscape';

export default function BookingHero() {
  const { t } = useTranslation();
  const { isEn } = useLocalizedNav();

  // Preload hero image for faster LCP
  useLayoutEffect(() => {
    const linkId = 'booking-hero-preload';
    if (document.getElementById(linkId)) return;
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'preload';
    link.as = 'image';
    link.href = HERO_IMAGE_DESKTOP;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-foreground-950">
        <img
          src={HERO_IMAGE_DESKTOP}
          srcSet={`${HERO_IMAGE_MOBILE} 800w, ${HERO_IMAGE_DESKTOP} 1600w`}
          sizes="(max-width: 800px) 800px, 1600px"
          alt={isEn ? "Book a massage at NP Massage Studio" : "NP Massage Studio - резервация за масаж"}
          className="w-full h-full object-cover object-center"
          width={1600}
          height={600}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground-950/80 via-foreground-950/60 to-foreground-950/40" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-6 lg:px-10 pt-20 pb-12 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="text-sm text-background-50 font-medium">
              {isEn ? "Online booking requests 24/7" : "Онлайн резервация 24/7"}
            </span>
          </div>

          <h1 className="page-title text-background-50 mb-4">
            {t('bookingTitle') || 'Запази час'}
          </h1>

          <p className="text-base md:text-lg text-background-100/90 leading-relaxed mb-6 max-w-xl">
            {t('bookingSubtitle') || 'Изберете услуга, дата и час. Ще потвърдим резервацията ви по телефон в рамките на 2 часа.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#booking-form" className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-background-50 text-primary-700 text-sm font-semibold rounded-full hover:bg-background-100 transition-colors">
              {isEn ? 'Choose a massage & time' : 'Избери масаж и час'}
            </a>
            <a
              href="tel:+359988926120"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm text-background-50 hover:text-accent-300 transition-colors"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-background-50/10 rounded-full">
                <i className="ri-phone-line text-sm" />
              </div>
              <span>+359 988 926 120</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
