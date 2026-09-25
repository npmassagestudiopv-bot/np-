import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import FaqAccordion from '@/components/feature/FaqAccordion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildFaqSchema,
  buildWebPageSchema,
  buildPlaceSchema,
} from '@/lib/seoSchemas';
import { LOCATION_INTROS, SERVICE_BENEFITS, VALUE_PROPOSITIONS, OUTREACH_TRAVEL_INFO } from '@/mocks/landingSeoContent';

interface LandingPageProps {
  title: string;
  description: string;
  location: string;
  service: string;
  canonicalPath: string;
}

const STUDIO_CITIES = new Set(['Велико Търново', 'Павликени']);

const SERVICE_AREA_META: Record<string, { nearestStudio: string; nearestAddress: string; timeMin: string; distanceKm: string; lat: string; lng: string }> = {
  'Габрово': { nearestStudio: 'Велико Търново', nearestAddress: 'бул. България 72, Велико Търново', timeMin: '45', distanceKm: '45', lat: '43.08103687090604', lng: '25.612733413492446' },
  'Горна Оряховица': { nearestStudio: 'Велико Търново', nearestAddress: 'бул. България 72, Велико Търново', timeMin: '15', distanceKm: '7', lat: '43.08103687090604', lng: '25.612733413492446' },
  'Лясковец': { nearestStudio: 'Велико Търново', nearestAddress: 'бул. България 72, Велико Търново', timeMin: '15', distanceKm: '10', lat: '43.08103687090604', lng: '25.612733413492446' },
  'Севлиево': { nearestStudio: 'Павликени', nearestAddress: 'ул. Атанас Дончев 10, Павликени', timeMin: '30', distanceKm: '35', lat: '43.23929045147203', lng: '25.30764655569994' },
};

const STUDIO_ADDRESSES: Record<string, { lat: string; lng: string; address: string }> = {
  'Велико Търново': { lat: '43.08103687090604', lng: '25.612733413492446', address: 'бул. България 72' },
  'Павликени': { lat: '43.23929045147203', lng: '25.30764655569994', address: 'ул. Атанас Дончев 10' },
};

