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
    icon: 'ri-map-pin-2-line',
    title: 'Две локации в региона',
    desc: 'Единственият масажен салон в региона с два професионално оборудвани салона — Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10). Обслужваме клиенти от Велико Търново, Павликени, Габрово, Горна Оряховица, Лясковец и Севлиево.',
    stat: '2 ЛОКАЦИИ',
  },
  {
    icon: 'ri-calendar-check-line',
    title: 'Работим 7 дни в седмицата',
    desc: 'За разлика от повечето салони, NP Massage Studio работи всеки ден, включително неделя (10:00–16:00). Понеделник–Петък: 09:00–19:00, Събота: 09:00–17:00. Удълженото работно време дава възможност за резервация дори след работа.',
    stat: '7/7 ДНИ',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Лицензиран професионален екип',
    desc: 'Управителят Натан Петков е сертифициран масажист с многогодишен опит. Всеки терапевт в NP Massage Studio преминава строг подбор и работи с доказани техники. Използваме само висококачествени натурални масла без парабени и изкуствени аромати.',
    stat: '100% НАТУРАЛНО',
  },
  {
    icon: 'ri-price-tag-3-line',
    title: 'Прозрачни и достъпни цени',
    desc: 'Цените ни са конкурентни и напълно прозрачни — без скрити такси и допълнителни разходи. Класически и спортен масаж: 25 € (60 мин), Антицелулитен: 20 € (40 мин), Ароматерапия: 30 € (60 мин), Масаж на гръб: 15 € (40 мин). Пакет антицелулитна терапия (10 процедури): 175 €.',
    stat: 'ОТ 15 €',
  },
  {
    icon: 'ri-smartphone-line',
    title: 'Удобна онлайн резервация',
    desc: 'Запазете час за секунди чрез онлайн формата на сайта — без нужда от обаждане. Изберете услуга, локация, дата и час. Потвърждаваме резервацията ви по SMS или обаждане в рамките на 2 часа. Системата работи 24/7.',
    stat: '24/7 ОНЛАЙН',
  },
  {
    icon: 'ri-user-heart-line',
    title: 'Персонализиран подход',
    desc: 'Всяка процедура е съобразена с индивидуалните нужди, здравословното състояние и предпочитанията на клиента. Комбинираме класически и модерни техники за оптимален резултат — независимо дали търсите релакс, спортно възстановяване или терапевтичен ефект.',
    stat: 'ИНДИВИДУАЛНО',
  },
];

// Stats that differentiate NP from competitors
const DIFFERENTIATOR_STATS = [
  { value: '5+', label: 'Вида масажни услуги' },
  { value: '2', label: 'Салона в региона' },
  { value: '7/7', label: 'Дни в седмицата' },
  { value: '15 €', label: 'Начална цена' },
];

export default function WhyChooseNp() {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();

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
            ЗАЩО NP MASSAGE STUDIO
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
            Най-добрият избор за масажи Търново
          </h2>
          <p className="text-sm md:text-base text-foreground-600 max-w-xl mx-auto leading-relaxed">
            Ето какво ни отличава от другите масажни салони в региона — факти, не обещания
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
                key={stat.label}
                className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70 text-center hover:border-primary-300/50 transition-all duration-500"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-foreground-600 font-medium">
                  {stat.label}
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
              key={point.title}
              className="bg-background-100 rounded-2xl p-6 border border-background-200/70 hover:border-primary-300/50 transition-all duration-500 group"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition-colors duration-300">
                  <i className={`${point.icon} text-accent-700 text-lg`} />
                </div>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full tracking-wide">
                  {point.stat}
                </span>
              </div>
              <h3 className="font-heading text-base md:text-lg font-semibold text-foreground-950 mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-foreground-600 leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Cities We Serve */}
        <div className="max-w-6xl mx-auto mt-12 md:mt-16 bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70">
          <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-1 text-center">
            Градове, които обслужваме
          </h3>
          <p className="text-xs text-foreground-500 text-center mb-5">NP Massage Studio обслужва клиенти от целия регион</p>
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
              to="/videos-masazhi"
              className="inline-flex items-center gap-1.5 text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors cursor-pointer"
            >
              <i className="ri-scales-3-line" />
              Сравни всички видове масажи
              <i className="ri-arrow-right-line text-xs" />
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <a
            href="/rezervaciya"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/rezervaciya');
            }}
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary-500 text-background-50 font-medium text-sm rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
          >
            Запази час сега
            <i className="ri-arrow-right-line" />
          </a>
          <p className="text-xs text-foreground-500 mt-3">
            или се обадете на{' '}
            <a href="tel:+359988926120" className="text-primary-600 hover:text-primary-700 font-medium transition-colors cursor-pointer">
              +359 988 926 120
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}