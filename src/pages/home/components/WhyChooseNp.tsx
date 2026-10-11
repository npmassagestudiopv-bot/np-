import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const SERVICE_CITIES = [
  { name: 'Велико Търново', nameEn: 'Veliko Tarnovo', path: '/masazhi-veliko-tarnovo' },
  { name: 'Павликени', nameEn: 'Pavlikeni', path: '/masazhi-pavlikeni' },
  { name: 'Габрово', nameEn: 'Gabrovo', path: '/masazhi-gabrovo' },
  { name: 'Горна Оряховица', nameEn: 'Gorna Oryahovitsa', path: '/masazhi-gorna-oryahovitsa' },
  { name: 'Лясковец', nameEn: 'Lyaskovets', path: '/masazhi-lyaskovets' },
  { name: 'Севлиево', nameEn: 'Sevlievo', path: '/masazhi-sevlievo' },
];

const UNIQUE_POINTS = [
  {
    "icon": "ri-map-pin-2-line",
    "title": "Две удобни локации",
    "desc": "Велико Търново, бул. България 72, и Павликени, ул. Атанас Дончев 10. Изберете студиото, което ви е удобно.",
    "stat": "2 ЛОКАЦИИ",
    "titleEn": "Two convenient locations",
    "descEn": "72 Bulgaria Blvd., Veliko Tarnovo, and 10 Atanas Donchev St., Pavlikeni. Choose the studio that suits you.",
    "statEn": "2 LOCATIONS"
  },
  {
    "icon": "ri-calendar-check-line",
    "title": "Време за вашето посещение",
    "desc": "Работим всеки ден. Проверете свободните часове онлайн и изберете удобна дата за посещение.",
    "stat": "7/7 ДНИ",
    "titleEn": "Time for your visit",
    "descEn": "We are open every day. Check availability online and choose a convenient date for your visit.",
    "statEn": "7 DAYS"
  },
  {
    "icon": "ri-shield-check-line",
    "title": "Внимание към комфорта",
    "desc": "Споделете предпочитанията си преди масажа. Натискът и темпото се съобразяват с вашия комфорт.",
    "stat": "С ГРИЖА",
    "titleEn": "Attention to your comfort",
    "descEn": "Tell us your preferences before the massage. Pressure and pace are adjusted to your comfort.",
    "statEn": "WITH CARE"
  },
  {
    "icon": "ri-price-tag-3-line",
    "title": "Ясни цени и продължителност",
    "desc": "Пет услуги на цени 15–30 € за 40–60 минути. Пакетът от 10 антицелулитни процедури е 175 €.",
    "stat": "ОТ 15 €",
    "titleEn": "Clear prices and duration",
    "descEn": "Five services at 15–30 € for 40–60 minutes. A package of 10 anti-cellulite sessions costs 175 €.",
    "statEn": "FROM 15 €"
  },
  {
    "icon": "ri-smartphone-line",
    "title": "Лесна заявка за час",
    "desc": "Изберете услуга, локация, дата и свободен час. След изпращане ще се свържем с вас за потвърждение.",
    "stat": "ОНЛАЙН",
    "titleEn": "Easy booking request",
    "descEn": "Choose a service, location, date and available time. We will contact you to confirm after you submit.",
    "statEn": "ONLINE"
  },
  {
    "icon": "ri-user-heart-line",
    "title": "Масаж според вашите нужди",
    "desc": "За отпускане или след физическо натоварване — ще ви помогнем да изберете подходящата услуга.",
    "stat": "ИНДИВИДУАЛНО",
    "titleEn": "Massage for your needs",
    "descEn": "For relaxation or after physical activity — we will help you choose the service that suits you.",
    "statEn": "PERSONAL CARE"
  }
];

export default function WhyChooseNp() {
  const { t } = useTranslation();
  const { getPath, handleNav, isEn } = useLocalizedNav();

  const { ref: whyRef, isVisible: whyVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: pointsRef, isVisible: pointsVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section className="py-16 md:py-24 bg-background-50">
      <div className="site-container">
        <div
          ref={whyRef}
          className={`max-w-6xl mx-auto text-center mb-14 md:mb-18 transition-all duration-700 ${
            whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="block text-accent-800 text-xs font-medium tracking-wide mb-4">
            {isEn ? 'WHY NP MASSAGE STUDIO' : 'ЗАЩО NP MASSAGE STUDIO'}
          </span>
          <h2 className="section-title text-foreground-950 mb-4">
            {isEn ? 'Care you can feel' : 'Грижа, която усещате'}
          </h2>
          <p className="section-copy text-foreground-600 max-w-xl mx-auto">
            {isEn ? 'Clear information, attentive care and time for you.' : 'Ясна информация, внимание към детайла и време за вас.'}
          </p>
        </div>

        {/* Unique Points Grid */}
        <div
          ref={pointsRef}
          className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 md:gap-y-10 transition-opacity duration-300 ${
            pointsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {UNIQUE_POINTS.map((point, index) => (
            <div
              key={isEn ? point.titleEn : point.title}
              className="pt-5 border-t border-background-200/70"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <h3 className="font-heading text-xl font-medium text-foreground-950 mb-3">
                {isEn ? point.titleEn : point.title}
              </h3>
              <p className="text-base text-foreground-600 leading-relaxed">
                {isEn ? point.descEn : point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Cities We Serve */}
        <div className="max-w-6xl mx-auto mt-12 md:mt-16 pt-8 border-t border-background-200/70">
          <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-1 text-center">
            {isEn ? 'Welcoming clients from across the region' : 'Посрещаме клиенти от региона'}
          </h3>
          <p className="text-xs text-foreground-500 text-center mb-5">{isEn ? 'Our studios are in Veliko Tarnovo and Pavlikeni' : 'Студиата ни са във Велико Търново и Павликени'}</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {SERVICE_CITIES.map((city) => (
              <Link
                key={city.path}
                to={isEn ? '/en/locations' : city.path}
                className="text-link px-3 py-2 whitespace-nowrap"
              >
                {isEn ? city.nameEn : city.name}
              </Link>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link
              to={getPath('/videos-masazhi')}
              className="inline-flex items-center gap-1.5 text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors cursor-pointer"
            >
              <i className="ri-scales-3-line" />
              {isEn ? 'Compare massage services' : 'Сравни видовете масажи'}
              <i className="ri-arrow-right-line text-xs" />
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <a
            href={getPath('/rezervaciya')}
            onClick={(e) => {
              e.preventDefault();
              handleNav(getPath('/rezervaciya'));
            }}
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary-500 text-background-50 font-medium text-sm rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
          >
            {t('heroCta')}
            <i className="ri-arrow-right-line" />
          </a>
          <p className="text-xs text-foreground-500 mt-3">
            {isEn ? 'or call ' : 'или се обадете на '}
            <a href="tel:+359988926120" className="text-primary-600 hover:text-primary-700 font-medium transition-colors cursor-pointer">
              +359 988 926 120
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
