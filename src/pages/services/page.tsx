import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import FaqAccordion from '@/components/feature/FaqAccordion';
import CtaBanner from '@/components/feature/CtaBanner';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { services } from '@/mocks/services';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildOfferCatalogSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildWebPageSchema,
  buildPersonSchema,
  buildHowToSchema,
  buildProductSchema,
} from '@/lib/seoSchemas';

const FAQ_ITEMS = [
  { q: 'Колко дълго продължава един масаж?', a: 'Класическият, спортният и релаксиращият масаж продължават 60 минути. Антицелулитният масаж и частичният масаж на гръб са 40 минути. Ароматерапията е 60 минути.' },
  { q: 'Трябва ли предварително записване?', a: 'Да, препоръчваме предварително записване на +359 988 926 120 за по-добра организация и персонализирано обслужване.' },
  { q: 'Какви продукти използвате?', a: 'Работим с висококачествени натурални масла и продукти, нежни към кожата. За ароматерапия използваме чисти етерични масла.' },
  { q: 'Подходящ ли е масажът при бременност?', a: 'При бременност се препоръчва специализиран пренатален масаж. Информирайте ни предварително.' },
  { q: 'Колко струва масажът?', a: 'Цените варират от 15 € за частичен масаж на гръб до 30 € за ароматерапия. Класическият и спортният масаж са по 25 € за 60 минути.' },
  { q: 'Предлагате ли ваучери за подарък?', a: 'Да, предлагаме подаръчни ваучери за всички услуги. Идеален подарък за рожден ден или специален повод.' },
];

const SERVICES_SCHEMA_ITEMS = [
  { name: 'Класически и релаксиращ масаж', description: 'Традиционна техника за релаксиране на мускулите, намаляване на стреса и подобряване на общото благосъстояние.', price: '25', duration: 'PT60M' },
  { name: 'Спортен и терапевтичен масаж', description: 'Целенасочена терапия за спортисти и активни хора, фокусирана върху възстановяване и превенция на травми.', price: '25', duration: 'PT60M' },
  { name: 'Антицелулитен масаж', description: 'Ефективна процедура за гладка и стегната кожа чрез специализирани техники.', price: '20', duration: 'PT40M' },
  { name: 'Ароматерапия', description: 'Съчетание на масаж и етерични масла за дълбок релакс и хармонизиране на тялото и ума.', price: '30', duration: 'PT60M' },
  { name: 'Частичен масаж на гръб', description: 'Целенасочена терапия за облекчаване на напрежението в гърба, раменете и врата.', price: '15', duration: 'PT40M' },
];

const HOWTO_CHOOSE = buildHowToSchema(
  'Как да изберете подходящия масаж в NP Massage Studio',
  'Практическо ръководство за избор на правилния масаж според вашите нужди — релакс, спортно възстановяване, красота или терапия.',
  [
    { name: 'Определете целта', text: 'Ако търсите релакс и облекчаване на стреса — класическият масаж или ароматерапията са най-подходящи. Ако сте спортист — спортният масаж е за вас.' },
    { name: 'Изберете продължителност', text: 'Класическият и спортният масаж са 60 минути. Ако имате ограничено време, частичният масаж на гръб е 40 минути и фокусира върху проблемните зони.' },
    { name: 'Помислете за бюджета', text: 'Цените започват от 15 € за масаж на гръб и достигат 30 € за ароматерапия. Класическият и спортният масаж са по 25 € — отлично съотношение цена-качество.' },
    { name: 'Консултирайте се с терапевт', text: 'Ако не сте сигурни, обадете ни се на +359 988 926 120. Нашите терапевти ще ви консултират безплатно и ще препоръчат най-подходящия масаж за вас.' },
    { name: 'Запазете час', text: 'След като сте избрали услугата, запазете час онлайн или по телефон. Очакваме ви в NP Massage Studio във Велико Търново или Павликени!' },
  ]
);

const PRODUCT_SCHEMAS = [
  buildProductSchema('Класически масаж', 'Традиционна техника за релаксиране на мускулите в NP Massage Studio.', '25', 'EUR', undefined, 'klassicheski-masazh'),
  buildProductSchema('Спортен масаж', 'Целенасочена терапия за спортисти в NP Massage Studio.', '25', 'EUR', undefined, 'sporten-masazh'),
  buildProductSchema('Антицелулитен масаж', 'Ефективна процедура за гладка кожа в NP Massage Studio.', '20', 'EUR', undefined, 'anticeluliten-masazh'),
  buildProductSchema('Ароматерапия', 'Съчетание на масаж и етерични масла в NP Massage Studio.', '30', 'EUR', undefined, 'aromaterapiya'),
  buildProductSchema('Масаж на гръб', 'Целенасочена терапия за гръб в NP Massage Studio.', '15', 'EUR', undefined, 'masazh-grab'),
];

