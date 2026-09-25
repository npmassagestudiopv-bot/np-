import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSeo } from '@/hooks/useSeo';

export default function NotFound() {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();

  useSeo(useMemo(() => ({
    title: '404 Страницата не е намерена | NP Massage Studio',
    description: 'Страницата не съществува. Върнете се към началото на NP Massage Studio и разгледайте нашите масажни услуги във Велико Търново и Павликени.',
    noIndex: true,
    robots: 'noindex, nofollow',
    og: {
      title: '404 Страницата не е намерена | NP Massage Studio',
      description: 'Страницата не съществува. Върнете се към началото на NP Massage Studio и разгледайте нашите масажни услуги във Велико Търново и Павликени.',
    },
    twitter: {
      title: '404 Страницата не е намерена | NP Massage Studio',
      description: 'Страницата не съществува. Върнете се към началото на NP Massage Studio и разгледайте нашите масажни услуги във Велико Търново и Павликени.',
    },
  }), []));

  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <div className="w-full px-4 md:px-6 lg:px-10 py-24 md:py-32">
          <div
            ref={ref}
            className={`max-w-lg mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <h1 className="font-heading text-6xl md:text-7xl font-semibold text-primary-500 mb-4">
              404
            </h1>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-4">
              {t('notFoundTitle')}
            </h2>
            <p className="text-base text-foreground-600 mb-8 leading-relaxed">
              {t('notFoundText')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); handleNav('/'); }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 cursor-pointer btn-premium"
              >
                <i className="ri-arrow-left-line" />
                {t('notFoundBack')}
              </a>
              <a
                href="/uslugi"
                onClick={(e) => { e.preventDefault(); handleNav('/uslugi'); }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-primary-500 text-primary-700 text-sm font-medium rounded-full hover:bg-primary-500 hover:text-background-50 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                {t('notFoundServices')}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}