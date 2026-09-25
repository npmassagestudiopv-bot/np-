import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import FaqAccordion from '@/components/feature/FaqAccordion';
import CtaBanner from '@/components/feature/CtaBanner';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useSeo } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildFaqSchema,
  buildWebPageSchema,
  buildHowToSchema,
} from '@/lib/seoSchemas';

const MASSAGE_TYPES = [
  {
    id: 'klassicheski',
    name: 'Класически и релаксиращ масаж',
    price: '25 €',
    duration: '60 минути',
    intensity: 'Средна',
    bestFor: 'Релаксация, облекчаване на стрес, общо благосъстояние',
    description: 'Традиционна техника с плавни, ритмични движения. Идеален за хора, които търсят пълноценна релаксация и възстановяване след натоварена седмица. Подходящ за всички възрасти и нива на физическа активност.',
    icon: 'ri-heart-pulse-line',
    slug: 'klasicheski-masazh',
  },
  {
    id: 'sporten',
    name: 'Спортен и терапевтичен масаж',
    price: '25 €',
    duration: '60 минути',
    intensity: 'Висока',
    bestFor: 'Спортно възстановяване, мускулни болки, превенция на травми',
    description: 'Целенасочена дълбока тъканна терапия с интензивен натиск. Комбинира фрикции, компресии и разтягания за максимално възстановяване на мускулите. Препоръчва се за спортисти и физически активни хора.',
    icon: 'ri-run-line',
    slug: 'sporten-masazh',
  },
  {
    id: 'anticeluliten',
    name: 'Антицелулитен масаж',
    price: '20 €',
    duration: '40 минути',
    intensity: 'Средна до висока',
    bestFor: 'Подобряване на кожата, редукция на целулит, лимфен дренаж',
    description: 'Специализирана техника, фокусирана върху проблемните зони. Стимулира кръвообращението и лимфния поток, подпомага разграждането на мастните депа. Препоръчва се курс от 10 процедури за оптимални резултати.',
    icon: 'ri-women-line',
    slug: 'anticeluliten-masazh',
  },
  {
    id: 'aromaterapiya',
    name: 'Ароматерапия',
    price: '30 €',
    duration: '60 минути',
    intensity: 'Ниска до средна',
    bestFor: 'Дълбок релакс, емоционален баланс, хармонизиране на тялото',
    description: 'Уникална комбинация от нежен масаж и чисти етерични масла. Всяко масло е подбрано според вашите нужди — лавандула за релакс, розмарин за енергия, евкалипт за дишане. Създава пълно сетивно изживяване.',
    icon: 'ri-flower-line',
    slug: 'aromaterapiya',
  },
  {
    id: 'grab',
    name: 'Частичен масаж на гръб',
    price: '15 €',
    duration: '40 минути',
    intensity: 'Средна',
    bestFor: 'Болки в гърба и врата, напрежение в раменете, заседнал начин на живот',
    description: 'Фокусирана терапия върху гърба, раменете и врата — зоните, които най-често страдат от стрес и заседнала работа. Бързо облекчение на схванати мускули и главоболие от напрежение.',
    icon: 'ri-body-scan-line',
    slug: 'masazh-na-grab',
  },
];

const COMPARISON_FAQ = [
  { q: 'Кой масаж е най-подходящ за мен?', a: 'Ако търсите релаксация и облекчаване на стреса — изберете класически масаж или ароматерапия. Ако сте спортист или имате мускулни болки — спортен масаж. Ако искате да подобрите вида на кожата — антицелулитен масаж. Ако имате ограничено време или болки само в гърба — частичен масаж на гръб. При съмнение, обадете ни се на +359 988 926 120 за безплатна консултация.' },
  { q: 'Колко често трябва да ходя на масаж?', a: 'За релаксация и поддръжка — веднъж седмично или на две седмици. За спортно възстановяване — 1-2 пъти седмично. За антицелулитна терапия — 2 пъти седмично в продължение на 5 седмици. За хронични болки — според препоръката на терапевта.' },
  { q: 'Може ли да комбинирам различни видове масаж?', a: 'Да, много клиенти комбинират различни масажи. Например класически масаж за релакс и спортен за възстановяване, или ароматерапия веднъж месечно като специално изживяване. Нашите терапевти ще ви помогнат да създадете персонализиран план.' },
  { q: 'Каква е разликата между класически и спортен масаж?', a: 'Класическият масаж използва плавни, релаксиращи движения с умерен натиск. Спортният масаж е по-интензивен, с дълбок натиск и специфични техники като разтягане и тригерна терапия. Класическият е за релакс, спортният — за възстановяване и превенция на травми.' },
  { q: 'Има ли противопоказания за масаж?', a: 'Масажът не се препоръчва при остри инфекциозни заболявания, висока температура, скорошни операции, тромбози и някои кожни заболявания. При хронични заболявания се консултирайте с лекар. Нашите терапевти винаги провеждат кратка консултация преди процедурата.' },
  { q: 'Как да запазя час за масаж?', a: 'Обадете се на +359 988 926 120 или използвайте онлайн формата за резервация на нашия сайт. Предлагаме гъвкаво работно време всеки ден от седмицата, включително събота и неделя.' },
];