export default function ServicesPage() {
  const { t } = useTranslation();
  const { handleNav, isEn } = useLocalizedNav();
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  useSeo(useMemo(() => ({
    title: 'Услуги и цени | NP Масажно студио — 15–30 €',
    description: 'Пълен списък с масажни услуги и цени в NP Масажно студио. Класически масаж 25 €, спортен масаж 25 €, антицелулитен 20 €, ароматерапия 30 €, масаж на гръб 15 €. Две локации: Велико Търново и Павликени. Запази час: +359 988 926 120.',
    keywords: 'масажни услуги Велико Търново, цени масаж Търново, класически масаж цена, спортен масаж цена, антицелулитен масаж, ароматерапия Велико Търново, масаж на гръб цена, NP Масажно студио',
    canonical: isEn ? '/en/services' : '/uslugi',
    lastModified: '2026-08-06',
    hreflangs: [
      { lang: 'bg', url: '/uslugi' },
      { lang: 'en', url: '/en/services' },
      { lang: 'x-default', url: '/uslugi' },
    ],
    og: {
      title: 'Услуги и цени | NP Масажно студио',
      description: 'Всички масажни услуги с цени. Класически, спортен, антицелулитен масаж, ароматерапия в Велико Търново и Павликени. Цени 15–30 €. Запази час: +359 988 926 120.',
    },
    schemas: [
      buildWebPageSchema('Услуги и цени | NP Massage Studio', 'Масажни услуги и цени в NP Massage Studio — Велико Търново и Павликени.', '/uslugi', 'CollectionPage'),
      buildBreadcrumbSchema([{ name: 'Начало', url: '/' }, { name: 'Услуги', url: '/uslugi' }]),
      buildOfferCatalogSchema(SERVICES_SCHEMA_ITEMS),
      buildFaqSchema(FAQ_ITEMS),
      buildLocalBusinessSchema(),
      buildPersonSchema(),
      HOWTO_CHOOSE,
      ...PRODUCT_SCHEMAS,
    ],
  }), [isEn]));

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24" id="main-content">
        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 md:mb-16">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
                {t('servicesTitle')}
              </h1>
              <p className="text-base text-foreground-600 mb-4 max-w-2xl leading-relaxed">
                {t('servicesSubtitle')}
              </p>
              <p className="text-sm text-foreground-500 max-w-2xl leading-relaxed">
                {t('servicesIntro')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isHovered={hoveredService === service.id}
                  onHover={setHoveredService}
                />
              ))}
            </div>

            <div className="mb-12 md:mb-16 bg-red-50/60 rounded-2xl p-6 md:p-8 border-2 border-red-200/60">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-xl flex-shrink-0">
                  <i className="ri-error-warning-line text-red-600 text-xl" />
                </div>
                <div>
                  <h2 className="font-heading text-xl md:text-2xl font-semibold text-red-800 mb-2">
                    {t('notOfferedTitle')}
                  </h2>
                  <p className="text-sm text-red-700/80 leading-relaxed">
                    {t('notOfferedSubtitle')}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {t('notOfferedList').split(', ').map((item: string) => (
                  <span key={item} className="px-3 py-1.5 bg-white/70 text-red-700 text-xs font-medium rounded-full border border-red-200/50">
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-xs text-red-600/70 leading-relaxed">
                {t('notOfferedFooter')}
              </p>
            </div>

            <div className="bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70 mb-16 md:mb-20">
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-4">
                {t('serviceAnticellulitePack')}
              </h3>
              <p className="text-sm text-foreground-600 mb-5 leading-relaxed">
                {t('serviceAnticelluliteFull')}
              </p>
              <button
                onClick={() => handleNav('/kontakti')}
                className="px-5 py-2.5 bg-accent-500 text-background-50 text-sm font-medium rounded-full hover:bg-accent-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium min-h-[48px]"
              >
                {t('serviceBook')}
              </button>
            </div>

            <div className="mb-16 md:mb-20">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                  {t('faqTitle')}
                </h2>
                <p className="text-sm text-foreground-600">{t('faqSubtitle')}</p>
              </div>
              <FaqAccordion items={FAQ_ITEMS.map((item) => ({ q: item.q, a: item.a }))} />
            </div>

            <CtaBanner />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ServiceCard({
  service,
  isHovered,
  onHover,
}: {
  service: (typeof services)[0];
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const slugs: Record<string, string> = {
    classical: 'klasicheski-masazh',
    sport: 'sporten-masazh',
    anticellulite: 'anticeluliten-masazh',
    aromatherapy: 'aromaterapiya',
    back: 'masazh-na-grab',
  };
  const slug = slugs[service.id] || '';

  return (
    <article
      ref={ref}
      className={`bg-background-100 rounded-2xl overflow-hidden border border-background-200/70 transition-all duration-500 card-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      onMouseEnter={() => onHover(service.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground-950">{t(service.nameKey)}</h3>
          <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{t(service.priceKey)}</span>
        </div>
        <p className="text-sm text-foreground-600 mb-3 leading-relaxed">{t(service.descKey)}</p>
        <p className="text-sm text-foreground-700 leading-relaxed mb-4">{t(service.fullKey)}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground-500 flex items-center gap-1">
            <i className="ri-time-line" />
            {service.duration} {t('serviceDuration')}
          </span>
          <button
            onClick={() => handleNav(`/uslugi/${slug}`)}
            className="px-4 py-2 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium min-h-[48px]"
          >
            {t('serviceBook')}
          </button>
        </div>
      </div>
    </article>
  );
}