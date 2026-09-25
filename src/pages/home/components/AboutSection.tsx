import { useTranslation } from 'react-i18next';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function AboutSection() {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="py-16 md:py-24 bg-background-100">
      <div className="w-full px-4 md:px-6 lg:px-10">
        <div
          ref={ref}
          className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://storage.readdy-site.link/project_files/ac01bae9-5287-435a-8690-39522f5115fa/2691eb60-f360-4193-82f1-9b528f891f5e_--.webp?v=f6db808cc0666055cc69fcc418030dfe"
                alt="NP Massage Studio - интерьор"
                className="w-full h-80 md:h-[420px] lg:h-[500px] object-cover object-top"
                width="800"
                height="600"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <span className="inline-block px-4 py-1.5 bg-accent-100 text-accent-800 text-xs font-medium rounded-full mb-5">
              {t('aboutLabel')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-5 leading-tight">
              {t('aboutTitle')}
            </h2>
            <p className="text-sm md:text-base text-foreground-600 mb-4 leading-relaxed">
              {t('aboutText1')}
            </p>
            <p className="text-sm md:text-base text-foreground-700 italic mb-6 leading-relaxed border-l-[3px] border-accent-400 pl-4 py-1">
              {t('aboutText2')}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mb-7">
              <div className="flex items-center gap-2 bg-background-50 rounded-xl px-3 py-2 border border-background-200/50">
                <div className="w-8 h-8 flex items-center justify-center bg-primary-100 rounded-lg flex-shrink-0">
                  <i className="ri-star-fill text-primary-600 text-sm" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground-900">5.0</div>
                  <div className="text-[10px] text-foreground-500">отзиви в Google</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-background-50 rounded-xl px-3 py-2 border border-background-200/50">
                <div className="w-8 h-8 flex items-center justify-center bg-accent-100 rounded-lg flex-shrink-0">
                  <i className="ri-building-2-line text-accent-600 text-sm" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground-900">2</div>
                  <div className="text-[10px] text-foreground-500">локации</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-background-50 rounded-xl px-3 py-2 border border-background-200/50">
                <div className="w-8 h-8 flex items-center justify-center bg-secondary-100 rounded-lg flex-shrink-0">
                  <i className="ri-calendar-line text-secondary-600 text-sm" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground-900">7/7</div>
                  <div className="text-[10px] text-foreground-500">дни в седмицата</div>
                </div>
              </div>
            </div>

            <a
              href="/za-nas"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/za-nas');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium min-h-[48px]"
            >
              {t('aboutCta')}
              <i className="ri-arrow-right-up-line transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}