import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import FaqAccordion from '@/components/feature/FaqAccordion';
import CtaBanner from '@/components/feature/CtaBanner';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildLocalBusinessSchema,
  buildFaqSchema,
  buildWebPageSchema,
  buildPersonSchema,
  buildHowToSchema,
  buildProductSchema,
} from '@/lib/seoSchemas';

const FAQ_ITEMS_ABOUT = [
  { q: 'Колко дълго съществува NP Massage Studio?', a: 'NP Massage Studio е основано с ясна мисия — да предоставя достъпни, професионални масажни услуги на жителите и гостите на Велико Търново и Павликени. Студиото е лидер в масажните услуги в региона с две локации и екип от опитни терапевти.' },
  { q: 'Колко локации има NP Massage Studio?', a: 'NP Massage Studio има две локации: Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10). И двете локации предлагат пълната гама от услуги — класически масаж, спортен масаж, антицелулитен масаж, ароматерапия и масаж на гръб.' },
  { q: 'Какви са ценностите на NP Massage Studio?', a: 'Ние вярваме в персонализирания подход, качество без компромис, натурални продукти и създаване на пространство за истинска релаксация и възстановяване. Всеки клиент получава индивидуално внимание и процедура, съобразена с неговите нужди.' },
  { q: 'Кой е управителят на NP Massage Studio?', a: 'Управител на NP Massage Studio е Натан Петков — професионален масажист с многогодишен опит в масажната терапия. Той лично следи за качеството на всяка процедура и поддържа висок стандарт на обслужване в двата салона.' },
  { q: 'Какво работно време има NP Massage Studio?', a: 'Работим всеки ден: Понеделник–Петък 09:00–19:00, Събота 09:00–17:00, Неделя 10:00–16:00. Двете локации във Велико Търново и Павликени спазват еднакво работно време.' },
  { q: 'Как да запазя час за масаж в NP Massage Studio?', a: 'Можете да запазите час онлайн чрез формата на сайта ни или по телефон на +359 988 926 120. Препоръчваме предварително записване за по-добра организация и персонализирано обслужване.' },
];

const HOWTO_BOOK = buildHowToSchema(
  'Как да си запазите час за масаж в NP Massage Studio',
  'Просто ръководство за резервация на масаж в NP Massage Studio — Велико Търново и Павликени.',
  [
    { name: 'Изберете услуга', text: 'Разгледайте нашите услуги — класически, спортен, антицелулитен масаж, ароматерапия или масаж на гръб.' },
    { name: 'Изберете локация', text: 'Велико Търново (бул. България 72) или Павликени (ул. Атанас Дончев 10).' },
    { name: 'Запазете час', text: 'Обадете се на +359 988 926 120 или използвайте онлайн формата за резервация.' },
  ]
);

