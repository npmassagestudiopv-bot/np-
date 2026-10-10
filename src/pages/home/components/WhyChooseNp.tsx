import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const SERVICE_CITIES = [
  { name: 'Велико Търново', path: '/masazhi-veliko-tarnovo' },
  { name: 'Павликени', path: '/masazhi-pavlikeni' },
  { name: 'Габрово', path: '/masazhi-gabrovo' },
  { name: 'Горна Оряховица', path: '/masazhi-gorna-oryahovitsa' },
  { name: 'Лясковец', path: '/masazhi-lyaskovets' },
  { name: 'Севлиево', path: '/masazhi-sevlievo' },
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

// Stats that differentiate NP from competitors
const DIFFERENTIATOR_STATS = [
  { value: '5', label: 'Масажни услуги', labelEn: 'Massage services' },
  { value: '2', label: 'Студиа', labelEn: 'Studios' },
  { value: '7/7', label: 'Дни в седмицата', labelEn: 'Days a week' },
  { value: '15 €', label: 'Начална цена', labelEn: 'Starting price' },
];

export default function WhyChooseNp() {
  const { t } = useTranslation();
  const { getPath, handleNav, isEn } = useLocalizedNav();

  const { ref: whyRef, isVisible: whyVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ threshold: 0.15 });
  const { ref: pointsRef, isVisible: pointsVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section className="py-20 md:py-28 bg-background-50">
      <div className="w-full px-4 md:px-6 lg:px-10">
        <div
          ref={whyRef}
          className={`max-w-6xl mx-auto text-center mb-14 md:mb-18 transition-all duration-700 ${
            whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-accent-100 text-accent-800 text-xs font-medium rounded-full mb-4">
            {isEn ? 'WHY NP MASSAGE STUDIO' : 'ЗАЩО NP MASSAGE STUDIO'}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
            {isEn ? 'Care you can feel' : 'Грижа, която усещате'}
          </h2>
          <p className="text-sm md:text-base text-foreground-600 max-w-xl mx-auto leading-relaxed">
            {isEn ? 'Clear information, attentive care and time for you.' : 'Ясна информация, внимание към детайла и време за вас.'}
          </p>
        </div>

        {/* Differentiator Stats Bar */}
        <div
          ref={statsRef}
          className={`max-w-5xl mx-auto mb-14 md:mb-16 transition-all duration-700 delay-200 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DIFFERENTIATOR_STATS.map((stat, i) => (
              <div
                key={isEn ? stat.labelEn : stat.label}
                className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70 text-center hover:border-primary-300/50 transition-all duration-500"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-foreground-600 font-medium">
                  {isEn ? stat.labelEn : stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Points Grid */}
        <div
          ref={pointsRef}
          className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 transition-all duration-700 delay-400 ${
            pointsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {UNIQUE_POINTS.map((point, index) => (
            <div
              key={isEn ? point.titleEn : point.title}
              className="bg-background-100 rounded-2xl p-6 border border-background-200/70 hover:border-primary-300/50 transition-all duration-500 group"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition-colors duration-300">
                  <i className={`${point.icon} text-accent-700 text-lg`} />
                </div>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full tracking-wide">
                  {isEn ? point.statEn : point.stat}
                </span>
              </div>
              <h3 className="font-heading text-base md:text-lg font-semibold text-foreground-950 mb-2">
                {isEn ? point.titleEn : point.title}
              </h3>
              <p className="text-sm text-foreground-600 leading-relaxed">
                {isEn ? point.descEn : point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Cities We Serve */}
        <div className="max-w-6xl mx-auto mt-12 md:mt-16 bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70">
          <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-1 text-center">
            {isEn ? 'Welcoming clients from across the region' : 'Посрещаме клиенти от региона'}
          </h3>
          <p className="text-xs text-foreground-500 text-center mb-5">{isEn ? 'Our studios are in Veliko Tarnovo and Pavlikeni' : 'Студиата ни са във Велико Търново и Павликени'}</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {SERVICE_CITIES.map((city) => (
              <Link
                key={city.path}
                to={city.path}
                className="px-4 py-2 bg-background-50 text-foreground-700 text-sm font-medium rounded-full border border-background-200/70 hover:border-primary-300/60 hover:text-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                {city.name}
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