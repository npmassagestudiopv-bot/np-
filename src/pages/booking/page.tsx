import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import FaqAccordion from '@/components/feature/FaqAccordion';
import BookingHero from './components/BookingHero';
import BookingForm from './components/BookingForm';
import BookingInfo from './components/BookingInfo';
import { useSeo } from '@/hooks/useSeo';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildServiceChannelSchema,
  buildFaqSchema,
  buildWebPageSchema,
  buildHowToSchema,
  buildProductSchema,
} from '@/lib/seoSchemas';

const FAQ_BOOKING = [
  { q: 'Как да запазя час за масаж?', a: 'Попълнете формата на тази страница с вашите данни, изберете услуга, локация, дата и час. Ще потвърдим резервацията по телефон в рамките на 2 часа.' },
  { q: 'Трябва ли предварително записване?', a: 'Да, препоръчваме предварително записване за по-добра организация и персонализирано обслужване. Можете да запазите час онлайн или по телефон на +359 988 926 120.' },
  { q: 'Мога ли да отменя или променя резервация?', a: 'Да, можете да отмените или промените часа си най-малко 4 часа преди уговорения час. Свържете се с нас на +359 988 926 120.' },
  { q: 'Какви са работните часове на NP Massage Studio?', a: 'Работим всеки ден: Понеделник–Петък 09:00–19:00, Събота 09:00–17:00, Неделя 10:00–16:00.' },
  { q: 'Колко струва един масаж?', a: 'Цените варират от 15 € за частичен масаж на гръб до 30 € за ароматерапия. Класическият и спортният масаж са по 25 € за 60 минути.' },
  { q: 'Колко време предварително трябва да запазя час?', a: 'Препоръчваме да запазите час поне 24 часа предварително, за да сме сигурни, че ще имаме свободен терапевт за вас.' },
];

const HOWTO_STEPS = [
  { name: 'Попълнете контактните данни', text: 'Въведете вашето име, телефон и имейл адрес в първата стъпка на формата.' },
  { name: 'Изберете масажна услуга', text: 'Кликнете върху желаната услуга от петте налични опции: класически, спортен, антицелулитен масаж, ароматерапия или масаж на гръб.' },
  { name: 'Изберете локация', text: 'NP Massage Studio има два салона — във Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10).' },
  { name: 'Изберете дата и час', text: 'Изберете удобна дата от календара и свободен час от наличните времеви слотове.' },
  { name: 'Потвърдете резервацията', text: 'Кликнете бутона "Запази час" и очаквайте телефонно потвърждение в рамките на 2 часа.' },
];

export default function BookingPage() {
  const { t } = useTranslation();
  const { isEn } = useLocalizedNav();

  useSeo(useMemo(() => ({
    title: 'Запази час за масаж | NP Massage Studio — 15–30 €',
    description: 'Онлайн резервация за масаж безплатно и без регистрация. Изберете услуга 15–30 €, дата и час — получавате потвърждение веднага. Класически, спортен, антицелулитен масаж, ароматерапия и масаж на гръб. Тел: +359 988 926 120.',
    canonical: isEn ? '/en/booking' : '/rezervaciya',
    lastModified: '2026-08-06',
    keywords: 'запази час масаж, резервация масаж Велико Търново, онлайн резервация масаж Павликени, масажен салон записване, час за масаж',
    hreflangs: [
      { lang: 'bg', url: '/rezervaciya' },
      { lang: 'en', url: '/en/booking' },
      { lang: 'x-default', url: '/rezervaciya' },
    ],
    og: {
      title: 'Запази час за масаж | NP Massage Studio — 15–30 €',
      description: 'Онлайн резервация за масаж 15–30 € — Велико Търново и Павликени. Тел: +359 988 926 120.',
      type: 'website',
      locale: 'bg_BG',
      localeAlternate: ['en_US'],
    },
    schemas: [
      buildWebPageSchema('Запази час | NP Massage Studio', 'Онлайн форма за резервация на масаж във Велико Търново и Павликени. 5+ вида масажи 15–30 €. Безплатна резервация с потвърждение по телефон.', '/rezervaciya', 'WebPage'),
      buildBreadcrumbSchema([{ name: 'Начало', url: '/' }, { name: 'Запази час', url: '/rezervaciya' }]),
      buildLocalBusinessSchema(),
      buildServiceChannelSchema(),
      buildFaqSchema(FAQ_BOOKING),
      buildHowToSchema(
        'Как да запазя час за масаж в NP Massage Studio',
        'Стъпка по стъпка ръководство за онлайн резервация на масаж в NP Massage Studio — Велико Търново и Павликени.',
        HOWTO_STEPS
      ),
      buildProductSchema('Класически и релаксиращ масаж', 'Традиционна техника за релаксиране на мускулите. 60 минути.', '25', 'EUR'),
      buildProductSchema('Спортен и терапевтичен масаж', 'Целенасочена терапия за спортисти. 60 минути.', '25', 'EUR'),
      buildProductSchema('Антицелулитен масаж', 'Ефективна процедура за гладка кожа. 40 минути.', '20', 'EUR'),
      buildProductSchema('Ароматерапия', 'Съчетание на масаж и етерични масла. 60 минути.', '30', 'EUR'),
      buildProductSchema('Частичен масаж на гръб', 'Целенасочена терапия за гърба. 40 минути.', '15', 'EUR'),
    ],
  }), [isEn]));

  const breadcrumbItems = [
    { label: t('breadcrumbHome'), path: '/' },
    { label: t('bookingTitle') || 'Запази час' },
  ];

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main id="main-content">
        <BookingHero />

        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">
              <div className="lg:col-span-3">
                <BookingForm />
              </div>
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-28">
                  <BookingInfo />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 md:px-6 lg:px-10 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                {t('faqTitle') || 'Често задавани въпроси'}
              </h2>
              <p className="text-sm text-foreground-600">Отговори на най-популярните въпроси за резервации и масажи</p>
            </div>
            <FaqAccordion items={FAQ_BOOKING.map((item) => ({ q: item.q, a: item.a }))} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}