export default function AboutPage() {
  const { t } = useTranslation();
  const { handleNav, isEn } = useLocalizedNav();

  useSeo(useMemo(() => ({
    title: 'За нас | NP Масажно студио — Професионален масажен салон Велико Търново и Павликени',
    description: 'Научете повече за NP Масажно студио — история, философия и мисия. Два масажни салона: Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10). Управител Натан Петков. Запази час: +359 988 926 120.',
    keywords: 'за нас масажно студио, NP Massage Studio история, масажен салон Велико Търново, Натан Петков масажист, масажно студио Павликени',
    canonical: isEn ? '/en/about' : '/za-nas',
    lastModified: '2026-06-08',
    hreflangs: [
      { lang: 'bg', url: '/za-nas' },
      { lang: 'en', url: '/en/about' },
      { lang: 'x-default', url: '/za-nas' },
    ],
    og: {
      title: 'За нас | NP Масажно студио',
      description: 'Историята и философията на NP Масажно студио — два масажни салона в Велико Търново и Павликени. Управител Натан Петков.',
    },
    schemas: [
      buildWebPageSchema('За нас | NP Massage Studio', 'История и философия на NP Massage Studio.', '/za-nas', 'AboutPage'),
      buildBreadcrumbSchema([{ name: 'Начало', url: '/' }, { name: 'За нас', url: '/za-nas' }]),
      buildOrganizationSchema(),
      buildLocalBusinessSchema(),
      buildPersonSchema(),
      buildFaqSchema(FAQ_ITEMS_ABOUT),
      HOWTO_BOOK,
    ],
  }), [isEn]));

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 md:mb-16">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
                {t('aboutTitle')}
              </h1>
              <p className="text-base text-foreground-600 mb-6 max-w-2xl leading-relaxed">
                {t('aboutText1')}
              </p>
              <p className="text-base text-foreground-600 mb-8 max-w-2xl leading-relaxed">
                {t('aboutText2')}
              </p>
            </div>

            <AboutStory />
            <AboutOwner />
            <AboutWhy />

            <div className="mb-16 md:mb-20">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                  {t('faqTitle')}
                </h2>
                <p className="text-sm text-foreground-600">{t('faqSubtitle')}</p>
              </div>
              <FaqAccordion items={FAQ_ITEMS_ABOUT.map((item) => ({ q: item.q, a: item.a }))} />
            </div>

            <CtaBanner />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function AboutStory() {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div ref={ref} className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="w-full lg:w-1/2">
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src="https://storage.readdy-site.link/project_files/ac01bae9-5287-435a-8690-39522f5115fa/2691eb60-f360-4193-82f1-9b528f891f5e_--.webp?v=f6db808cc0666055cc69fcc418030dfe"
            alt="NP Massage Studio — интериор на масажния салон във Велико Търново"
            title="NP Massage Studio — Велико Търново"
            className="w-full h-80 md:h-[420px] lg:h-[500px] object-cover object-top"
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
          />
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-4">
          {t('aboutFullTitle')}
        </h2>
        <p className="text-sm md:text-base text-foreground-600 mb-4 leading-relaxed">
          {t('aboutFullText1')}
        </p>
        <p className="text-sm md:text-base text-foreground-600 mb-4 leading-relaxed">
          {t('aboutFullText2')}
        </p>
        <p className="text-sm md:text-base text-foreground-600 mb-6 leading-relaxed">
          {t('aboutFullText3')}
        </p>
        <p className="text-sm md:text-base text-foreground-700 italic leading-relaxed border-l-2 border-accent-400 pl-4 mb-6">
          {t('aboutQuote')}
        </p>
        <a
          href="/kontakti"
          onClick={(e) => { e.preventDefault(); handleNav('/kontakti'); }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium min-h-[48px]"
        >
          {t('ctaButton')}
          <i className="ri-arrow-right-up-line" />
        </a>
      </div>
    </div>
  );
}

function AboutOwner() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div ref={ref} className={`mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <i className="ri-user-star-line text-primary-600 text-2xl" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-3">
              За управителя — Натан Петков
            </h2>
            <p className="text-base text-foreground-700 leading-relaxed mb-3">
              <strong>Натан Петков</strong> е основател и управител на <strong>NP Massage Studio</strong>. С многогодишен опит в <strong>масажната терапия</strong>, той успешно изгражда и управлява два професионални <strong>масажни салона във Велико Търново</strong> и <strong>Павликени</strong>. Неговата философия е проста — <strong>точност</strong>, <strong>професионализъм</strong> и <strong>индивидуален подход</strong> към всеки клиент.
            </p>
            <p className="text-base text-foreground-700 leading-relaxed mb-3">
              Под негово ръководство <strong>NP Massage Studio</strong> се превърна в доверено име за <strong>масажи Велико Търново</strong> и <strong>масажи Павликени</strong>. Салоните са известни с чистата си среда, квалифицираните терапевти и удобната система за <strong>онлайн резервация на масаж</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                <i className="ri-verified-badge-line text-sm" />
                Лицензиран терапевт
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                <i className="ri-store-2-line text-sm" />
                2 локации
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                <i className="ri-time-line text-sm" />
                Многогодишен опит
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                <i className="ri-star-fill text-sm text-amber-400" />
                Професионално обслужване
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutWhy() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div ref={ref} className={`mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-8 text-center">
        {t('aboutWhyTitle')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-background-100 rounded-xl p-5 border border-background-200/70 flex items-start gap-3 hover:border-primary-300/40 transition-colors duration-300">
            <div className="w-8 h-8 flex items-center justify-center bg-accent-100 rounded-full flex-shrink-0 mt-0.5">
              <i className="ri-check-line text-accent-700" />
            </div>
            <p className="text-sm text-foreground-700 leading-relaxed">{t(`aboutWhy${n}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}