const FAQ_STUDIO = [
  { q: 'Колко струва масажът?', a: 'Цените варират от 15 € (40 мин масаж на гръб) до 30 € (60 мин ароматерапия). Класическият и спортният масаж са по 25 € за 60 минути. Точните цени може да видите на страницата ни с услуги.' },
  { q: 'Трябва ли предварително записване?', a: 'Да, препоръчваме предварително записване на +359 988 926 120 за по-добра организация и персонализирано обслужване. Можете да запазите час онлайн чрез формата за резервация.' },
  { q: 'Какви са работните ви часове?', a: 'Работим всеки ден: Понеделник–Петък 09:00–19:00, Събота 09:00–17:00, Неделя 10:00–16:00. Двете локации спазват еднакво работно време.' },
  { q: 'Как мога да запазя час?', a: `Обадете се на +359 988 926 120 или попълнете онлайн формата за резервация на ${baseUrl}/rezervaciya. Ще потвърдим резервацията по телефон в рамките на 2 часа.` },
  { q: 'Какви масажни услуги предлага NP Massage Studio?', a: 'Предлагаме класически и релаксиращ масаж, спортен и терапевтичен масаж, антицелулитен масаж, ароматерапия и частичен масаж на гръб. Всички процедури се изпълняват от квалифицирани терапевти с професионално оборудване.' },
  { q: 'Къде се намират локациите на NP Massage Studio?', a: 'Имаме две локации: Велико Търново на бул. България 72 и Павликени на ул. Атанас Дончев 10. И двете предлагат пълната гама от услуги. Можете да изберете по-удобната за вас локация.' },
  { q: 'Кой е най-добрият масаж при болки в гърба и кръста?', a: 'При болки в гърба и кръста най-подходящи са лечебният (терапевтичен) масаж и дълбокият тъканен масаж. Те работят целенасочено върху мускулния спазъм около проблемната зона, подобряват кръвообращението и облекчават притискането на нервите. Спортният масаж също е ефективен при мускулни болки след физическо натоварване. В NP Massage Studio предлагаме всички тези видове масаж, като терапевтът избира най-подходящите техники след консултация с вас.' },
  { q: 'Какви са ползите от редовния масаж?', a: 'Редовният масаж (поне веднъж седмично) носи множество научно доказани ползи: намалява нивата на кортизол (хормона на стреса) с до 30%, подобрява кръвообращението и снабдяването на тъканите с кислород, облекчава хроничните мускулни болки и схващания, подобрява качеството на съня, повишава гъвкавостта и обхвата на движение, засилва имунната защита чрез стимулиране на лимфната система и отделя ендорфини — естествените хормони на щастието. Клиентите ни редовно споделят, че се чувстват по-енергични, по-спокойни и с по-малко болки.' },
  { q: 'Къде мога да си направя лечебен масаж във Велико Търново?', a: 'NP Massage Studio предлага професионален лечебен и терапевтичен масаж във Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10). Нашите терапевти са обучени да работят с различни здравословни проблеми — дископатия, схванат врат, болки в кръста, мускулни дисбаланси и възстановяване след травми. Всяка сесия започва с консултация за определяне на най-безопасния и ефективен подход. Цена: 25 € за 60 минути.' },
  { q: 'Помага ли масажът при дископатия и схванат врат?', a: 'Да, професионалният масаж помага значително при дископатия и схванат врат, но при стриктни условия. При дископатия масажът намалява мускулния спазъм около засегнатия диск, подобрява кръвообращението и подпомага естественото възстановяване. При схванат врат техники като дълбоко триене и мобилизация на ставите отпускат напрегнатите мускули и възстановяват подвижността. Важно: масажът трябва да се извършва от квалифициран терапевт и само след консултация с лекар. В NP Massage Studio използваме нежни, контролирани техники без директен натиск върху гръбначния стълб.' },
  { q: 'Колко време трае един професионален масаж и колко често трябва да го правя?', a: 'Стандартната продължителност е 60 минути за класически, спортен и ароматерапевтичен масаж. Антицелулитният масаж и частичният масаж на гръб са по 40 минути. Планирайте още 10-15 минути за консултация и преобличане. Относно честотата: за релакс и стрес — веднъж седмично; за спортно възстановяване — 2-3 пъти седмично; за антицелулитна терапия — 2 пъти седмично (курс от 10 процедури); за хронични болки — 1-2 пъти седмично в острия период, след това веднъж на 2 седмици за поддръжка.' },
  { q: 'Каква е разликата между лечебен, спортен и класически масаж?', a: 'Класическият масаж е релаксиращ и работи върху цялото тяло с умерен натиск — идеален за стрес и общо благосъстояние. Спортният масаж е по-интензивен и целенасочен, създаден за спортисти и активни хора — подобрява възстановяването, гъвкавостта и предотвратява травми. Лечебният (терапевтичен) масаж се фокусира върху специфични здравословни проблеми — дископатия, болки в гърба, схванат врат, ставни проблеми — с техники, съобразени с медицинското състояние. И трите вида се предлагат в NP Massage Studio на цена от 25 € за 60 минути.' },
];

