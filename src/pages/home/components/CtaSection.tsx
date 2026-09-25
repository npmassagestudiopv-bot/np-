import { useTranslation } from 'react-i18next';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function CtaSection() {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="py-16 md:py-24 bg-background-100">
      <div className="w-full px-4 md:px-6 lg:px-10">
        <div
          ref={ref}
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="relative rounded-3xl overflow-hidden mb-8 md:mb-10">
            <img
              src="https://storage.readdy-site.link/project_files/ac01bae9-5287-435a-8690-39522f5115fa/855eca03-8242-41e5-b14f-effa409cade3_-.webp?v=ded22a5fca673de0a426e7d6e56844dd"
              alt="NP Massage Studio - студио"
              className="w-full h-48 md:h-64 lg:h-80 object-cover object-top"
              width="800"
              height="500"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-100/80 via-transparent to-transparent" />
          </div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-sm md:text-base text-foreground-600 mb-8 max-w-lg mx-auto leading-relaxed">
            {t('ctaSubtitle')}
          </p>

          <div className="flex flex-col items-center gap-4">
            <a
              href="/rezervaciya"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/rezervaciya');
              }}
              className="inline-flex items-center justify-center px-10 py-4 bg-primary-500 text-background-50 font-medium text-sm rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium shadow-sm min-h-[48px]"
            >
              {t('ctaButton')}
            </a>
            <div className="flex items-center gap-2 text-sm text-foreground-600">
              <span>{t('ctaPhone')}</span>
              <a
                href="tel:+359988926120"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer"
              >
                +359 988 926 120
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}