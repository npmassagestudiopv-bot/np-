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
  buildLocalBusinessVtSchema,
  buildLocalBusinessPvSchema,
  buildPlaceSchema,
  buildMapSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from '@/lib/seoSchemas';

const FAQ_LOCATIONS = [
  { q: 'Как да намеря NP Massage Studio във Велико Търново?', a: 'NP Massage Studio се намира на бул. България 72, Велико Търново 5000. Лесно достъпно с удобен паркинг в близост. Можете да ни намерите и на Google Maps — търсете NP Massage Studio.' },
  { q: 'Как да намеря NP Massage Studio в Павликени?', a: 'NP Massage Studio в Павликени се намира на ул. Атанас Дончев 10, Павликени 5200. Централна локация в сърцето на Павликени, с удобен достъп и паркинг.' },
  { q: 'Има ли паркинг на двете локации?', a: 'Да, и двете локации разполагат с удобен паркинг в близост. Велико Търново е на бул. България 72, Павликени е на ул. Атанас Дончев 10. И двете имат лесен достъп.' },
  { q: 'Могат ли клиенти от Велико Търново да посетят Павликени?', a: 'Да, разстоянието между двата града е около 40 километра. Предлагаме еднакво качество на услугите и в двете локации. Много клиенти избират локация според графика си.' },
  { q: 'Какви са работните часове на двата салона?', a: 'И двата салона работят с еднакво работно време: Понеделник–Петък 09:00–19:00, Събота 09:00–17:00, Неделя 10:00–16:00. Препоръчваме предварително записване.' },
  { q: 'Как да стигна до NP Massage Studio с градски транспорт?', a: 'И двата салона са лесно достъпни. Във Велико Търново — автобусни спирки на бул. България. В Павликени — централна локация на пешеходно разстояние от автогарата. Обадете ни се на +359 988 926 120 за упътване.' },
];

