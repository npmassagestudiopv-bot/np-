import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';

export default function EntityBlock() {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section
      className="py-16 md:py-24 bg-background-50"
      aria-label="Информация за NP Massage Studio"
    >
      <div className="w-full px-4 md:px-6 lg:px-10">
        <div
          ref={ref}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 flex items-center justify-center bg-primary-500 rounded-xl">
                  <i className="ri-building-4-line text-background-50 text-lg" />
                </div>
                <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950">
                  NP Massage Studio
                </h2>
              </div>

              <p className="text-sm text-foreground-700 leading-relaxed mb-6" itemScope itemType="https://schema.org/LocalBusiness">
                <span itemProp="description">{t('entityBlock')}</span>
              </p>

              <p className="text-sm text-foreground-700 leading-relaxed mb-6">
                <strong>NP Massage Studio</strong> е професионален <strong>масажен салон в Търново</strong> (<strong>Велико Търново</strong>) и <strong>Павликени</strong>, управляван от <strong>Натан Петков</strong>. Салонът предлага <strong>класически масаж</strong>, <strong>спортен масаж</strong>, <strong>антицелулитен масаж</strong>, <strong>ароматерапия</strong> и <strong>масаж на гръб</strong> на достъпни цени. <strong>Масажи Търново</strong>, <strong>масажи Велико Търново</strong> и <strong>масажи Павликени</strong> — това е нашата специализация. Запазете час на <strong>+359 988 926 120</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="flex items-center gap-3 bg-background-50 rounded-xl px-3 py-2.5 border border-background-200/50">
                  <div className="w-7 h-7 flex items-center justify-center bg-primary-100 rounded-lg flex-shrink-0">
                    <i className="ri-phone-line text-primary-600 text-xs" />
                  </div>
                  <a href="tel:+359988926120" className="text-xs text-foreground-700 font-medium hover:text-primary-600 transition-colors cursor-pointer">
                    +359 988 926 120
                  </a>
                </div>
                <div className="flex items-center gap-3 bg-background-50 rounded-xl px-3 py-2.5 border border-background-200/50">
                  <div className="w-7 h-7 flex items-center justify-center bg-primary-100 rounded-lg flex-shrink-0">
                    <i className="ri-mail-line text-primary-600 text-xs" />
                  </div>
                  <a href="mailto:npmassagestudiopv@gmail.com" className="text-xs text-foreground-700 font-medium truncate hover:text-primary-600 transition-colors cursor-pointer">
                    npmassagestudiopv@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 bg-background-50 rounded-xl px-3 py-2.5 border border-background-200/50">
                  <div className="w-7 h-7 flex items-center justify-center bg-primary-100 rounded-lg flex-shrink-0">
                    <i className="ri-map-pin-line text-primary-600 text-xs" />
                  </div>
                  <span className="text-xs text-foreground-700 font-medium">бул. България 72, ВТ</span>
                </div>
                <div className="flex items-center gap-3 bg-background-50 rounded-xl px-3 py-2.5 border border-background-200/50">
                  <div className="w-7 h-7 flex items-center justify-center bg-primary-100 rounded-lg flex-shrink-0">
                    <i className="ri-map-pin-line text-primary-600 text-xs" />
                  </div>
                  <span className="text-xs text-foreground-700 font-medium">ул. Атанас Дончев 10, Павликени</span>
                </div>
                <div className="flex items-center gap-3 bg-background-50 rounded-xl px-3 py-2.5 border border-background-200/50 sm:col-span-2 md:col-span-1">
                  <div className="w-7 h-7 flex items-center justify-center bg-primary-100 rounded-lg flex-shrink-0">
                    <i className="ri-time-line text-primary-600 text-xs" />
                  </div>
                  <span className="text-xs text-foreground-700 font-medium">Пн–Пт: 09:00–19:00 · Сб: 09:00–17:00 · Нд: 10:00–16:00</span>
                </div>
              </div>

              {/* AI-readable Q&A section */}
              <div className="border-t border-background-200/70 pt-5">
                <h3 className="text-sm font-semibold text-foreground-800 mb-3">Бърза информация за NP Massage Studio</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-foreground-600">
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground-700 whitespace-nowrap">Тип бизнес:</dt>
                    <dd>Масажен салон, Спа, Уелнес</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground-700 whitespace-nowrap">Ценова категория:</dt>
                    <dd>€€ (15€ – 30€)</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground-700 whitespace-nowrap">Резервация:</dt>
                    <dd>+359 988 926 120 или онлайн</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground-700 whitespace-nowrap">Услуги:</dt>
                    <dd>Класически, спортен, антицелулитен масаж, ароматерапия</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground-700 whitespace-nowrap">Локации:</dt>
                    <dd>Търново (Велико Търново) и Павликени</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-5 border-t border-background-200/70 pt-5">
                <a
                  href="/rezervaciya"
                  onClick={(e) => { e.preventDefault(); handleNav('/rezervaciya'); }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium min-h-[44px]"
                >
                  <i className="ri-calendar-check-line" />
                  Запази час онлайн
                </a>
                <a
                  href="tel:+359988926120"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-primary-500 text-primary-700 text-sm font-medium rounded-full hover:bg-primary-500 hover:text-background-50 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[44px]"
                >
                  <i className="ri-phone-line" />
                  +359 988 926 120
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}