const HOWTO_CHOOSE = buildHowToSchema(
  'Как да изберете правилния масаж — ръководство от NP Massage Studio',
  'Стъпка по стъпка инструкции за избор на най-подходящия масаж според вашите нужди, бюджет и начин на живот.',
  [
    { name: 'Определете целта си', text: 'Релаксация и стрес → класически масаж или ароматерапия. Мускулни болки и спорт → спортен масаж. Подобряване на кожата → антицелулитен масаж. Болки в гърба → частичен масаж на гръб.' },
    { name: 'Определете бюджета си', text: 'Масаж на гръб започва от 15€ (най-достъпен). Класически и спортен — 25€ (най-добро съотношение цена-качество). Ароматерапия — 30€ (премиум изживяване).' },
    { name: 'Помислете за времето', text: 'Имате 40 минути → антицелулитен масаж или масаж на гръб. Имате 60 минути → класически, спортен масаж или ароматерапия.' },
    { name: 'Консултирайте се с професионалист', text: 'Обадете се на +359 988 926 120. Нашите сертифицирани терапевти ще ви зададат няколко въпроса и ще препоръчат най-подходящия масаж за вашите нужди.' },
    { name: 'Запазете час и се насладете', text: 'Резервирайте онлайн или по телефона. Пристигнете 5 минути по-рано, отпуснете се и оставете грижите на нас.' },
  ]
);

