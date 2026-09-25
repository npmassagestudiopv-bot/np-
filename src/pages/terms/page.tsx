import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useSeo } from '@/hooks/useSeo';
import {
  buildWebPageSchema,
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
} from '@/lib/seoSchemas';

export default function TermsPage() {
  const { t } = useTranslation();
  const { isEn } = useLocalizedNav();

  useSeo(useMemo(() => ({
    title: isEn ? 'Terms of Service | NP Massage Studio' : 'Общи условия | NP Massage Studio',
    description: isEn
      ? 'Terms and conditions of using NP Massage Studio website and services. Governed by Bulgarian and EU law.'
      : 'Общи условия за използване на сайта и услугите на NP Massage Studio. Урежда се от законите на Република България и ЕС.',
    canonical: '/obshti-usloviya',
    lastModified: '2026-06-08',
    hreflangs: [
      { lang: 'bg', url: '/obshti-usloviya' },
      { lang: 'en', url: '/en/terms' },
      { lang: 'x-default', url: '/obshti-usloviya' },
    ],
    schemas: [
      buildWebPageSchema(
        isEn ? 'Terms of Service | NP Massage Studio' : 'Общи условия | NP Massage Studio',
        isEn ? 'Terms of service for NP Massage Studio.' : 'Общи условия на NP Massage Studio.',
        '/obshti-usloviya'
      ),
      buildBreadcrumbSchema([
        { name: 'Начало', url: '/' },
        { name: isEn ? 'Terms of Service' : 'Общи условия' },
      ]),
      buildLocalBusinessSchema(),
    ],
  }), [isEn]));

  const content = isEn ? (
    <div className="space-y-6 text-sm text-foreground-700 leading-relaxed">
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">1. General Provisions</h2>
        <p>These terms govern the use of the NP Massage Studio website and the booking of massage services. By using the website or booking a service, you agree to these terms.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">2. Services</h2>
        <p>NP Massage Studio provides professional massage services in Veliko Tarnovo and Pavlikeni. All services are performed by qualified therapists. The studio reserves the right to refuse service if health conditions contraindicate massage.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">3. Booking and Cancellation</h2>
        <p>Appointments can be made via the website form, phone, or in person. Cancellations should be made at least 4 hours before the scheduled appointment. Late cancellations or no-shows may result in forfeiture of the appointment.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">4. Payment</h2>
        <p>Payment is made on-site after the service. We accept cash and card payments. Prices are listed on the website and may be subject to change with notice.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">5. Health and Safety</h2>
        <p>Clients must inform the therapist of any health conditions, allergies, or pregnancy. The studio is not liable for undisclosed health conditions. All products used are natural and hypoallergenic.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">6. Intellectual Property</h2>
        <p>All content on this website, including text, images, and logos, is the property of NP Massage Studio and may not be used without permission.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">7. Governing Law</h2>
        <p>These terms are governed by the laws of the Republic of Bulgaria and the European Union. Disputes are subject to Bulgarian jurisdiction.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">8. Changes</h2>
        <p>These terms may be updated at any time. Last updated: June 3, 2026.</p>
      </section>
    </div>
  ) : (
    <div className="space-y-6 text-sm text-foreground-700 leading-relaxed">
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">1. Общи положения</h2>
        <p>Тези общи условия уреждат използването на сайта на NP Massage Studio и резервирането на масажни услуги. С използването на сайта или резервиране на услуга, вие приемате тези условия.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">2. Услуги</h2>
        <p>NP Massage Studio предоставя професионални масажни услуги във Велико Търново и Павликени. Всички услуги се изпълняват от квалифицирани терапевти. Студиото си запазва правото да откаже услуга при противопоказания за масаж.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">3. Резервация и отказ</h2>
        <p>Часовете се запазват чрез формата на сайта, по телефон или на място. Отказът трябва да се направи най-малко 4 часа преди часа. Късни откази или неявяване могат да доведат до загуба на часа.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">4. Плащане</h2>
        <p>Плащането се извършва на място след услугата. Приемаме пари в брой и карти. Цените са посочени на сайта и могат да се променят с предизвестие.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">5. Здраве и безопасност</h2>
        <p>Клиентите трябва да информират терапевта за здравословни състояния, алергии или бременност. Студиото не носи отговорност за неразкрити здравословни проблеми. Всички продукти са натурални и хипоалергенни.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">6. Интелектуална собственост</h2>
        <p>Всичко съдържание на сайта, включително текст, снимки и лога, е собственост на NP Massage Studio и не може да се използва без разрешение.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">7. Приложимо право</h2>
        <p>Тези условия се уреждат от законите на Република България и Европейския съюз. Споровете подлежат на българска юрисдикция.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">8. Промени</h2>
        <p>Тези условия могат да се актуализират по всяко време. Последна актуализация: 3 юни 2026.</p>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950 mb-8">
              {isEn ? 'Terms of Service' : 'Общи условия'}
            </h1>
            {content}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}