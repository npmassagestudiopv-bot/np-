import { useTranslation } from 'react-i18next';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';

export default function HeroSection() {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();

  return (
    <section className="hero-section relative min-h-[420px] sm:min-h-[520px] md:min-h-[600px] lg:min-h-[720px] flex items-start sm:items-center justify-center overflow-hidden">
      <div className="hero-bg absolute inset-0 bg-foreground-950">
        <img
          src="https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/2edf90d3-c2ae-4788-bc2f-512c8dbbffb0_compressed_---.webp"
          alt="NP Massage Studio — уютен масажен салон Велико Търново, ароматни свещи и премиум хавлии"
          title="NP Massage Studio — уютен салон за масажи във Велико Търново и Павликени"
          className="w-full h-full object-cover object-top"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          width="1200"
          height="800"
        />
        <div className="hero-overlay absolute inset-0 bg-primary-500/60" />
        <div className="hero-overlay-dark absolute inset-0 bg-black/25" />
      </div>

      <div className="hero-content relative z-10 w-full px-4 md:px-6 lg:px-10 pt-24 sm:pt-20 md:pt-24 pb-12 md:pb-20 flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <h1 className="font-heading text-xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-background-50 leading-[1.15] mb-3 md:mb-6 text-shadow-hero">
            {t('heroTitle1')}
            <br />
            {t('heroTitle2')}
            <br />
            <span className="text-accent-300">{t('heroTitle3')}</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-background-100/95 max-w-xl mx-auto mb-5 md:mb-8 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/rezervaciya"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/rezervaciya');
              }}
              className="hero-cta inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 bg-background-50 text-primary-700 font-medium text-sm rounded-full hover:bg-background-100 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium min-h-[48px]"
            >
              {t('heroCta')}
            </a>
            <a
              href="/uslugi"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/uslugi');
              }}
              className="hero-cta-outline inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-background-50/60 text-background-50 font-medium text-sm rounded-full hover:bg-background-50/15 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
            >
              {t('heroServices')}
            </a>
          </div>
          <div className="mt-4 sm:hidden">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background-50/20 backdrop-blur-sm rounded-full text-background-50 text-xs font-medium border border-background-50/25">
              <i className="ri-price-tag-3-line" />
              Цени от 15 €
            </span>
          </div>
        </div>

        <div className="hidden md:block mt-8 md:mt-0 md:absolute md:bottom-6 md:left-4 md:right-4 lg:left-10 lg:right-10">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-background-200/90">
            <div className="flex items-center gap-2">
              <i className="ri-map-pin-line" />
              <span>Търново (В. Търново) & Павликени</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-background-200/40" />
            <div className="flex items-center gap-2">
              <i className="ri-phone-line" />
              <a href="tel:+359988926120" className="hover:text-background-50 transition-colors duration-300 cursor-pointer">
                +359 988 926 120
              </a>
            </div>
            <div className="hidden sm:block w-px h-4 bg-background-200/40" />
            <div className="flex items-center gap-2">
              <i className="ri-time-line" />
              <span>Пн–Пт 09–19ч &middot; Сб 09–17ч &middot; Нд 10–16ч</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}