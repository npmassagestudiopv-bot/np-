import { useScrollReveal } from '@/hooks/useScrollReveal';

interface TrustSectionProps {
  isEn: boolean;
}

export default function TrustSection({ isEn }: TrustSectionProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="bg-accent-50 rounded-2xl p-6 md:p-8 border border-accent-200/60 mb-12">
        <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-4">
          {isEn ? 'Have doubts? Verify everything.' : 'Имате съмнения? Проверете всичко.'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
              <span className="w-5 h-5 flex items-center justify-center text-accent-600">
                <i className="ri-phone-line text-lg" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground-900">{isEn ? 'Call us' : 'Обадете ни се'}</p>
              <a href="tel:+359988926120" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                +359 988 926 120
              </a>
              <p className="text-xs text-foreground-500 mt-0.5">{isEn ? 'We answer every call' : 'Отговаряме на всяко обаждане'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
              <span className="w-5 h-5 flex items-center justify-center text-accent-600">
                <i className="ri-map-pin-line text-lg" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground-900">{isEn ? 'Visit us' : 'Посетете ни'}</p>
              <a href="/lokacii" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                {isEn ? 'Two real locations' : 'Две реални локации'}
              </a>
              <p className="text-xs text-foreground-500 mt-0.5">{isEn ? 'Veliko Tarnovo & Pavlikeni' : 'Велико Търново и Павликени'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
              <span className="w-5 h-5 flex items-center justify-center text-accent-600">
                <i className="ri-star-line text-lg" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground-900">{isEn ? 'Reviews' : 'Отзиви'}</p>
              <span className="text-sm text-foreground-700">4.9 / 5</span>
              <p className="text-xs text-foreground-500 mt-0.5">{isEn ? 'Based on 120+ reviews' : 'На база 120+ отзива'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
              <span className="w-5 h-5 flex items-center justify-center text-accent-600">
                <i className="ri-money-euro-circle-line text-lg" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground-900">{isEn ? 'Prices' : 'Цени'}</p>
              <a href="/uslugi" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                {isEn ? 'Transparent pricing' : 'Прозрачни цени'}
              </a>
              <p className="text-xs text-foreground-500 mt-0.5">{isEn ? 'No hidden fees' : 'Без скрити такси'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
              <span className="w-5 h-5 flex items-center justify-center text-accent-600">
                <i className="ri-time-line text-lg" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground-900">{isEn ? 'Working Hours' : 'Работно време'}</p>
              <span className="text-sm text-foreground-700">{isEn ? 'Mon-Sun' : 'Пн-Нд'}</span>
              <p className="text-xs text-foreground-500 mt-0.5">{isEn ? 'Extended hours' : 'Удължено работно време'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
              <span className="w-5 h-5 flex items-center justify-center text-accent-600">
                <i className="ri-shield-check-line text-lg" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground-900">{isEn ? 'Licensed' : 'Лицензиран'}</p>
              <span className="text-sm text-foreground-700">{isEn ? 'Registered business' : 'Регистрирана фирма'}</span>
              <p className="text-xs text-foreground-500 mt-0.5">{isEn ? 'EIK 206564269' : 'ЕИК 206564269'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}