const RELATED_CONTENT_MAP: Record<string, { blogSlugs: string[]; landingPaths: Array<{ path: string; label: string }> }> = {
  'Масажи': { blogSlugs: ['masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo', 'kolko-chesto-masazh-rutina-np-massage'], landingPaths: [{ path: '/profesionalen-masazh-veliko-tarnovo', label: 'Професионален масаж' }, { path: '/polzi-ot-redoven-masazh', label: 'Ползи от редовен масаж' }] },
  'Класически масаж': { blogSlugs: ['polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni'], landingPaths: [{ path: '/naj-dobar-masazh-veliko-tarnovo', label: 'Най-добър масаж' }, { path: '/polzi-ot-redoven-masazh', label: 'Ползи от редовен масаж' }] },
  'Спортен масаж': { blogSlugs: ['sporten-masazh-vazstanovyavane-veliko-tarnovo', 'razlika-lecheben-sporten-masazh'], landingPaths: [{ path: '/koj-masazh-pri-bolki-v-krasta', label: 'Масаж при болки в кръста' }, { path: '/profesionalen-masazh-veliko-tarnovo', label: 'Професионален масаж' }] },
  'Антицелулитен масаж': { blogSlugs: ['anticeluliten-masazh-rezultati-pavlikeni'], landingPaths: [{ path: '/naj-dobar-masazh-veliko-tarnovo', label: 'Най-добър масаж' }, { path: '/polzi-ot-redoven-masazh', label: 'Ползи от редовен масаж' }] },
  'Ароматерапия': { blogSlugs: ['aromaterapiya-eterichni-masla-veliko-tarnovo', 'masazh-stres-oblekchavane-veliko-tarnovo'], landingPaths: [{ path: '/profesionalen-masazh-veliko-tarnovo', label: 'Професионален масаж' }, { path: '/polzi-ot-redoven-masazh', label: 'Ползи от редовен масаж' }] },
  'Масаж на гръб': { blogSlugs: ['chastichen-masazh-grab-oblekchavane-veliko-tarnovo', 'pomaga-li-masazhat-pri-diskopatiya'], landingPaths: [{ path: '/masazh-pri-diskopatiya', label: 'Масаж при дископатия' }, { path: '/koj-masazh-pri-bolki-v-krasta', label: 'Масаж при болки в кръста' }] },
  'Лечебен масаж': { blogSlugs: ['pomaga-li-masazhat-pri-diskopatiya', 'razlika-lecheben-sporten-masazh'], landingPaths: [{ path: '/kade-lecheben-masazh-veliko-tarnovo', label: 'Къде лечебен масаж' }, { path: '/masazh-pri-diskopatiya', label: 'Масаж при дископатия' }] },
  'Масаж при болки в гърба': { blogSlugs: ['pomaga-li-masazhat-pri-diskopatiya', 'chastichen-masazh-grab-oblekchavane-veliko-tarnovo'], landingPaths: [{ path: '/koj-masazh-pri-bolki-v-krasta', label: 'Масаж при болки в кръста' }, { path: '/kade-lecheben-masazh-veliko-tarnovo', label: 'Къде лечебен масаж' }] },
  'Масаж при стрес и напрежение': { blogSlugs: ['masazh-stres-oblekchavane-veliko-tarnovo', 'aromaterapiya-eterichni-masla-veliko-tarnovo'], landingPaths: [{ path: '/profesionalen-masazh-veliko-tarnovo', label: 'Професионален масаж' }, { path: '/polzi-ot-redoven-masazh', label: 'Ползи от редовен масаж' }] },
  'Масаж за възстановяване след тренировка': { blogSlugs: ['sporten-masazh-vazstanovyavane-veliko-tarnovo', 'kolko-chesto-masazh-rutina-np-massage'], landingPaths: [{ path: '/naj-dobar-masazh-veliko-tarnovo', label: 'Най-добър масаж' }] },
  'Масаж при главоболие': { blogSlugs: ['masazh-stres-oblekchavane-veliko-tarnovo', 'chastichen-masazh-grab-oblekchavane-veliko-tarnovo'], landingPaths: [{ path: '/profesionalen-masazh-veliko-tarnovo', label: 'Професионален масаж' }] },
  'Масаж при схванат врат': { blogSlugs: ['pomaga-li-masazhat-pri-diskopatiya', 'chastichen-masazh-grab-oblekchavane-veliko-tarnovo'], landingPaths: [{ path: '/masazh-pri-diskopatiya', label: 'Масаж при дископатия' }, { path: '/kade-lecheben-masazh-veliko-tarnovo', label: 'Къде лечебен масаж' }] },
  'Релаксиращ масаж': { blogSlugs: ['polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni', 'masazh-stres-oblekchavane-veliko-tarnovo', 'kolko-vreme-trae-edin-masazh'], landingPaths: [{ path: '/naj-dobar-masazh-veliko-tarnovo', label: 'Най-добър масаж' }, { path: '/polzi-ot-redoven-masazh', label: 'Ползи от редовен масаж' }] },
  'Турски масаж': { blogSlugs: ['masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo', 'polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni'], landingPaths: [{ path: '/profesionalen-masazh-veliko-tarnovo', label: 'Професионален масаж' }] },
  'Дълбок тъканен масаж': { blogSlugs: ['pomaga-li-masazhat-pri-diskopatiya', 'razlika-lecheben-sporten-masazh'], landingPaths: [{ path: '/koj-masazh-pri-bolki-v-krasta', label: 'Масаж при болки в кръста' }, { path: '/kade-lecheben-masazh-veliko-tarnovo', label: 'Къде лечебен масаж' }] },
  'Масажно студио': { blogSlugs: ['masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo', 'kolko-chesto-masazh-rutina-np-massage'], landingPaths: [{ path: '/profesionalen-masazh-veliko-tarnovo', label: 'Професионален масаж' }, { path: '/naj-dobar-masazh-veliko-tarnovo', label: 'Най-добър масаж' }] },
  'Професионален масаж': { blogSlugs: ['masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo', 'polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni', 'kolko-vreme-trae-edin-masazh'], landingPaths: [{ path: '/naj-dobar-masazh-veliko-tarnovo', label: 'Най-добър масаж' }, { path: '/polzi-ot-redoven-masazh', label: 'Ползи от редовен масаж' }] },
  'Масаж при дископатия': { blogSlugs: ['pomaga-li-masazhat-pri-diskopatiya', 'razlika-lecheben-sporten-masazh'], landingPaths: [{ path: '/kade-lecheben-masazh-veliko-tarnovo', label: 'Къде лечебен масаж' }, { path: '/koj-masazh-pri-bolki-v-krasta', label: 'Масаж при болки в кръста' }] },
  'Най-добър масаж': { blogSlugs: ['masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo', 'polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni'], landingPaths: [{ path: '/profesionalen-masazh-veliko-tarnovo', label: 'Професионален масаж' }, { path: '/polzi-ot-redoven-masazh', label: 'Ползи от редовен масаж' }] },
  'Масаж при болки в кръста': { blogSlugs: ['pomaga-li-masazhat-pri-diskopatiya', 'chastichen-masazh-grab-oblekchavane-veliko-tarnovo'], landingPaths: [{ path: '/kade-lecheben-masazh-veliko-tarnovo', label: 'Къде лечебен масаж' }, { path: '/masazh-pri-diskopatiya', label: 'Масаж при дископатия' }] },
  'Ползи от редовен масаж': { blogSlugs: ['kolko-chesto-masazh-rutina-np-massage', 'masazh-stres-oblekchavane-veliko-tarnovo', 'kolko-vreme-trae-edin-masazh'], landingPaths: [{ path: '/naj-dobar-masazh-veliko-tarnovo', label: 'Най-добър масаж' }, { path: '/profesionalen-masazh-veliko-tarnovo', label: 'Професионален масаж' }] },
};

