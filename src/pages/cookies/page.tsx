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

export default function CookiePolicyPage() {
  const { t } = useTranslation();
  const { isEn } = useLocalizedNav();

  useSeo(useMemo(() => ({
    title: isEn ? 'Cookie Policy | NP Massage Studio' : 'Политика за бисквитки | NP Massage Studio',
    description: isEn
      ? 'Cookie Policy of NP Massage Studio. What cookies we use and how to manage them. GDPR compliant.'
      : 'Политика за бисквитки на NP Massage Studio. Какви бисквитки използваме и как да ги управлявате. GDPR съответствие.',
    canonical: '/politika-biskvitki',
    lastModified: '2026-06-08',
    hreflangs: [
      { lang: 'bg', url: '/politika-biskvitki' },
      { lang: 'en', url: '/en/cookies' },
      { lang: 'x-default', url: '/politika-biskvitki' },
    ],
    schemas: [
      buildWebPageSchema(
        isEn ? 'Cookie Policy | NP Massage Studio' : 'Политика за бисквитки | NP Massage Studio',
        isEn ? 'Cookie Policy — GDPR compliant.' : 'Политика за бисквитки — GDPR съответствие.',
        '/politika-biskvitki'
      ),
      buildBreadcrumbSchema([
        { name: 'Начало', url: '/' },
        { name: isEn ? 'Cookie Policy' : 'Политика за бисквитки' },
      ]),
      buildLocalBusinessSchema(),
    ],
  }), [isEn]));

  const content = isEn ? (
    <div className="space-y-6 text-sm text-foreground-700 leading-relaxed">
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">1. What Are Cookies</h2>
        <p>Cookies are small text files placed on your device when you visit a website. They help the website function properly and improve user experience.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">2. Types of Cookies We Use</h2>
        <p><strong>Necessary cookies:</strong> Essential for the website to function. These cannot be disabled. They enable core features like navigation, form submission, and cookie consent management.</p>
        <p className="mt-2"><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information. We use this data to improve our services.</p>
        <p className="mt-2"><strong>Marketing cookies:</strong> Used to track visitors across websites for displaying relevant advertisements. Currently not actively used.</p>
        <p className="mt-2"><strong>Preference cookies:</strong> Remember your settings and choices (like language preference) to provide a personalized experience.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">3. How to Manage Cookies</h2>
        <p>You can manage your cookie preferences through our cookie banner when you first visit the site. You can also control cookies through your browser settings. Most browsers allow you to refuse or delete cookies.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">4. Cookie Storage</h2>
        <p>Cookie consent data is stored locally on your device. Consent records are also stored in our secure database for compliance purposes. No personal data is linked to cookie consent records.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">5. Changes</h2>
        <p>This cookie policy may be updated. Last updated: June 3, 2026.</p>
      </section>
    </div>
  ) : (
    <div className="space-y-6 text-sm text-foreground-700 leading-relaxed">
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">1. Какво са бисквитки</h2>
        <p>Бисквитките са малки текстови файлове, които се поставят на вашето устройство при посещение на сайт. Те помагат на сайта да работи правилно и подобряват потребителското изживяване.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">2. Видове бисквитки, които използваме</h2>
        <p><strong>Необходими бисквитки:</strong> Задължителни за работата на сайта. Не могат да се изключат. Осигуряват основни функции като навигация, изпращане на форми и управление на съгласието.</p>
        <p className="mt-2"><strong>Аналитични бисквитки:</strong> Помагат ни да разберем как посетителите взаимодействат с сайта, като събират анонимна информация. Използваме данните за подобряване на услугите.</p>
        <p className="mt-2"><strong>Маркетингови бисквитки:</strong> Използват се за проследяване на посетители между сайтове за показване на релевантни реклами. В момента не се използват активно.</p>
        <p className="mt-2"><strong>Предпочитания бисквитки:</strong> Запомнят вашите настройки и избори (като език) за персонализирано изживяване.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">3. Как да управлявате бисквитки</h2>
        <p>Можете да управлявате предпочитанията си чрез банера за бисквитки при първото посещение. Можете също да контролирате бисквитките чрез настройките на браузъра. Повечето браузъри позволяват отказ или изтриване на бисквитки.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">4. Съхранение на бисквитки</h2>
        <p>Данните за съгласие се съхраняват локално на вашето устройство. Записите за съгласие се пазят и в нашата сигурна база данни за спазване на изискванията. Не се свързват лични данни със записите за съгласие.</p>
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-2">5. Промени</h2>
        <p>Тази политика може да се актуализира. Последна актуализация: 3 юни 2026.</p>
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
              {isEn ? 'Cookie Policy' : 'Политика за бисквитки'}
            </h1>
            {content}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}