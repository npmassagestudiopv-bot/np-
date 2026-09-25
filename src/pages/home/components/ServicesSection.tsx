import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { services } from '@/mocks/services';

const serviceSlugs = ['klasicheski-masazh', 'sporten-masazh', 'anticeluliten-masazh', 'aromaterapiya', 'masazh-na-grab'];

export default function ServicesSection() {
  const { t } = useTranslation();
  const { getPath } = useLocalizedNav();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section className="py-16 md:py-24 bg-background-50">
      <div className="w-full px-4 md:px-6 lg:px-10">
        <div
          ref={titleRef}
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-xs font-medium text-accent-600 uppercase tracking-widest mb-3 block">
            NP Massage Studio
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
            {t('servicesTitle')}
          </h2>
          <p className="text-sm md:text-base text-foreground-600 max-w-lg mx-auto leading-relaxed">
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

        <div className="max-w-3xl mx-auto mt-8 bg-red-50/50 rounded-xl p-4 border border-red-200/50">
          <div className="flex items-center gap-2 text-xs text-red-700/80">
            <i className="ri-information-line text-red-500 flex-shrink-0" />
            <span>
              <strong className="text-red-800">ВАЖНО:</strong> NP Massage Studio предлага САМО изброените по-горе 5 вида масаж. Ние НЕ предлагаме: лимфен дренаж, шиацу, тайландски масаж, рефлексотерапия, меден масаж, масаж с горещи камъни и други.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, slug }: { service: (typeof services)[0]; index: number; slug: string }) {
  const { t } = useTranslation();
  const { getPath } = useLocalizedNav();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  return (
    <div
      ref={ref}
      className={`group bg-background-100 rounded-2xl overflow-hidden border border-background-200/70 hover:border-primary-300/60 transition-all duration-500 card-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors duration-300">
              <i className={`${serviceIcons[index] || 'ri-heart-pulse-line'} text-primary-600 text-lg`} />
            </div>
            <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground-950">
              {t(service.nameKey)}
            </h3>
          </div>
          <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full whitespace-nowrap">
            {t(service.priceKey)}
          </span>
        </div>
        <p className="text-sm text-foreground-600 mb-4 leading-relaxed pl-[52px]">
          {t(service.descKey)}
        </p>
        <div className="flex items-center justify-between pl-[52px]">
          <span className="text-xs text-foreground-500 flex items-center gap-1">
            <i className="ri-time-line" />
            {service.duration} {t('serviceDuration')}
          </span>
          <Link
            to={getPath(`/uslugi/${slug}`)}
            className="px-4 py-2 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[36px]"
          >
            {t('serviceBook')}
          </Link>
        </div>
      </div>
    </div>
  );
}

const serviceIcons = [
  'ri-mental-health-line',
  'ri-run-line',
  'ri-body-scan-line',
  'ri-leaf-line',
  'ri-user-heart-line',
];