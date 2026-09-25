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

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const { isEn } = useLocalizedNav();

  useSeo(useMemo(() => ({
    title: isEn ? 'Privacy Policy | NP Massage Studio' : 'Политика за поверителност | NP Massage Studio',
    description: isEn
      ? 'Privacy Policy of NP Massage Studio. How we collect, use and protect your personal data. GDPR compliant. Contact: +359 988 926 120.'
      : 'Политика за поверителност на NP Massage Studio. Как събираме, използваме и защитаваме вашите лични данни съгласно GDPR. Контакт: +359 988 926 120.',
    canonical: '/politika-poveritelnost',
    lastModified: '2026-06-08',
    hreflangs: [
      { lang: 'bg', url: '/politika-poveritelnost' },
      { lang: 'en', url: '/en/privacy' },
      { lang: 'x-default', url: '/politika-poveritelnost' },
    ],
    schemas: [
      buildWebPageSchema(
        isEn ? 'Privacy Policy | NP Massage Studio' : 'Политика за поверителност | NP Massage Studio',
        isEn ? 'Privacy Policy — GDPR compliant.' : 'Политика за поверителност — съответствие с GDPR.',
        '/politika-poveritelnost'
      ),
      buildBreadcrumbSchema([
        { name: 'Начало', url: '/' },
        { name: isEn ? 'Privacy Policy' : 'Политика за поверителност' },
      ]),
      buildLocalBusinessSchema(),
    ],
  }), [isEn]));

  const content = isEn ? (
    <div className="space-y-6 text-sm text-foreground-700 leading-relaxed">
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">1. Data Controller</h2>
        <p>NP Massage Studio, with business locations in Veliko Tarnovo and Pavlikeni, Bulgaria, is the data controller responsible for your personal data. Contact: +359 988 926 120, npmassagestudiopv@gmail.com.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">2. What Data We Collect</h2>
        <p>We collect only the data necessary for providing our massage services: name, phone number, email address, chosen service, preferred location, and appointment date. This data is collected via our booking and contact forms.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">3. Purpose of Processing</h2>
        <p>Your data is used exclusively for: confirming and managing appointments, contacting you regarding your booking, and improving our services. We do not use your data for marketing without explicit consent.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">4. Legal Basis</h2>
        <p>The legal basis for processing your data is the necessity for the performance of a contract (providing massage services) and your explicit consent given via our forms.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">5. Data Storage</h2>
        <p>Your personal data is stored securely in our Supabase database with encryption and access controls. Data is retained for 24 months after your last appointment, after which it is automatically deleted.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">6. Your Rights</h2>
        <p>Under GDPR, you have the right to: access your data, request correction, request deletion (right to be forgotten), restrict processing, object to processing, and data portability. Contact us to exercise these rights.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">7. Cookies</h2>
        <p>We use cookies only for essential website functionality. Analytics and marketing cookies are optional and require your consent. See our <a href="/politika-biskvitki" className="text-primary-600 underline">Cookie Policy</a>.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">8. Third Parties</h2>
        <p>We do not sell or share your personal data with third parties. Your data is processed only by NP Massage Studio and our secure hosting provider (Supabase).</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">9. Changes</h2>
        <p>We may update this policy from time to time. Last updated: June 3, 2026.</p>
      </section>
    </div>
  ) : (
    <div className="space-y-6 text-sm text-foreground-700 leading-relaxed">
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">1. Администратор на данни</h2>
        <p>NP Massage Studio, с локации във Велико Търново и Павликени, България, е администратор на лични данни. Контакт: +359 988 926 120, npmassagestudiopv@gmail.com.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">2. Какви данни събираме</h2>
        <p>Събираме само данни, необходими за предоставяне на масажни услуги: име, телефон, имейл, избрана услуга, предпочитана локация и дата на час. Данните се събират чрез формите за резервация и контакт.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">3. Цел на обработката</h2>
        <p>Вашите данни се използват единствено за: потвърждаване и управление на часове, свързване с вас относно резервацията и подобряване на услугите. Не използваме данните за маркетинг без изрично съгласие.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">4. Правно основание</h2>
        <p>Правното основание за обработка е необходимост за изпълнение на договор (предоставяне на масажни услуги) и вашето изрично съгласие, дадено чрез формите.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">5. Съхранение на данни</h2>
        <p>Личните данни се съхраняват сигурно в база данни Supabase с криптиране и контрол на достъпа. Данните се пазят 24 месеца след последния час, след което се изтриват автоматично.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">6. Вашите права</h2>
        <p>Съгласно GDPR имате право на: достъп до данни, корекция, изтриване (право да бъдете забравени), ограничаване на обработката, възражение и преносимост. Свържете се с нас за упражняване на правата.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">7. Бисквитки</h2>
        <p>Използваме бисквитки само за основна функционалност. Аналитичните и маркетинговите бисквитки са опционални и изискват вашето съгласие. Вижте <a href="/politika-biskvitki" className="text-primary-600 underline">Политиката за бисквитки</a>.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">8. Трети страни</h2>
        <p>Не продаваме и не споделяме лични данни с трети страни. Данните се обработват само от NP Massage Studio и нашия сигурен хостинг доставчик (Supabase).</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">9. Промени</h2>
        <p>Може да актуализираме тази политика периодично. Последна актуализация: 3 юни 2026.</p>
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
              {isEn ? 'Privacy Policy' : 'Политика за поверителност'}
            </h1>
            {content}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}