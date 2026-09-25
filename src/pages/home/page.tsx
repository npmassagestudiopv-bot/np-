import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import MobileBottomCta from '@/components/feature/MobileBottomCta';
import HeroSection from './components/HeroSection';
import EntityBlock from './components/EntityBlock';
import FaqAccordion from '@/components/feature/FaqAccordion';
import SeoTextBlock from '@/components/feature/SeoTextBlock';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import type {
  buildWebSiteSchema as BuildWebSiteSchema,
  buildOrganizationSchema as BuildOrganizationSchema,
  buildLocalBusinessSchema as BuildLocalBusinessSchema,
  buildPersonSchema as BuildPersonSchema,
  buildWebPageSchema as BuildWebPageSchema,
  buildBreadcrumbSchema as BuildBreadcrumbSchema,
  buildFaqSchema as BuildFaqSchema,
  buildOfferCatalogSchema as BuildOfferCatalogSchema,
  buildSiteNavigationSchema as BuildSiteNavigationSchema,
  buildImageObjectSchema as BuildImageObjectSchema,
  buildHowToSchema as BuildHowToSchema,
  buildProductSchema as BuildProductSchema,
  buildReviewSchema as BuildReviewSchema,
} from '@/lib/seoSchemas';

const ServicesSection = lazy(() => import('./components/ServicesSection'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection'));
const CtaSection = lazy(() => import('./components/CtaSection'));
const ClientReviews = lazy(() => import('@/components/feature/ClientReviews'));
const HonestBar = lazy(() => import('@/components/feature/HonestBar'));
const WhyChooseNp = lazy(() => import('./components/WhyChooseNp'));

const FAQ_ITEMS = [
  {
    q: 'Какви масажни услуги предлага NP Massage Studio в Търново?',
    a: 'NP Massage Studio предлага класически и релаксиращ масаж (60 мин, 25 €), спортен и терапевтичен масаж (60 мин, 25 €), антицелулитен масаж (40 мин, 20 €), ароматерапия (60 мин, 30 €), частичен масаж на гръб (40 мин, 15 €) и пакет антицелулитна терапия (10 процедури, 175 €).',
  },
  {
    q: 'Къде се намират локациите на NP Massage Studio за масажи Търново?',
    a: 'NP Massage Studio има две локации: Велико Търново на бул. България 72, и Павликени на ул. Атанас Дончев 10.',
  },
  {
    q: 'Как да запазя час за масаж Търново в NP Massage Studio?',
    a: `Можете да се обадите на +359 988 926 120 или да използвате онлайн формата за резервация на ${baseUrl}/rezervaciya`,
  },
  {
    q: 'Колко струва масажът в NP Massage Studio?',
    a: 'Цените варират от 15 € (40 мин масаж на гръб) до 30 € (60 мин ароматерапия). Класическият и спортният масаж са по 25 € за 60 минути.',
  },
  {
    q: 'Какво е работното време на NP Massage Studio?',
    a: 'Понеделник–Петък: 09:00–19:00, Събота: 09:00–17:00, Неделя: 10:00–16:00.',
  },
  {
    q: 'Трябва ли предварително записване?',
    a: 'Да, препоръчваме предварително записване. Свържете се с нас на +359 988 926 120 или чрез формата за контакт за по-добра организация и персонализирано обслужване.',
  },
  {
    q: 'Предлагате ли подаръчни ваучери за масаж?',
    a: 'Да! Предлагаме подаръчни ваучери за всички наши услуги в NP Massage Studio. Идеален подарък за рожден ден, аниверсария или специален повод. Важат 6 месеца от датата на издаване. Вижте повече на https://npmassagestudio.com/vaucheri',
  },
];

const SERVICES_SCHEMA = [
  { name: 'Класически и релаксиращ масаж', description: 'Традиционна техника за релаксиране на мускулите, намаляване на стреса и подобряване на общото благосъстояние.', price: '25', duration: 'PT60M' },
  { name: 'Спортен и терапевтичен масаж', description: 'Целенасочена терапия за спортисти и активни хора, фокусирана върху възстановяване и превенция на травми.', price: '25', duration: 'PT60M' },
  { name: 'Антицелулитен масаж', description: 'Ефективна процедура за гладка и стегната кожа чрез специализирани техники.', price: '20', duration: 'PT40M' },
  { name: 'Ароматерапия', description: 'Съчетание на масаж и етерични масла за дълбок релакс и хармонизиране на тялото и ума.', price: '30', duration: 'PT60M' },
  { name: 'Частичен масаж на гръб', description: 'Целенасочена терапия за облекчаване на напрежението в гърба, раменете и врата.', price: '15', duration: 'PT40M' },
];

const HOME_REVIEWS = [
  {
    author: 'Ferko Petkov',
    reviewBody: 'Давам 5 звезди защото няма 6. Няма равен! Ако те докосне, ставаш друг човек. Човекът е точен, винаги се старае да даде максимума от себе си.',
    ratingValue: 5,
    datePublished: '2026-07-20',
  },
  {
    author: 'Petya Doneva',
    reviewBody: 'Посещавам студиото многократно и вече мога да кажа — заслужава дори повече от 5 звезди. Всеки път масажът е уникален, а отношението е на най-високо ниво.',
    ratingValue: 5,
    datePublished: '2026-07-05',
  },
  {
    author: 'Madison M',
    reviewBody: 'We went to Veliko Tarnovo as a couple for sports and classic relaxation massages. Very professional and friendly. Great price and amazing experience.',
    ratingValue: 5,
    datePublished: '2026-07-28',
  },
  {
    author: 'Todor Donchev',
    reviewBody: 'Много съм доволен от спортния масаж при Nathan. Работи професионално, обръща внимание на детайлите и не прекалява. Определено препоръчвам!',
    ratingValue: 5,
    datePublished: '2026-05-03',
  },
];

const SectionLoader = () => (
  <div className="w-full py-16 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-500 rounded-full animate-spin" />
  </div>
);

export default function Home() {
  const { t } = useTranslation();
  const [seoSchemas, setSeoSchemas] = useState<ReturnType<typeof BuildWebSiteSchema>[]>([]);

  // Lazy load schema builders so they don't block initial bundle
  useEffect(() => {
    let cancelled = false;
    import('@/lib/seoSchemas').then((mod) => {
      if (cancelled) return;
      const PRODUCT_SCHEMAS = [
        mod.buildProductSchema('Класически масаж', 'Традиционна техника за релаксиране на мускулите в NP Massage Studio.', '25', 'EUR', undefined, 'klassicheski-masazh'),
        mod.buildProductSchema('Спортен масаж', 'Целенасочена терапия за спортисти в NP Massage Studio.', '25', 'EUR', undefined, 'sporten-masazh'),
        mod.buildProductSchema('Антицелулитен масаж', 'Ефективна процедура за гладка кожа в NP Massage Studio.', '20', 'EUR', undefined, 'anticeluliten-masazh'),
        mod.buildProductSchema('Ароматерапия', 'Съчетание на масаж и етерични масла в NP Massage Studio.', '30', 'EUR', undefined, 'aromaterapiya'),
        mod.buildProductSchema('Масаж на гръб', 'Целенасочена терапия за гръб в NP Massage Studio.', '15', 'EUR', undefined, 'masazh-grab'),
      ];

      const HOWTO_BOOKING = mod.buildHowToSchema(
        'Как да си запазите час за масаж в NP Massage Studio',
        'Стъпка-по-стъпка инструкции за онлайн и телефонна резервация на масаж в NP Massage Studio — Велико Търново и Павликени.',
        [
          { name: 'Изберете услуга', text: 'Разгледайте услугите на NP Massage Studio и изберете подходящия масаж — класически, спортен, антицелулитен, ароматерапия или масаж на гръб.' },
          { name: 'Изберете локация', text: 'NP Massage Studio има два салона — във Велико Търново (бул. България 72) и в Павликени (ул. Атанас Дончев 10). Изберете удобната за вас локация.' },
          { name: 'Изберете дата и час', text: 'Проверете наличните часове и изберете дата и час, удобни за вас. Работим всеки ден с удължено работно време.' },
          { name: 'Попълнете данните си', text: 'Въведете вашето име, телефон и предпочитания. Ако имате специални изисквания, споменете ги в бележките.' },
          { name: 'Потвърдете резервацията', text: 'Натиснете "Запази час" и получете потвърждение по SMS или имейл. Очакваме ви в NP Massage Studio!' },
        ]
      );

      setSeoSchemas([
        mod.buildWebSiteSchema(),
        mod.buildOrganizationSchema(),
        mod.buildLocalBusinessVtSchema(),
        mod.buildLocalBusinessPvSchema(),
        mod.buildPersonSchema(),
        mod.buildWebPageSchema(
          'Масаж Велико Търново | NP Масажно студио — от 15 €',
          'NP Масажно студио — професионални масажи Велико Търново и Павликени. Класически, спортен, антицелулитен масаж & ароматерапия от 15 €.',
          '/',
          'WebPage',
          { cssSelector: ['h1', 'h2', '.hero-subtitle'] }
        ),
        mod.buildBreadcrumbSchema([
          { name: 'Начало', url: '/' },
        ]),
        mod.buildFaqSchema(FAQ_ITEMS),
        mod.buildOfferCatalogSchema(SERVICES_SCHEMA),
        mod.buildSiteNavigationSchema(),
        mod.buildImageObjectSchema(
          'https://storage.readdy-site.link/project_files/ac01bae9-5287-435a-8690-39522f5115fa/797959de-34c7-40ec-bb97-d471b3bf9060_--.webp?v=d5680a101df04e2df0a7f29dc2cd1d37',
          'NP Massage Studio — интериор на масажния салон във Велико Търново',
          1920,
          1080
        ),
        HOWTO_BOOKING,
        ...PRODUCT_SCHEMAS,
        mod.buildReviewSchema(HOME_REVIEWS),
      ]);
    });
    return () => { cancelled = true; };
  }, []);

  const seoOptions = useMemo(() => ({
    title: 'Масаж Велико Търново | NP Масажно студио — от 15 €',
    description: 'NP Масажно студио — професионални масажи Велико Търново и Павликени. Класически, спортен, антицелулитен масаж & ароматерапия от 15 €. Запази час: +359 988 926 120.',
    keywords: 'масаж Велико Търново, масажи Търново, масажно студио, класически масаж, спортен масаж, терапевтичен масаж, антицелулитен масаж, ароматерапия, масаж на гръб, NP Massage Studio, масажи Павликени, масаж Търново',
    canonical: '/',
    lastModified: '2026-08-06',
    hreflangs: [
      { lang: 'bg', url: '/' },
      { lang: 'en', url: '/en' },
      { lang: 'x-default', url: '/' },
    ],
    geo: {
      placename: 'Велико Търново, България',
      region: 'BG-04',
      position: '43.081037;25.612733',
      icbm: '43.081037, 25.612733',
    },
    og: {
      title: 'Масаж Велико Търново | NP Масажно студио — от 15 €',
      description: 'NP Масажно студио — професионални масажи Велико Търново и Павликени. Класически, спортен, антицелулитен масаж & ароматерапия от 15 €.',
      type: 'website',
      locale: 'bg_BG',
      localeAlternate: ['en_US'],
    },
    schemas: seoSchemas,
  }), [seoSchemas]);

  useSeo(seoOptions);

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main id="main-content" className="pb-28 md:pb-0">
        <HeroSection />
        <Suspense fallback={<SectionLoader />}>
          <ServicesSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <WhyChooseNp />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ClientReviews isEn={false} limit={3} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <HonestBar isEn={false} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CtaSection />
        </Suspense>
        <section className="w-full px-4 md:px-6 lg:px-10 py-14 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                Често задавани въпроси
              </h2>
              <p className="text-sm text-foreground-600">Отговори на най-популярните въпроси за масажи Търново и Павликени</p>
            </div>
            <FaqAccordion items={FAQ_ITEMS.map((item) => ({ q: item.q, a: item.a }))} />
            <div className="mt-8">
              <SeoTextBlock isEn={false} />
            </div>
          </div>
        </section>
        <EntityBlock />
        <section className="w-full px-4 md:px-6 lg:px-10 pb-24 md:pb-28">
          <div className="max-w-5xl mx-auto">
            <div className="bg-red-50/40 rounded-xl p-4 md:p-5 border border-red-200/50 text-center">
              <p className="text-xs text-red-700/70 leading-relaxed">
                <strong>NP Massage Studio предлага САМО професионални терапевтични и релаксиращи масажи.</strong> Не предлагаме услуги от интимен или еротичен характер.
              </p>
            </div>
          </div>
        </section>
      </main>
      <MobileBottomCta />
      <Footer />
    </div>
  );
}