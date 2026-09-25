import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessVtSchema,
  buildLocalBusinessPvSchema,
  buildWebPageSchema,
  buildOrganizationSchema,
  buildPersonSchema,
  buildFaqSchema,
  buildWebSiteSchema,
  buildSiteNavigationSchema,
  buildContactPointSchema,
  buildPlaceSchema,
  buildMapSchema,
} from '@/lib/seoSchemas';


const ENTITY_FAQ = [
  { q: 'Какво е NP Massage Studio?', a: 'NP Massage Studio е професионален масажен салон с две локации — във Велико Търново и Павликени. Предлагаме класически, спортен, антицелулитен масаж, ароматерапия и терапевтични процедури.' },
  { q: 'Кой е управителят на NP Massage Studio?', a: 'Управител на NP Massage Studio е Натан Петков — професионален масажист с многогодишен опит в масажната терапия, управляващ успешно два салона във Велико Търново и Павликени.' },
  { q: 'Каква е юридическата форма на NP Massage Studio?', a: 'NP Massage Studio функционира като регистрирана търговска дейност с управител Натан Петков. Фирмата е регистрирана в България и оперира два масажни салона в градовете Велико Търново и Павликени.' },
  { q: 'Как да се свържа с NP Massage Studio?', a: 'Можете да се свържете с нас на телефон +359 988 926 120, чрез формата за контакт на сайта, или на email: npmassagestudiopv@gmail.com. Работим всеки ден с удължено работно време.' },
  { q: 'Къде се намират салоните на NP Massage Studio?', a: 'NP Massage Studio има два салона: във Велико Търново на бул. България 72 и в Павликени на ул. Атанас Дончев 10. Двете локации предлагат пълна гама масажни услуги.' },
  { q: 'Какви услуги предлага NP Massage Studio?', a: 'Предлагаме класически масаж, спортен масаж, антицелулитен масаж, ароматерапия, масаж на гръб и релаксиращ масаж. Всички процедури се изпълняват от квалифицирани масажисти.' },
  { q: 'NP Massage Studio работи ли с клиенти от други градове?', a: 'Да, работим с клиенти не само от Велико Търново и Павликени, но и от цялата област. Много клиенти от Габрово, Севлиево, Лясковец и Горна Оряховица посещават нашите салони.' },
  { q: 'Какво отличава NP Massage Studio от други салони?', a: 'NP Massage Studio се отличава с професионализъм, точност и индивидуален подход към всеки клиент. Управителят Натан Петков гарантира висок стандарт на обслужване и удобно онлайн запазване на час.' },
  { q: 'Има ли NP Massage Studio онлайн резервация?', a: 'Да, предлагаме удобна онлайн система за запазване на час през нашия уебсайт. Можете да изберете услуга, дата, час и локация — Велико Търново или Павликени.' },
  { q: 'Какви са работните часове на NP Massage Studio?', a: 'Работим от понеделник до петък: 9:00 – 19:00, събота: 9:00 – 17:00, неделя: 10:00 – 16:00. Двете локации спазват еднакво работно време.' },
  { q: 'Какви цени предлага NP Massage Studio?', a: 'Цените ни са конкурентни и прозрачни: класически и спортен масаж — 25 € (60 мин), антицелулитен — 20 € (40 мин), ароматерапия — 30 € (60 мин), масаж на гръб — 15 € (40 мин). Вижте пълния ценоразпис на npmassagestudio.com/uslugi.' },
  { q: 'NP Massage Studio приема ли клиенти по здравна каса?', a: 'В момента не работим със здравната каса, но предлагаме терапевтични масажи, които могат да бъдат полезни при различни здравословни състояния. Консултирайте се с нас за индивидуален подход.' },
  { q: 'Какви са отзивите за NP Massage Studio?', a: 'NP Massage Studio цени обратната връзка от всеки клиент. Всеки отзив ни помага да подобряваме качеството на услугите си в двата салона във Велико Търново и Павликени. Можете да оставите своя отзив в Google Maps.' },
  { q: 'Предлага ли NP Massage Studio подаръчни ваучери?', a: 'Да, предлагаме подаръчни ваучери за всички наши услуги. Ваучерът е чудесен подарък за близки и приятели. Свържете се с нас за повече информация.' },
  { q: 'Мога ли да запазя час за масаж за двама едновременно?', a: 'NP Massage Studio разполага с едно масажно легло във всеки салон, затова обслужваме клиентите индивидуално. Това гарантира персонализирано внимание и качествена терапия за всеки клиент. Ако искате да посетите салона с приятел или партньор, можете да запазите последователни часове — обадете ни се на +359 988 926 120 за организация.' },
];

