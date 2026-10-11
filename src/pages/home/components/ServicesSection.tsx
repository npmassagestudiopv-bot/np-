import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { services } from '@/mocks/services';

const serviceSlugs = ['klasicheski-masazh', 'sporten-masazh', 'anticeluliten-masazh', 'aromaterapiya', 'masazh-na-grab'];

export default function ServicesSection() {
  const { t } = useTranslation();
  const { getPath, isEn } = useLocalizedNav();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section className="py-16 md:py-24 bg-background-50">
      <div className="site-container">
        <div
          ref={titleRef}
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-xs font-medium text-accent-600 uppercase tracking-widest mb-3 block">
            NP Massage Studio
          </span>
          <h2 className="section-title text-foreground-950 mb-4">
            {t('servicesTitle')}
          </h2>
          <p className="section-copy text-foreground-600 max-w-xl mx-auto">
            {t('servicesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} slug={serviceSlugs[index]} />
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12">
          <Link
            to={getPath('/uslugi')}
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-primary-500 text-primary-700 font-medium text-sm rounded-full hover:bg-primary-500 hover:text-background-50 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
          >
            {t('heroServices')}
            <i className="ri-arrow-right-line transition-transform duration-300" />
          </Link>
        </div>

        <p className="max-w-3xl mx-auto mt-8 text-sm text-foreground-600 text-center leading-relaxed">
          {isEn ? 'Not sure which massage to choose? Call us on ' : 'Не сте сигурни кой масаж да изберете? Обадете ни се на '}
          <a href="tel:+359988926120" className="font-medium text-primary-700 underline underline-offset-4">+359 988 926 120</a>.
        </p>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, slug }: { service: (typeof services)[0]; index: number; slug: string }) {
  const { t } = useTranslation();
  const { getPath, isEn } = useLocalizedNav();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  return (
    <article
      ref={ref}
      className={`group flex flex-col bg-background-100 rounded-2xl overflow-hidden border border-background-200/70 hover:border-primary-300/60 transition-all duration-500 card-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col flex-1 p-5 md:p-7">
        <div className="mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors duration-300">
              <i className={`${serviceIcons[index] || 'ri-heart-pulse-line'} text-primary-600 text-lg`} />
            </div>
            <h3 className="service-card-title text-foreground-950 min-w-0">
              {t(service.nameKey)}
            </h3>
          </div>
        </div>
        <p className="text-base text-foreground-600 mb-6 leading-relaxed">
          {t(service.descKey)}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
          <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full whitespace-nowrap tabular-nums">
            {t(service.priceKey)}
          </span>
          <Link
            to={getPath(`/uslugi/${slug}`)}
            aria-label={isEn ? `View ${t(service.nameKey)} details` : `Виж ${t(service.nameKey).toLowerCase()}`}
            className="px-4 py-2 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[44px]"
          >
            {isEn ? 'View details' : 'Виж услугата'}
          </Link>
        </div>
      </div>
    </article>
  );
}

const serviceIcons = [
  'ri-mental-health-line',
  'ri-run-line',
  'ri-body-scan-line',
  'ri-leaf-line',
  'ri-user-heart-line',
];