export default function LocationsPage() {
  const { t } = useTranslation();
  const { isEn } = useLocalizedNav();

  useSeo(useMemo(() => ({
    title: 'Локации | NP Масажно студио — Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10)',
    description: 'Две локации на NP Масажно студио: Велико Търново на бул. България 72 и Павликени на ул. Атанас Дончев 10. Обслужваме клиенти от Габрово, Севлиево, Горна Оряховица, Лясковец. Телефон: +359 988 926 120.',
    keywords: 'масажно студио локации, масаж Велико Търново адрес, масаж Павликени адрес, NP Масажно студио карта, масаж Габрово, масаж Горна Оряховица, масаж Севлиево',
    canonical: isEn ? '/en/locations' : '/lokacii',
    lastModified: '2026-06-08',
    hreflangs: [
      { lang: 'bg', url: '/lokacii' },
      { lang: 'en', url: '/en/locations' },
      { lang: 'x-default', url: '/lokacii' },
    ],
    og: {
      title: 'Локации | NP Massage Studio',
      description: 'Две локации: Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10). Тел: +359 988 926 120.',
    },
    schemas: [
      buildWebPageSchema('Локации | NP Massage Studio', 'Намерете ни във Велико Търново и Павликени.', '/lokacii'),
      buildBreadcrumbSchema([{ name: 'Начало', url: '/' }, { name: 'Локации', url: '/lokacii' }]),
      buildLocalBusinessVtSchema(),
      buildLocalBusinessPvSchema(),
      buildPlaceSchema(
        'NP Massage Studio — Велико Търново',
        'бул. България 72, Велико Търново',
        '43.08103687090604',
        '25.612733413492446'
      ),
      buildPlaceSchema(
        'NP Massage Studio — Павликени',
        'ул. Атанас Дончев 10, Павликени',
        '43.23929045147203',
        '25.30764655569994'
      ),
      buildMapSchema(),
      buildFaqSchema(FAQ_LOCATIONS),
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
                {t('locationsTitle')}
              </h1>
              <p className="text-base text-foreground-600 mb-4 max-w-2xl leading-relaxed">
                {t('locationsSubtitle')}
              </p>
              <p className="text-sm text-foreground-500 max-w-2xl leading-relaxed">
                {t('locationsIntro')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
              <LocationCard
                title={t('locationVtTitle')}
                address={t('locationVtAddress')}
                desc={t('locationVtDesc')}
                features={t('locationVtFeatures')}
                mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2913.0!2d25.612733413492446!3d43.08103687090604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a927b124cc50df:0x527bf18671441e41!2sNP+Massage+Studio!5e0!3m2!1sen!2sbg!4v1700000000000"
                mapTitle="NP Massage Studio — бул. България 72, Велико Търново 5000"
                directionsUrl="https://www.google.com/maps/place/NP+Massage+Studio+%7C+%D0%9C%D0%B0%D1%81%D0%B0%D0%B6%D0%BD%D0%BE+%D1%81%D1%82%D1%83%D0%B4%D0%B8%D0%BE+%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE+%D0%A2%D1%8A%D1%80%D0%BD%D0%BE%D0%B2%D0%BE/@43.080935,25.6127656,17z"
              />
              <LocationCard
                title={t('locationPvTitle')}
                address={t('locationPvAddress')}
                desc={t('locationPvDesc')}
                features={t('locationPvFeatures')}
                mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2913.0!2d25.30764655569994!3d43.23929045147203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87012a3b8474bd79:0x63759dc2c2e5a392!2sNP+Massage+Studio+Pavlikeni!5e0!3m2!1sen!2sbg!4v1700000000000"
                mapTitle="NP Massage Studio — ул. Атанас Дончев 10, Павликени 5200"
                directionsUrl="https://www.google.com/maps/dir/NP+Massage+Studio+Pavlikeni,+%D0%A6%D0%B5%D0%BD%D1%82%D1%8A%D1%80,+%D1%83%D0%BB.+%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81+%D0%94%D0%BE%D0%BD%D1%87%D0%B5%D0%B2+10,+5200+%D0%9F%D0%B0%D0%B2%D0%BB%D0%B8%D0%BA%D0%B5%D0%BD%D0%B8/@43.2363828,25.2975614,15z"
              />
            </div>

            <LocationInfo />

            {/* Service Area Section */}
            <div className="bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70 mb-16 md:mb-20">
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-2">
                Градове, които обслужваме
              </h3>
              <p className="text-sm text-foreground-600 mb-6 leading-relaxed">
                NP Massage Studio разполага с два физически салона — във Велико Търново и Павликени. От тези две локации обслужваме клиенти от целия регион. Ето пълния списък с градовете, от които приемаме клиенти:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-background-50 rounded-xl p-4 border border-primary-200/60">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-building-2-line text-primary-500" />
                    <span className="text-sm font-semibold text-foreground-900">Велико Търново</span>
                  </div>
                  <span className="text-xs text-primary-600 font-medium">Наш салон — бул. България 72</span>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-primary-200/60">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-building-2-line text-primary-500" />
                    <span className="text-sm font-semibold text-foreground-900">Павликени</span>
                  </div>
                  <span className="text-xs text-primary-600 font-medium">Наш салон — ул. Атанас Дончев 10</span>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-secondary-200/60">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-car-line text-secondary-500" />
                    <span className="text-sm font-semibold text-foreground-900">Габрово</span>
                  </div>
                  <span className="text-xs text-secondary-600 font-medium">Обслужван град — 45 мин до В. Търново</span>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-secondary-200/60">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-car-line text-secondary-500" />
                    <span className="text-sm font-semibold text-foreground-900">Горна Оряховица</span>
                  </div>
                  <span className="text-xs text-secondary-600 font-medium">Обслужван град — 15 мин до В. Търново</span>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-secondary-200/60">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-car-line text-secondary-500" />
                    <span className="text-sm font-semibold text-foreground-900">Лясковец</span>
                  </div>
                  <span className="text-xs text-secondary-600 font-medium">Обслужван град — 15 мин до В. Търново</span>
                </div>
                <div className="bg-background-50 rounded-xl p-4 border border-secondary-200/60">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-car-line text-secondary-500" />
                    <span className="text-sm font-semibold text-foreground-900">Севлиево</span>
                  </div>
                  <span className="text-xs text-secondary-600 font-medium">Обслужван град — 30 мин до Павликени</span>
                </div>
              </div>
            </div>

            <div className="mb-16 md:mb-20">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                  {t('faqTitle')}
                </h2>
                <p className="text-sm text-foreground-600">{t('faqSubtitle')}</p>
              </div>
              <FaqAccordion items={FAQ_LOCATIONS.map((item) => ({ q: item.q, a: item.a }))} />
            </div>

            <CtaBanner />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function LocationCard({ title, address, desc, features, mapSrc, mapTitle, directionsUrl }: {
  title: string; address: string; desc: string; features: string;
  mapSrc: string; mapTitle: string; directionsUrl?: string;
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div ref={ref} className={`bg-background-100 rounded-2xl overflow-hidden border border-background-200/70 transition-all duration-700 card-hover ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <div className="p-5 md:p-6">
        <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-2">
          {title}
        </h3>
        <address className="not-italic text-sm text-foreground-700 mb-3 flex items-center gap-2">
          <i className="ri-map-pin-line text-accent-500" />
          {address}
        </address>
        <p className="text-sm text-foreground-600 mb-4 leading-relaxed">
          {desc}
        </p>
        <p className="text-xs text-foreground-500 mb-4">{features}</p>
        <div className="w-full h-48 rounded-xl overflow-hidden border border-background-200/70">
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={mapTitle}
            aria-label={mapTitle}
          />
        </div>
        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer"
          >
            <div className="w-3 h-3 flex items-center justify-center">
              <i className="ri-external-link-line" />
            </div>
            Отвори в Google Maps
          </a>
        )}
      </div>
    </div>
  );
}

function LocationInfo() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div ref={ref} className={`bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70 mb-16 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-6">
        {t('locationDirections')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground-800 mb-3">{t('footerVelikoTarnovo')}</h4>
          <ul className="space-y-2 text-sm text-foreground-600">
            <li className="flex items-center gap-2">
              <i className="ri-phone-line text-primary-500" />
              <a href="tel:+359988926120" className="text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer">+359 988 926 120</a>
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-mail-line text-primary-500" />
              <a href="mailto:npmassagestudiopv@gmail.com" className="text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer">npmassagestudiopv@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-map-pin-line text-primary-500" />
              <span>{t('locationVtAddress')}</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-time-line text-primary-500" />
              {t('footerMonFri')}
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground-800 mb-3">{t('footerPavlikeni')}</h4>
          <ul className="space-y-2 text-sm text-foreground-600">
            <li className="flex items-center gap-2">
              <i className="ri-phone-line text-primary-500" />
              <a href="tel:+359988926120" className="text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer">+359 988 926 120</a>
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-mail-line text-primary-500" />
              <a href="mailto:npmassagestudiopv@gmail.com" className="text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer">npmassagestudiopv@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-map-pin-line text-primary-500" />
              <span>{t('locationPvAddress')}</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-time-line text-primary-500" />
              {t('footerMonFri')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}