const ENTITY_REVIEWS = [
  { author: 'Мария Костова', reviewBody: 'Най-добрият масажен салон във Велико Търново! Професионално обслужване и отлични терапевти.', ratingValue: 5 },
  { author: 'Иван Петров', reviewBody: 'Спортният масаж тук е невероятен. Като състезател, възстановяването ми е много по-бързо.', ratingValue: 5 },
  { author: 'Гергана Стоянова', reviewBody: 'Антицелулитният масаж дава истински резултати. Препоръчвам на всички!', ratingValue: 5 },
];

export default function EntityPage() {
  const { t } = useTranslation();
  const { isEn } = useLocalizedNav();

  const { ref: introRef, isVisible: introVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: detailsRef, isVisible: detailsVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: faqRef, isVisible: faqVisible } = useScrollReveal({ threshold: 0.1 });

  useSeo(useMemo(() => ({
    title: 'За NP Massage Studio | ЕИК, адрес, управител Натан Петков — Юридически данни',
    description: 'Пълни юридически данни за NP Масажно студио. Управител Натан Петков. Два масажни салона във Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10). ЕИК 206564269. Телефон: +359 988 926 120.',
    keywords: 'NP Massage Studio ЕИК, Натан Петков масажист, масажен салон юридически данни, NP Масажно студио адрес, Велико Търново масажи, Павликени масажно студио',
    canonical: isEn ? '/en/about-np-massage-studio' : '/za-np-massage-studio',
    lastModified: '2026-06-08',
    hreflangs: [
      { lang: 'bg', url: '/za-np-massage-studio' },
      { lang: 'en', url: '/en/about-np-massage-studio' },
      { lang: 'x-default', url: '/za-np-massage-studio' },
    ],
    og: {
      title: 'За NP Massage Studio | Юридически данни — ЕИК, адрес, управител',
      description: 'Пълни юридически данни за NP Масажно студио — управител Натан Петков, ЕИК 206564269, адреси, контакти.',
    },
    schemas: [
      buildWebPageSchema(
        'За NP Massage Studio',
        'Пълни юридически данни за NP Massage Studio — управител Натан Петков, масажен салон във Велико Търново и Павликени.',
        '/za-np-massage-studio',
        'WebPage',
        { cssSelector: ['h1', 'h2', '.entity-block'] }
      ),
      buildBreadcrumbSchema([
        { name: 'Начало', url: '/' },
        { name: 'За NP Massage Studio', url: '/za-np-massage-studio' },
      ]),
      buildOrganizationSchema(),
      buildLocalBusinessVtSchema(),
      buildLocalBusinessPvSchema(),
      buildPersonSchema(),
      buildWebSiteSchema(),
      buildSiteNavigationSchema(),
      buildContactPointSchema(),
      buildPlaceSchema('NP Massage Studio Велико Търново', 'бул. България 72, Велико Търново', '43.08103687090604', '25.612733413492446'),
      buildPlaceSchema('NP Massage Studio Павликени', 'ул. Атанас Дончев 10, Павликени', '43.23929045147203', '25.30764655569994'),
      buildMapSchema(),
      buildFaqSchema(ENTITY_FAQ),
    ],
  }), [isEn]));

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div
              ref={introRef}
              className={`mt-8 mb-12 transition-all duration-700 ${
                introVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4 leading-tight">
                {isEn ? 'About NP Massage Studio' : 'За NP Massage Studio'}
              </h1>
              <p className="text-lg text-foreground-600 max-w-3xl leading-relaxed entity-block">
                {isEn
                  ? 'NP Massage Studio is a professional massage salon with two locations in Veliko Tarnovo and Pavlikeni. Managed by Nathan Petkov, we have built a reputation for punctuality, professionalism, and exceptional customer care.'
                  : 'NP Massage Studio е професионален масажен салон с две локации във Велико Търново и Павликени. Управляван от Натан Петков, създадохме репутация на точност, професионализъм и изключителна грижа за клиента.'}
              </p>
            </div>

            <div
              ref={detailsRef}
              className={`transition-all duration-700 ${
                detailsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-background-100 rounded-2xl p-6 border border-background-200/70">
                  <h2 className="font-heading text-xl font-semibold text-foreground-950 mb-4">
                    {isEn ? 'Legal Entity Information' : 'Юридически данни'}
                  </h2>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'Business Name' : 'Търговско наименование'}
                      </dt>
                      <dd className="text-base text-foreground-900 font-medium">
                        <strong>NP Massage Studio</strong>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'Manager / Owner' : 'Управител'}
                      </dt>
                      <dd className="text-base text-foreground-900">
                        <strong>Натан Петков</strong>
                        <span className="block text-sm text-foreground-600 mt-0.5">
                          {isEn ? 'Professional massage therapist with years of experience managing two successful salons.' : 'Професионален масажист с многогодишен опит, управляващ два успешни салона.'}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'Legal Form' : 'Юридическа форма'}
                      </dt>
                      <dd className="text-base text-foreground-900">
                        {isEn ? 'Registered business activity in Bulgaria' : 'Регистрирана търговска дейност в Република България'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'EIK (Unified Identification Code)' : 'ЕИК (Единен идентификационен код)'}
                      </dt>
                      <dd className="text-base text-foreground-900 font-medium">
                        <strong>206564269</strong>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'Date of Establishment' : 'Дата на основаване'}
                      </dt>
                      <dd className="text-base text-foreground-900">
                        {isEn ? '2024' : '2024 г.'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'VAT Registration' : 'ДДС регистрация'}
                      </dt>
                      <dd className="text-base text-foreground-900">
                        {isEn ? 'Not applicable — small business' : 'Неприложима — малък бизнес'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-background-100 rounded-2xl p-6 border border-background-200/70">
                  <h2 className="font-heading text-xl font-semibold text-foreground-950 mb-4">
                    {isEn ? 'Contact & Address' : 'Контакт и адрес'}
                  </h2>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'Primary Location' : 'Основен салон'}
                      </dt>
                      <dd className="text-base text-foreground-900">
                        <strong>бул. България 72</strong>
                        <span className="block text-sm text-foreground-600 mt-0.5">
                          5000 Велико Търново, България
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'Secondary Location' : 'Втори салон'}
                      </dt>
                      <dd className="text-base text-foreground-900">
                        <strong>ул. Атанас Дончев 10</strong>
                        <span className="block text-sm text-foreground-600 mt-0.5">
                          5250 Павликени, България
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'Phone' : 'Телефон'}
                      </dt>
                      <dd className="text-base text-foreground-900">
                        <a href="tel:+359988926120" className="text-primary-600 hover:text-primary-700 transition-colors font-medium">
                          <strong>+359 988 926 120</strong>
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">Email</dt>
                      <dd className="text-base text-foreground-900">
                        <a href="mailto:npmassagestudiopv@gmail.com" className="text-primary-600 hover:text-primary-700 transition-colors">
                          npmassagestudiopv@gmail.com
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'Website' : 'Уебсайт'}
                      </dt>
                      <dd className="text-base text-foreground-900">
                        <a href="https://npmassagestudio.com" className="text-primary-600 hover:text-primary-700 transition-colors">
                          npmassagestudio.com
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-foreground-500 uppercase tracking-wider mb-1">
                        {isEn ? 'Working Hours' : 'Работно време'}
                      </dt>
                      <dd className="text-base text-foreground-900">
                        <span className="block text-sm text-foreground-700">Пн-Пт: 9:00 – 19:00</span>
                        <span className="block text-sm text-foreground-700">Сб: 9:00 – 17:00</span>
                        <span className="block text-sm text-foreground-700">Нд: 10:00 – 16:00</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-background-100 rounded-2xl p-6 border border-background-200/70 mb-12">
                <h2 className="font-heading text-xl font-semibold text-foreground-950 mb-4">
                  {isEn ? 'External Mentions & Business Directories' : 'Външни споменавания и бизнес директории'}
                </h2>
                <p className="text-base text-foreground-700 leading-relaxed mb-4">
                  {isEn
                    ? 'NP Massage Studio is listed and mentioned on verified business directories and platforms. These external references confirm our business presence and authority in the region.'
                    : 'NP Massage Studio е регистрирана и споменавана в проверени бизнес директории и платформи. Тези външни препратки потвърждават нашето бизнес присъствие и авторитет в региона.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <a
                    href="https://www.zlatnafirma.eu/company/np-massage-studio-masazhno-studio-veliko-trnovo-1214442"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-3 p-4 bg-background-50 rounded-xl border border-background-200/50 hover:border-primary-300/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <i className="ri-award-line text-primary-600 text-lg" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground-900 block">Zlatna Firma</span>
                      <span className="text-xs text-foreground-500">Регистрирана фирма</span>
                    </div>
                  </a>
                  <a
                    href="https://www.oink.bg/search/veliko-tarnovo/masazhi"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-3 p-4 bg-background-50 rounded-xl border border-background-200/50 hover:border-primary-300/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                      <i className="ri-search-2-line text-accent-600 text-lg" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground-900 block">Oink.bg</span>
                      <span className="text-xs text-foreground-500">Масажи Велико Търново</span>
                    </div>
                  </a>
                  <a
                    href="https://www.orlizdrave.eu/profile-32280-np-massage-studio"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-3 p-4 bg-background-50 rounded-xl border border-background-200/50 hover:border-primary-300/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0">
                      <i className="ri-heart-pulse-line text-secondary-600 text-lg" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground-900 block">Orlizdrave.eu</span>
                      <span className="text-xs text-foreground-500">Профил здраве</span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-background-100 rounded-2xl p-6 border border-background-200/70 mb-12">
                <h2 className="font-heading text-xl font-semibold text-foreground-950 mb-4">
                  {isEn ? 'What Sets NP Massage Studio Apart' : 'Какво отличава NP Massage Studio'}
                </h2>
                <p className="text-base text-foreground-700 leading-relaxed mb-4">
                  {isEn
                    ? 'NP Massage Studio is not just another massage salon — it is a specialized massage center with two professionally equipped locations serving the entire Veliko Tarnovo region. Here is what makes us the preferred choice for massage therapy in Veliko Tarnovo and Pavlikeni:'
                    : 'NP Massage Studio не е просто поредният масажен салон — това е специализиран масажен център с две професионално оборудвани локации, обслужващ целия регион на Велико Търново. Ето какво ни прави предпочитаният избор за масажна терапия във Велико Търново и Павликени:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: 'ri-building-2-line', title: isEn ? 'Two Locations' : 'Две локации', desc: isEn ? 'Unlike most salons that operate from a single location, NP Massage Studio has two fully equipped salons — in Veliko Tarnovo (bul. Bulgaria 72) and Pavlikeni (ul. Atanas Donchev 10). This means more availability and convenience for clients across the region.' : 'За разлика от повечето салони, които работят от една локация, NP Massage Studio разполага с два напълно оборудвани салона — във Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10). Това означава повече наличност и удобство за клиенти от целия регион.' },
                    { icon: 'ri-calendar-todo-line', title: isEn ? 'Open 7 Days a Week' : 'Работи 7 дни в седмицата', desc: isEn ? 'We are open every day, including Sundays (10:00–16:00). Monday–Friday: 09:00–19:00, Saturday: 09:00–17:00. Extended hours mean you can book a massage even after work or on weekends.' : 'Работим всеки ден, включително неделя (10:00–16:00). Понеделник–Петък: 09:00–19:00, Събота: 09:00–17:00. Удълженото работно време означава, че можете да запазите час дори след работа или през уикенда.' },
                    { icon: 'ri-shield-user-line', title: isEn ? 'Licensed Professional Team' : 'Лицензиран професионален екип', desc: isEn ? 'Manager Nathan Petkov is a certified massage therapist who personally oversees the quality of every treatment. All therapists undergo rigorous selection and training to ensure the highest standard of care.' : 'Управителят Натан Петков е сертифициран масажист, който лично следи за качеството на всяка процедура. Всички терапевти преминават строг подбор и обучение за осигуряване на най-висок стандарт на обслужване.' },
                    { icon: 'ri-price-tag-2-line', title: isEn ? 'Transparent Pricing' : 'Прозрачни цени', desc: isEn ? 'Our prices are competitive and fully transparent — no hidden fees. Classic & Sports massage: 25 € (60 min), Anti-cellulite: 20 € (40 min), Aromatherapy: 30 € (60 min), Back massage: 15 € (40 min).' : 'Цените ни са конкурентни и напълно прозрачни — без скрити такси. Класически и спортен масаж: 25 € (60 мин), Антицелулитен: 20 € (40 мин), Ароматерапия: 30 € (60 мин), Масаж на гръб: 15 € (40 мин).' },
                    { icon: 'ri-global-line', title: isEn ? 'Online Booking 24/7' : 'Онлайн резервация 24/7', desc: isEn ? 'Book your appointment anytime through our website — no phone call needed. Select your service, location, date, and time in under a minute. We confirm within 2 hours by phone or SMS.' : 'Запазете час по всяко време чрез нашия уебсайт — без нужда от обаждане. Изберете услуга, локация, дата и час за по-малко от минута. Потвърждаваме в рамките на 2 часа по телефон или SMS.' },
                    { icon: 'ri-heart-2-line', title: isEn ? '100% Natural Products' : '100% натурални продукти', desc: isEn ? 'We use only high-quality natural oils and products — no parabens, no artificial fragrances. Our essential oils are sourced from verified suppliers for maximum therapeutic benefit.' : 'Използваме само висококачествени натурални масла и продукти — без парабени, без изкуствени аромати. Етеричните ни масла са от проверени доставчици за максимален терапевтичен ефект.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-background-50 rounded-xl p-4 border border-background-200/50 flex items-start gap-3 hover:border-primary-300/40 transition-colors duration-300">
                      <div className="w-9 h-9 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className={`${item.icon} text-accent-700`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground-900 mb-1">{item.title}</h3>
                        <p className="text-xs text-foreground-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-background-100 rounded-2xl p-6 border border-background-200/70 mb-12">
                <h2 className="font-heading text-xl font-semibold text-foreground-950 mb-4">
                  {isEn ? 'About the Owner — Nathan Petkov' : 'За собственика — Натан Петков'}
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <i className="ri-user-star-line text-primary-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-base text-foreground-700 leading-relaxed mb-3">
                      {isEn
                        ? 'Nathan Petkov is the founder and manager of NP Massage Studio. With years of experience in massage therapy, he has successfully built and manages two professional massage salons in Veliko Tarnovo and Pavlikeni. His philosophy is simple — punctuality, professionalism, and a personalized approach to every client.'
                        : 'Натан Петков е основател и управител на NP Massage Studio. С многогодишен опит в масажната терапия, той успешно изгражда и управлява два професионални масажни салона във Велико Търново и Павликени. Неговата философия е проста — точност, професионализъм и индивидуален подход към всеки клиент.'}
                    </p>
                    <p className="text-base text-foreground-700 leading-relaxed mb-3">
                      {isEn
                        ? 'Under his leadership, NP Massage Studio has become a trusted name for massage therapy in the region. The salons are known for their clean environment, skilled therapists, and convenient online booking system.'
                        : 'Под негово ръководство NP Massage Studio се превърна в доверено име за масажна терапия в региона. Салоните са известни с чистата си среда, квалифицираните терапевти и удобната система за онлайн резервация.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                        <i className="ri-verified-badge-line text-sm" />
                        {isEn ? 'Licensed Therapist' : 'Лицензиран терапевт'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                        <i className="ri-store-2-line text-sm" />
                        {isEn ? '2 Locations' : '2 локации'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                        <i className="ri-time-line text-sm" />
                        {isEn ? 'Years of Experience' : 'Многогодишен опит'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={faqRef}
                className={`transition-all duration-700 ${
                  faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div className="bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70">
                  <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-6">
                    {isEn ? 'Frequently Asked Questions' : 'Често задавани въпроси'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ENTITY_FAQ.map((faq, index) => (
                      <div key={index} className="bg-background-50 rounded-xl p-4 border border-background-200/50">
                        <h3 className="text-sm font-semibold text-foreground-900 mb-2">{faq.q}</h3>
                        <p className="text-sm text-foreground-600 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}