export default function MassageComparisonPage() {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();

  useSeo(useMemo(() => ({
    title: 'Видове масажи — сравнение, цени и препоръки | NP Massage Studio',
    description: 'Пълно сравнение на всички видове масажи в NP Massage Studio. Класически, спортен, антицелулитен масаж, ароматерапия и масаж на гръб — цени, продължителност и за кого са подходящи.',
    canonical: '/videos-masazhi',
    lastModified: '2026-06-08',
    hreflangs: [
      { lang: 'bg', url: '/videos-masazhi' },
      { lang: 'x-default', url: '/videos-masazhi' },
    ],
    og: {
      title: 'Видове масажи — сравнение и цени | NP Massage Studio',
      description: 'Класически, спортен, антицелулитен масаж, ароматерапия и масаж на гръб — сравнение, цени и препоръки от NP Massage Studio.',
      type: 'website',
      locale: 'bg_BG',
    },
    schemas: [
      buildWebPageSchema('Видове масажи — сравнение и цени | NP Massage Studio', 'Пълно сравнение на всички видове масажи с цени, продължителност и препоръки.', '/videos-masazhi', 'Article'),
      buildBreadcrumbSchema([
        { name: 'Начало', url: '/' },
        { name: 'Видове масажи', url: '/videos-masazhi' },
      ]),
      buildLocalBusinessSchema(),
      buildFaqSchema(COMPARISON_FAQ),
      HOWTO_CHOOSE,
    ],
  }), []));

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 md:mb-16">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
                Видове масажи — пълно сравнение
              </h1>
              <p className="text-base text-foreground-600 max-w-3xl leading-relaxed mb-3">
                Изборът на правилния масаж може да бъде объркващ. В NP Massage Studio предлагаме пет различни вида масажи —
                всеки със своите уникални ползи, техники и предназначение. Това ръководство ще ви помогне да изберете
                най-подходящия масаж според вашите нужди, бюджет и начин на живот.
              </p>
              <p className="text-sm text-foreground-500 max-w-3xl leading-relaxed">
                Всички процедури се изпълняват от сертифицирани терапевти в нашите две локации — Велико Търново и Павликени.
                Работим всеки ден от седмицата, включително събота и неделя.
              </p>
            </div>

            <ComparisonTable />
            <DetailCards />
            <HowToChoose />
            <WhichMassageForYou />

            <div className="mb-14 md:mb-18">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                  Често задавани въпроси
                </h2>
                <p className="text-sm text-foreground-600">Всичко, което трябва да знаете преди да запазите час</p>
              </div>
              <FaqAccordion items={COMPARISON_FAQ.map((item) => ({ q: item.q, a: item.a }))} />
            </div>

            <CtaBanner />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ComparisonTable() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div ref={ref} className={`mb-14 md:mb-18 overflow-x-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        Сравнителна таблица на услугите
      </h2>
      <div className="bg-background-100 rounded-2xl border border-background-200/70 overflow-hidden min-w-[700px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-background-200/70 bg-background-100">
              <th className="text-left p-4 font-semibold text-foreground-900">Услуга</th>
              <th className="text-left p-4 font-semibold text-foreground-900">Цена</th>
              <th className="text-left p-4 font-semibold text-foreground-900">Време</th>
              <th className="text-left p-4 font-semibold text-foreground-900">Интензивност</th>
              <th className="text-left p-4 font-semibold text-foreground-900">Най-подходящ за</th>
            </tr>
          </thead>
          <tbody>
            {MASSAGE_TYPES.map((type, i) => (
              <tr key={type.id} className={`border-b border-background-200/70 last:border-b-0 ${i % 2 === 0 ? 'bg-background-50' : 'bg-background-100'}`}>
                <td className="p-4 font-medium text-foreground-900">{type.name}</td>
                <td className="p-4 text-primary-600 font-semibold">{type.price}</td>
                <td className="p-4 text-foreground-700">{type.duration}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    type.intensity.includes('Висока') ? 'bg-accent-100 text-accent-800' :
                    type.intensity.includes('Ниска') ? 'bg-secondary-100 text-secondary-800' :
                    'bg-primary-100 text-primary-800'
                  }`}>
                    {type.intensity}
                  </span>
                </td>
                <td className="p-4 text-foreground-600 text-xs leading-relaxed">{type.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailCards() {
  const { handleNav } = useLocalizedNav();

  return (
    <div className="mb-14 md:mb-18">
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        Детайлно описание на всеки масаж
      </h2>
      <div className="space-y-5">
        {MASSAGE_TYPES.map((type, i) => (
          <MassageDetailCard key={type.id} type={type} index={i} onNavigate={handleNav} />
        ))}
      </div>
    </div>
  );
}

function MassageDetailCard({ type, index, onNavigate }: { type: typeof MASSAGE_TYPES[0]; index: number; onNavigate: (path: string) => void }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`bg-background-100 rounded-2xl p-5 md:p-7 border border-background-200/70 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-5">
        <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-accent-100 rounded-2xl">
          <i className={`${type.icon} text-accent-600 text-2xl md:text-3xl`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground-950">{type.name}</h3>
            <span className="text-base font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full self-start sm:self-auto">{type.price}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-foreground-500 bg-background-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <i className="ri-time-line" /> {type.duration}
            </span>
            <span className="text-xs text-foreground-500 bg-background-50 px-2.5 py-1 rounded-full">
              {type.intensity}
            </span>
            <span className="text-xs text-foreground-500 bg-background-50 px-2.5 py-1 rounded-full">
              {type.bestFor}
            </span>
          </div>
          <p className="text-sm text-foreground-600 leading-relaxed mb-4">{type.description}</p>
          <button
            onClick={() => onNavigate(`/uslugi/${type.slug}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
          >
            Научи повече
            <i className="ri-arrow-right-line" />
          </button>
        </div>
      </div>
    </div>
  );
}

function HowToChoose() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div ref={ref} className={`bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70 mb-14 md:mb-18 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        Как да изберете правилния масаж — 5 стъпки
      </h2>
      <div className="space-y-4">
        {[
          { step: '1', title: 'Определете целта си', desc: 'Релаксация и облекчаване на стреса → класически масаж или ароматерапия. Мускулни болки и спортно възстановяване → спортен масаж. Подобряване на кожата → антицелулитен масаж. Конкретни болки в гърба → частичен масаж на гръб.' },
          { step: '2', title: 'Определете бюджета си', desc: '15€ за масаж на гръб (40 мин) — най-достъпен вариант. 20€ за антицелулитен масаж. 25€ за класически или спортен — отлично съотношение цена-качество. 30€ за ароматерапия — премиум изживяване с етерични масла.' },
          { step: '3', title: 'Помислете за времето', desc: 'Разполагате с 40 минути → изберете антицелулитен масаж или масаж на гръб. Имате цял час → класически, спортен или ароматерапия са вашият избор.' },
          { step: '4', title: 'Консултирайте се с терапевт', desc: 'Не сте сигурни? Обадете ни се на +359 988 926 120. Нашите сертифицирани терапевти ще ви зададат няколко целенасочени въпроса и ще ви препоръчат най-подходящия масаж — безплатно и без ангажимент.' },
          { step: '5', title: 'Запазете час и се насладете', desc: 'След като сте избрали, резервирайте онлайн или по телефона. Пристигнете 5 минути по-рано в избраната локация, отпуснете се и се насладете на професионален масаж от сертифициран терапевт.' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-8 h-8 flex items-center justify-center bg-primary-500 text-background-50 rounded-full flex-shrink-0 text-sm font-bold">
              {item.step}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground-900 mb-1">{item.title}</h4>
              <p className="text-sm text-foreground-600 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhichMassageForYou() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { handleNav } = useLocalizedNav();

  const scenarios = [
    { who: 'Седяща работа и болки в гърба', icon: 'ri-computer-line', recommendation: 'Частичен масаж на гръб', reason: 'Фокусира се точно върху зоните, които страдат от продължително седене — гръб, рамене, врат. Само 40 минути за бързо облекчение.', slug: 'masazh-na-grab' },
    { who: 'Спортисти и активни хора', icon: 'ri-run-line', recommendation: 'Спортен масаж', reason: 'Дълбока тъканна терапия за възстановяване след тренировка, подобряване на гъвкавостта и превенция на спортни травми.', slug: 'sporten-masazh' },
    { who: 'Стрес и напрежение', icon: 'ri-mental-health-line', recommendation: 'Класически масаж или Ароматерапия', reason: 'Класическият масаж редуцира кортизола (хормона на стреса). Ароматерапията добавя силата на етеричните масла за пълно сетивно изживяване.', slug: 'klasicheski-masazh' },
    { who: 'Подобряване на кожата', icon: 'ri-women-line', recommendation: 'Антицелулитен масаж', reason: 'Стимулира микроциркулацията и лимфния дренаж. Препоръчва се курс от 10 процедури за видими и трайни резултати.', slug: 'anticeluliten-masazh' },
    { who: 'Подарък за любим човек', icon: 'ri-gift-line', recommendation: 'Ароматерапия или Класически масаж', reason: 'И двете са идеален подарък — релаксиращи, приятни и подходящи за всеки. Предлагаме и подаръчни ваучери.', slug: 'aromaterapiya' },
  ];

  return (
    <div ref={ref} className={`mb-14 md:mb-18 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        Кой масаж е за вас?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((s, i) => (
          <div key={i} className="bg-background-100 rounded-2xl p-5 border border-background-200/70 hover:border-primary-300/60 transition-all duration-300 group">
            <div className="w-10 h-10 flex items-center justify-center bg-accent-100 rounded-xl mb-3">
              <i className={`${s.icon} text-accent-600 text-lg`} />
            </div>
            <p className="text-sm font-semibold text-foreground-900 mb-1">{s.who}</p>
            <p className="text-xs text-primary-600 font-medium mb-2">{s.recommendation}</p>
            <p className="text-xs text-foreground-600 leading-relaxed mb-3">{s.reason}</p>
            <button
              onClick={() => handleNav(`/uslugi/${s.slug}`)}
              className="text-xs text-accent-600 font-medium hover:text-accent-700 transition-colors cursor-pointer flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Към услугата <i className="ri-arrow-right-line text-[10px]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}