const BLOG_TITLE_MAP: Record<string, string> = {
  'masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo': 'Пълно ръководство за масажи във Велико Търново и Павликени',
  'kolko-chesto-masazh-rutina-np-massage': 'Колко често да ходите на масаж?',
  'polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni': 'Ползи от класическия масаж',
  'sporten-masazh-vazstanovyavane-veliko-tarnovo': 'Спортен масаж: възстановяване и превенция',
  'razlika-lecheben-sporten-masazh': 'Разлика между лечебен и спортен масаж',
  'anticeluliten-masazh-rezultati-pavlikeni': 'Антицелулитен масаж: резултати',
  'aromaterapiya-eterichni-masla-veliko-tarnovo': 'Ароматерапия: етерични масла',
  'masazh-stres-oblekchavane-veliko-tarnovo': 'Масаж за облекчаване на стреса',
  'chastichen-masazh-grab-oblekchavane-veliko-tarnovo': 'Частичен масаж на гръб',
  'pomaga-li-masazhat-pri-diskopatiya': 'Помага ли масажът при дископатия?',
  'kolko-vreme-trae-edin-masazh': 'Колко време трае един масаж?',
};

const LOCATION_PAGE_MAP: Record<string, string> = {
  'Велико Търново': '/masazhi-veliko-tarnovo',
  'Павликени': '/masazhi-pavlikeni',
  'Габрово': '/masazhi-gabrovo',
  'Горна Оряховица': '/masazhi-gorna-oryahovitsa',
  'Лясковец': '/masazhi-lyaskovets',
  'Севлиево': '/masazhi-sevlievo',
};

export default function LandingPage({ title, description, location, service, canonicalPath }: LandingPageProps) {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();

  const isStudioCity = STUDIO_CITIES.has(location);
  const areaMeta = isStudioCity ? null : (SERVICE_AREA_META[location] || null);
  const nearestStudio = areaMeta?.nearestStudio || 'Велико Търново';

  const studioAddr = isStudioCity
    ? (STUDIO_ADDRESSES[location] || STUDIO_ADDRESSES['Велико Търново'])
    : { lat: areaMeta!.lat, lng: areaMeta!.lng, address: areaMeta!.nearestAddress };

  const faqItems = useMemo(() => {
    if (isStudioCity) return FAQ_STUDIO.map((item) => ({ q: item.q, a: item.a }));
    return [
      { q: `Къде точно се намира NP Massage Studio спрямо ${location}?`, a: `Ние нямаме физически салон в ${location}, но обслужваме клиенти от ${location} в най-близкото ни студио — в ${nearestStudio} (само на ${areaMeta!.timeMin} минути с кола). Адрес ${nearestStudio}: ${areaMeta!.nearestAddress}. Това е напълно оборудван професионален масажен салон с уютна атмосфера.` },
      { q: `Заслужава ли си пътуването до ${nearestStudio} за масаж?`, a: `Определено да! Клиентите ни от ${location} редовно идват при нас, защото получават професионален масаж на достъпна цена в спокойна среда. Само ${areaMeta!.timeMin} минути път за 60 минути чист релакс — напълно си заслужава. Освен това можете да комбинирате посещението с разходка или пазаруване в ${nearestStudio}.` },
      { q: 'Колко струва масажът?', a: 'Цените варират от 15 € (40 мин масаж на гръб) до 30 € (60 мин ароматерапия). Класическият и спортният масаж са по 25 € за 60 минути. Същите цени важат за всички клиенти, независимо от кой град идват.' },
      { q: 'Трябва ли предварително записване?', a: 'Да, препоръчваме предварително записване на +359 988 926 120, особено ако пътувате от друг град. Така можем да ви гарантираме точен час и да подготвим студиото специално за вас.' },
      { q: 'Как мога да запазя час?', a: `Обадете се на +359 988 926 120 или попълнете онлайн формата за резервация на ${baseUrl}/rezervaciya. Кажете ни от кой град идвате и ще ви помогнем да изберете удобен час. Потвърждаваме резервацията по телефон в рамките на 2 часа.` },
      { q: 'Какви са работните ви часове?', a: 'Работим всеки ден: Понеделник–Петък 09:00–19:00, Събота 09:00–17:00, Неделя 10:00–16:00. Двете локации (Велико Търново и Павликени) спазват еднакво работно време.' },
    ];
  }, [isStudioCity, location, nearestStudio, areaMeta]);

  const whyItems = useMemo(() => {
    if (!isStudioCity && areaMeta) {
      return [
        `Професионален масаж само на ${areaMeta.timeMin} минути от ${location} — в нашето студио в ${nearestStudio}`,
        'Същото високо качество на услугите като всички наши клиенти',
        `Персонализирана процедура според вашите нужди — просто ни кажете какво ви притеснява`,
        'Достъпни цени без компромис в качеството — 15–30 €',
        'Безплатен паркинг и удобен достъп до студиото',
      ];
    }
    return [
      t('landingWhy1'),
      t('landingWhy2'),
      t('landingWhy3').replace('{location}', location),
      t('landingWhy4'),
      t('landingWhy5'),
    ];
  }, [isStudioCity, location, nearestStudio, areaMeta, t]);

  useSeo(useMemo(() => ({
    title,
    description,
    keywords: `${service.toLowerCase()} ${location.toLowerCase()}, ${service.toLowerCase()} Велико Търново, масаж ${location.toLowerCase()}, NP Масажно студио ${location}, професионален масаж, запази час масаж`,
    canonical: canonicalPath,
    lastModified: '2026-06-20',
    hreflangs: [
      { lang: 'bg', url: canonicalPath },
      { lang: 'x-default', url: canonicalPath },
    ],
    og: {
      title,
      description,
      type: 'website',
      locale: 'bg_BG',
      localeAlternate: ['en_US'],
    },
    schemas: [
      buildWebPageSchema(title, description, canonicalPath),
      buildBreadcrumbSchema([
        { name: 'Начало', url: '/' },
        { name: location, url: LOCATION_PAGE_MAP[location] || '/lokacii' },
        { name: service },
      ], canonicalPath),
      buildLocalBusinessSchema(),
      isStudioCity
        ? buildPlaceSchema(`NP Massage Studio — ${location}`, studioAddr.address, studioAddr.lat, studioAddr.lng)
        : null,
      buildFaqSchema(faqItems),
      {
        type: 'Service',
        data: {
          name: `${service} — ${location}`,
          description: isStudioCity
            ? description
            : `${service} за клиенти от ${location} — обслужвани в студиото на NP Massage Studio в ${nearestStudio} (${areaMeta!.timeMin} мин).`,
          provider: {
            '@id': `${baseUrl}/#business`,
          },
          areaServed: {
            '@type': 'City',
            name: location,
            containedInPlace: { '@type': 'Country', name: 'Bulgaria' },
          },
          ...(isStudioCity ? {
            availableAtOrFrom: {
              '@type': 'Place',
              name: `NP Massage Studio — ${location}`,
              address: { '@type': 'PostalAddress', streetAddress: studioAddr.address },
            },
          } : {
            availableAtOrFrom: {
              '@type': 'Place',
              name: `NP Massage Studio — ${nearestStudio}`,
              address: {
                '@type': 'PostalAddress',
                streetAddress: STUDIO_ADDRESSES[nearestStudio]?.address || 'бул. България 72',
                addressLocality: nearestStudio,
              },
            },
          }),
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${service} оферти — ${location}`,
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: service,
                  description,
                },
                eligibleRegion: {
                  '@type': 'City',
                  name: location,
                },
              },
            ],
          },
        },
      },
    ].filter(Boolean),
  }), [title, description, location, service, canonicalPath, isStudioCity, nearestStudio, areaMeta, studioAddr, faqItems]));

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            {!isStudioCity && areaMeta && (
              <ProximityBanner location={location} nearestStudio={nearestStudio} timeMin={areaMeta.timeMin} distanceKm={areaMeta.distanceKm} />
            )}

            <div className="mb-8 md:mb-12">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
                {isStudioCity ? `${service} — ${location}` : `${service} за клиенти от ${location}`}
              </h1>
              <p className="text-base text-foreground-600 max-w-2xl leading-relaxed">
                {description}
              </p>
              {!isStudioCity && areaMeta && (
                <p className="mt-3 text-sm text-foreground-500 leading-relaxed">
                  NP Massage Studio обслужва клиенти от <strong>{location}</strong> и региона в професионалното си студио в <strong>{nearestStudio}</strong> — само на <strong>{areaMeta.timeMin} минути</strong> път. Предлагаме пълната гама от масажни услуги: класически, спортен, антицелулитен масаж, ароматерапия и частичен масаж на гръб.
                </p>
              )}
            </div>

            <LandingWhy whyItems={whyItems} isStudioCity={isStudioCity} service={service} location={location} nearestStudio={nearestStudio} />
            <LandingCta service={service} location={location} isStudioCity={isStudioCity} />
            <LandingSeoContent service={service} location={location} isStudioCity={isStudioCity} nearestStudio={nearestStudio} areaMeta={areaMeta} />
            <LandingTravelInfo location={location} nearestStudio={nearestStudio} areaMeta={areaMeta} />

            <div className="mb-12 md:mb-16">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                  {t('faqTitle')}
                </h2>
                <p className="text-sm text-foreground-600">{t('faqSubtitle')}</p>
              </div>
              <FaqAccordion items={faqItems} />
            </div>

            <LandingRelatedContent service={service} isStudioCity={isStudioCity} />

            <LandingInfo isStudioCity={isStudioCity} location={location} nearestStudio={nearestStudio} />
            <LandingEntity isStudioCity={isStudioCity} location={location} nearestStudio={nearestStudio} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ProximityBanner({ location, nearestStudio, timeMin, distanceKm }: { location: string; nearestStudio: string; timeMin: string; distanceKm: string }) {
  return (
    <div className="bg-secondary-100 border border-secondary-200/70 rounded-xl p-4 md:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center bg-secondary-500 rounded-full flex-shrink-0">
        <i className="ri-map-pin-line text-background-50 text-lg" />
      </div>
      <div>
        <p className="text-sm font-semibold text-secondary-900">
          Ние сме само на {timeMin} минути от {location}
        </p>
        <p className="text-xs text-secondary-700 mt-0.5">
          NP Massage Studio няма салон в {location}, но обслужваме клиенти от {location} и региона в студиото ни в {nearestStudio} — само {distanceKm} км. Безплатен паркинг и удобен достъп.
        </p>
      </div>
    </div>
  );
}

function LandingWhy({ whyItems, isStudioCity, service, location, nearestStudio }: { whyItems: string[]; isStudioCity: boolean; service: string; location: string; nearestStudio: string }) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  const title = isStudioCity
    ? t('landingWhy').replace('{service}', service).replace('{location}', location)
    : `Защо клиенти от ${location} избират NP Massage Studio в ${nearestStudio}?`;

  return (
    <div ref={ref} className={`bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70 mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        {title}
      </h2>
      <ul className="space-y-3">
        {whyItems.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm md:text-base text-foreground-700">
            <div className="w-6 h-6 flex items-center justify-center bg-accent-100 rounded-full flex-shrink-0 mt-0.5">
              <i className="ri-check-line text-accent-700 text-xs" />
            </div>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LandingCta({ service, location, isStudioCity }: { service: string; location: string; isStudioCity: boolean }) {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  const ctaTitle = isStudioCity
    ? t('landingCta').replace('{service}', service)
    : `Запази час за ${service} — само на няколко минути от ${location}`;

  const ctaSub = isStudioCity
    ? t('landingCall').replace('{service}', service).replace('{location}', location)
    : `Обадете се на +359 988 926 120 и запазете час за ${service}. Обслужваме клиенти от ${location} всеки ден.`;

  return (
    <div ref={ref} className={`bg-primary-500 rounded-2xl p-6 md:p-8 text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-background-50 mb-3">
        {ctaTitle}
      </h2>
      <p className="text-sm text-background-200/90 mb-5">
        {ctaSub}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/rezervaciya"
          onClick={(e) => { e.preventDefault(); handleNav('/rezervaciya'); }}
          className="inline-flex items-center justify-center px-8 py-4 bg-background-50 text-primary-700 font-medium text-sm rounded-full hover:bg-background-100 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium shadow-sm min-h-[48px]"
        >
          {t('ctaButton')}
        </a>
        <a href="tel:+359988926120" className="inline-flex items-center justify-center px-8 py-4 border border-background-50/40 text-background-50 font-medium text-sm rounded-full hover:bg-background-50/10 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]">
          {t('ctaPhone')} +359 988 926 120
        </a>
      </div>
    </div>
  );
}

function LandingInfo({ isStudioCity, location, nearestStudio }: { isStudioCity: boolean; location: string; nearestStudio: string }) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div ref={ref} className={`bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70 mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-3">
        {t('contactInfoTitle')}
      </h3>
      {isStudioCity ? (
        <p className="text-sm text-foreground-600 mb-4">{t('contactInfoText')}</p>
      ) : (
        <p className="text-sm text-foreground-600 mb-4">
          Обслужваме клиенти от {location} в студиото ни в {nearestStudio}. Можете да се свържете с нас по телефон или имейл за запитвания и резервации. Работим с предварително записване.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 text-sm">
        <a href="tel:+359988926120" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer">
          <i className="ri-phone-line" /> +359 988 926 120
        </a>
        <a href="mailto:npmassagestudiopv@gmail.com" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer">
          <i className="ri-mail-line" /> npmassagestudiopv@gmail.com
        </a>
      </div>
    </div>
  );
}

function LandingEntity({ isStudioCity, location, nearestStudio }: { isStudioCity: boolean; location: string; nearestStudio: string }) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div ref={ref} className={`bg-foreground-50 rounded-2xl p-5 md:p-6 border border-background-200/70 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h3 className="text-sm font-semibold text-foreground-800 mb-2">{t('footerEntity')}</h3>
      {isStudioCity ? (
        <p className="text-xs text-foreground-500 leading-relaxed">{t('entityBlock')}</p>
      ) : (
        <p className="text-xs text-foreground-500 leading-relaxed">
          NP Massage Studio е професионален масажен салон с две физически локации — във Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10). Обслужваме клиенти от {location} и региона в най-близкото ни студио в {nearestStudio}. Предлагаме класически, спортен, антицелулитен масаж, ароматерапия и терапевтични процедури. Телефон: +359 988 926 120. Email: npmassagestudiopv@gmail.com. Работно време: всеки ден, Пон–Пет 09:00–19:00, Съб 09:00–17:00, Нед 10:00–16:00.
        </p>
      )}
    </div>
  );
}

function LandingRelatedContent({ service, isStudioCity }: { service: string; isStudioCity: boolean }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });
  const related = RELATED_CONTENT_MAP[service];
  if (!related || !isStudioCity) return null;

  return (
    <div ref={ref} className={`mb-10 md:mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {related.blogSlugs.length > 0 && (
          <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
            <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4 flex items-center gap-2">
              <i className="ri-article-line text-accent-600" />
              Свързани статии от блога
            </h3>
            <ul className="space-y-2">
              {related.blogSlugs.map((slug) => (
                <li key={slug}>
                  <Link
                    to={`/blog/${slug}`}
                    className="flex items-start gap-2 text-sm text-foreground-700 hover:text-accent-600 transition-colors duration-300 group cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-accent-500 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    <span>{BLOG_TITLE_MAP[slug] || slug}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {related.landingPaths.length > 0 && (
          <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
            <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4 flex items-center gap-2">
              <i className="ri-links-line text-primary-600" />
              Свързана информация
            </h3>
            <ul className="space-y-2">
              {related.landingPaths.map((lp) => (
                <li key={lp.path}>
                  <Link
                    to={lp.path}
                    className="flex items-start gap-2 text-sm text-foreground-700 hover:text-primary-600 transition-colors duration-300 group cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-primary-500 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    <span>{lp.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function LandingTravelInfo({ location, nearestStudio, areaMeta }: { location: string; nearestStudio: string; areaMeta: { timeMin: string; distanceKm: string; nearestAddress: string } | null }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const travelData = OUTREACH_TRAVEL_INFO[location];
  if (!travelData || !areaMeta) return null;

  return (
    <div ref={ref} className={`mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <article className="bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70">
        <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-6 flex items-center gap-2">
          <i className="ri-road-map-line text-accent-500" />
          Как да стигнете от {location} до {nearestStudio}
        </h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-accent-100 rounded-full flex-shrink-0 mt-0.5">
              <i className="ri-navigation-line text-accent-600 text-lg" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground-900 mb-1.5">Маршрут</h3>
              <p className="text-sm text-foreground-600 leading-relaxed">{travelData.directions}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-secondary-100 rounded-full flex-shrink-0 mt-0.5">
              <i className="ri-lightbulb-line text-secondary-600 text-lg" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground-900 mb-1.5">Съвет от нас</h3>
              <p className="text-sm text-foreground-600 leading-relaxed">{travelData.nearbyTips}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-primary-100 rounded-full flex-shrink-0 mt-0.5">
              <i className="ri-user-heart-line text-primary-600 text-lg" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground-900 mb-1.5">Защо клиенти от {location} ни избират</h3>
              <p className="text-sm text-foreground-600 leading-relaxed">{travelData.localInsight}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function LandingSeoContent({ service, location, isStudioCity, nearestStudio, areaMeta }: { service: string; location: string; isStudioCity: boolean; nearestStudio: string; areaMeta: { timeMin: string; distanceKm: string; nearestAddress: string } | null }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const locationData = LOCATION_INTROS[location];
  const locationIntro = locationData ? (locationData[service] || locationData.default || '') : '';
  const serviceBenefit = SERVICE_BENEFITS[service] || SERVICE_BENEFITS['Масажи'] || '';
  const valueProps = VALUE_PROPOSITIONS[location] || VALUE_PROPOSITIONS['Велико Търново'] || [];

  const nearestLabel = isStudioCity ? location : `${nearestStudio} (само на ${areaMeta?.timeMin || 'няколко'} минути от ${location})`;

  const studioText = isStudioCity
    ? `Запишете час още днес — обадете се на +359 988 926 120 или резервирайте онлайн през нашия сайт. Работим всеки ден с удължено работно време: Понеделник–Петък 09:00–19:00, Събота 09:00–17:00 и Неделя 10:00–16:00. Намираме се в ${location}${isStudioCity && STUDIO_ADDRESSES[location] ? ` на ${STUDIO_ADDRESSES[location].address}` : ''}. Очакваме ви!`
    : `Запишете час още днес — обадете се на +359 988 926 120 или резервирайте онлайн. Пътуването от ${location} до ${nearestStudio} отнема само ${areaMeta?.timeMin || 'няколко'} минути — инвестиция, която тялото ви ще оцени. Работим всеки ден: Понеделник–Петък 09:00–19:00, Събота 09:00–17:00 и Неделя 10:00–16:00. Очакваме ви в ${nearestStudio}!`;

  const sectionTitle = isStudioCity
    ? `${service} в ${location} — какво трябва да знаете`
    : `${service} за ${location} — професионална грижа на достъпно разстояние`;

  return (
    <div ref={ref} className={`mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <article className="bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70">
        <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-6">
          {sectionTitle}
        </h2>
        <div className="prose max-w-none text-sm md:text-base text-foreground-700 leading-relaxed space-y-4">
          {locationIntro && <p>{locationIntro}</p>}
          {serviceBenefit && <p>{serviceBenefit}</p>}
          {valueProps.length > 0 && (
            <>
              <p className="font-medium text-foreground-900">
                {isStudioCity
                  ? `Защо да изберете точно тази локация на NP Massage Studio в ${location}:`
                  : `Защо клиентите от ${location} избират да пътуват до ${nearestLabel}:`
                }
              </p>
              <ul className="space-y-2 pl-0 list-none">
                {valueProps.map((prop, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <i className="ri-checkbox-circle-fill text-accent-500 mt-0.5 flex-shrink-0" />
                    <span>{prop}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p>{studioText}</p>
        </div>
      </article>
    </div>
  );
}