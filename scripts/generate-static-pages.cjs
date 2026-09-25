#!/usr/bin/env node

/**
 * Static HTML Page Generator for NP Massage Studio
 * Reads the built index.html to extract asset references, then generates SEO-optimized
 * static HTML files for all landing pages, blog posts, and main routes.
 *
 * Usage: node generate-static-pages.cjs --out-dir <path>
 */

const fs = require('fs');
const path = require('path');

const outDirArg = process.argv.indexOf('--out-dir');
const OUTPUT_DIR = outDirArg !== -1 ? process.argv[outDirArg + 1] : path.join(__dirname, '..', 'out');

const BASE_URL = 'https://npmassagestudio.com';
const PHONE = '+359 988 926 120';

// ============================================================
// STEP 1: Read the built index.html to extract asset references
// ============================================================
const builtIndexPath = path.join(OUTPUT_DIR, 'index.html');
if (!fs.existsSync(builtIndexPath)) {
  console.error(`❌ Built index.html not found at ${builtIndexPath}`);
  console.error('   Make sure to run this script AFTER vite build.');
  process.exit(1);
}

const builtHtml = fs.readFileSync(builtIndexPath, 'utf8');

// Extract <head> content (excluding title and meta tags we'll override)
const headMatch = builtHtml.match(/<head>([\s\S]*?)<\/head>/i);
const headContent = headMatch ? headMatch[1] : '';

// Extract all <link> tags
const linkTags = (headContent.match(/<link[^>]*\/?>/gi) || []).join('\n    ');

// Extract all <script> tags from <head>
const headScripts = (headContent.match(/<script[\s\S]*?<\/script>/gi) || []).join('\n    ');

// Extract body scripts (React app bundle)
const bodyMatch = builtHtml.match(/<body>([\s\S]*?)<\/body>/i);
const bodyContent = bodyMatch ? bodyMatch[1] : '';
const bodyScripts = (bodyContent.match(/<script[\s\S]*?<\/script>/gi) || []).join('\n    ');

// Combine all scripts
const allScripts = headScripts + '\n    ' + bodyScripts;

console.log('✅ Extracted asset references from built index.html');

// ============================================================
// STEP 1.5: SPA fallback — rewrite 404.html to load the app.
// Deep links (blog posts, services, landing pages) must resolve
// client-side through React Router instead of redirecting home.
// ============================================================
fs.writeFileSync(path.join(OUTPUT_DIR, '404.html'), builtHtml, 'utf8');
console.log('✅ 404.html rewritten as SPA fallback');

// ============================================================
// STEP 2: Page data
// ============================================================

const services = [
  { slug: 'masazhi', name: 'Масажи' },
  { slug: 'klassicheski-masazh', name: 'Класически масаж' },
  { slug: 'sporten-masazh', name: 'Спортен масаж' },
  { slug: 'anticeluliten-masazh', name: 'Антицелулитен масаж' },
  { slug: 'aromaterapiya', name: 'Ароматерапия' },
  { slug: 'masazh-grab', name: 'Масаж на гръб' },
  { slug: 'relaksirasht-masazh', name: 'Релаксиращ масаж' },
  { slug: 'lecheben-masazh', name: 'Лечебен масаж' },
];

const cities = [
  { slug: 'tarnovo', name: 'Велико Търново', base: 'Велико Търново', travel: '' },
  { slug: 'pavlikeni', name: 'Павликени', base: 'Павликени', travel: '' },
  { slug: 'gabrovo', name: 'Габрово', base: 'Велико Търново', travel: ' (само на 45 мин от Габрово)' },
  { slug: 'gorna-oryahovitsa', name: 'Горна Оряховица', base: 'Велико Търново', travel: ' (само на 15 мин от Горна Оряховица)' },
  { slug: 'lyaskovets', name: 'Лясковец', base: 'Велико Търново', travel: ' (само на 15 мин от Лясковец)' },
  { slug: 'sevlievo', name: 'Севлиево', base: 'Павликени', travel: ' (само на 30 мин от Севлиево)' },
];

const additionalPages = [
  { slug: 'masazh-pri-bolki-v-garba', title: 'Масаж при болки в гърба | NP Massage Studio Велико Търново', desc: 'Професионален масаж при болки в гърба от NP Massage Studio във Велико Търново. Облекчаване на схванат гръб, дискова болка и мускулно напрежение. Запазете час на ' + PHONE + '.', kw: 'масаж при болки в гърба, болки в гърба Велико Търново, схванат гръб масаж, дискова болка терапия, NP Massage Studio' },
  { slug: 'masazh-pri-stres-i-naprejenie', title: 'Масаж при стрес и напрежение | NP Massage Studio', desc: 'Масаж при стрес и нервно напрежение в NP Massage Studio. Релаксиращ и ароматерапевтичен масаж за намаляване на стреса във Велико Търново и Павликени. ' + PHONE + '.', kw: 'масаж при стрес, масаж при напрежение, релаксиращ масаж Велико Търново, ароматерапия стрес, NP Massage Studio' },
  { slug: 'masazh-za-vazstanovyavane-sled-trenirovka', title: 'Масаж за възстановяване след тренировка | NP Massage Studio', desc: 'Спортен масаж за бързо възстановяване след тренировка в NP Massage Studio. Намалява мускулната треска, подобрява гъвкавостта и предотвратява травми. ' + PHONE + '.', kw: 'масаж след тренировка, възстановяване масаж, спортен масаж Велико Търново, мускулна треска, NP Massage Studio' },
  { slug: 'masazh-pri-glavobolie', title: 'Масаж при главоболие | NP Massage Studio Велико Търново', desc: 'Масаж при главоболие от напрежение в NP Massage Studio. Облекчаване на тензионно главоболие чрез масаж на врата, раменете и горната част на гърба. ' + PHONE + '.', kw: 'масаж при главоболие, тензионно главоболие, масаж врат рамене, главоболие терапия, NP Massage Studio' },
  { slug: 'masazh-pri-shvanat-vrat', title: 'Масаж при схванат врат | NP Massage Studio Велико Търново', desc: 'Професионален масаж при схванат врат в NP Massage Studio. Облекчаване на мускулно напрежение, възстановяване на подвижността. ' + PHONE + '.', kw: 'масаж при схванат врат, схванат врат масаж, болка във врата, масаж врат Велико Търново, NP Massage Studio' },
  { slug: 'turski-masazh-tarnovo', title: 'Турски масаж Велико Търново | NP Massage Studio', desc: 'Традиционен турски масаж във Велико Търново с етерични масла. Дълбоко релаксираща процедура в NP Massage Studio. ' + PHONE + '.', kw: 'турски масаж, турски масаж Велико Търново, традиционен масаж, NP Massage Studio' },
  { slug: 'dubok-takannen-masazh-tarnovo', title: 'Дълбок тъканен масаж Велико Търново | NP Massage Studio', desc: 'Дълбок тъканен масаж във Велико Търново от NP Massage Studio. Професионална терапия за хронични мускулни болки, схващания и напрежение. ' + PHONE + '.', kw: 'дълбок тъканен масаж, дълбок масаж Велико Търново, хронични болки масаж, NP Massage Studio' },
  { slug: 'masazhno-studio-veliko-tarnovo', title: 'Масажно студио Велико Търново | NP Massage Studio', desc: 'NP Massage Studio — професионално масажно студио във Велико Търново на бул. България 72. Класически, спортен, антицелулитен масаж, ароматерапия. ' + PHONE + '.', kw: 'масажно студио Велико Търново, масажен салон Търново, масажи Търново, NP Massage Studio' },
  { slug: 'profesionalen-masazh-veliko-tarnovo', title: 'Професионален масаж Велико Търново | NP Massage Studio', desc: 'Професионален масаж във Велико Търново от NP Massage Studio. Квалифицирани терапевти, модерно оборудване, персонализиран подход. ' + PHONE + '.', kw: 'професионален масаж, качествен масаж Велико Търново, квалифицирани терапевти, NP Massage Studio' },
  { slug: 'masazh-pri-diskopatiya', title: 'Масаж при дископатия Велико Търново | NP Massage Studio', desc: 'Професионален терапевтичен масаж при дископатия в NP Massage Studio Велико Търново. Облекчаване на болки при дискова херния и гръбначни проблеми. ' + PHONE + '.', kw: 'масаж при дископатия, дискова херния масаж, гръбначни проблеми, NP Massage Studio' },
  { slug: 'naj-dobar-masazh-veliko-tarnovo', title: 'Кой е най-добрият масаж във Велико Търново? | NP Massage Studio', desc: 'Търсите най-добрия масаж във Велико Търново? NP Massage Studio предлага 6 вида професионални масажни терапии с отлични отзиви. Цени от 15 €. ' + PHONE + '.', kw: 'най-добър масаж Велико Търново, най-добро масажно студио, качествен масаж, NP Massage Studio' },
  { slug: 'kade-lecheben-masazh-veliko-tarnovo', title: 'Къде да си направя лечебен масаж във Велико Търново? | NP Massage Studio', desc: 'Търсите къде да си направите лечебен масаж във Велико Търново? NP Massage Studio на бул. България 72 предлага професионален терапевтичен масаж. ' + PHONE + '.', kw: 'лечебен масаж Велико Търново, терапевтичен масаж, масаж при болки, NP Massage Studio' },
  { slug: 'koj-masazh-pri-bolki-v-krasta', title: 'Кой масаж е подходящ при болки в кръста? | NP Massage Studio', desc: 'Кой масаж помага при болки в кръста? NP Massage Studio препоръчва лечебен, дълбок тъканен и спортен масаж. ' + PHONE + '.', kw: 'болки в кръста масаж, лумбални болки, масаж кръст, NP Massage Studio' },
  { slug: 'polzi-ot-redoven-masazh', title: 'Какви са ползите от редовния масаж? | NP Massage Studio', desc: 'Какви са ползите от редовния масаж? Намаляване на стреса, облекчаване на мускулни болки, по-добър сън и по-силна имунна система. ' + PHONE + '.', kw: 'ползи от масаж, редовен масаж ползи, защо да ходя на масаж, NP Massage Studio' },
];

const blogPosts = [
  { slug: 'polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni', title: 'Ползи от класическия масаж за тялото и ума в NP Massage Studio', kw: 'класически масаж ползи, масаж Велико Търново, релакс и възстановяване, NP Massage Studio' },
  { slug: 'sporten-masazh-vazstanovyavane-veliko-tarnovo', title: 'Спортен масаж: възстановяване и превенция на травми в NP Massage Studio', kw: 'спортен масаж, възстановяване след тренировка, спортна терапия, NP Massage Studio' },
  { slug: 'anticeluliten-masazh-rezultati-pavlikeni', title: 'Антицелулитен масаж: как работи и какви резултати да очаквате в NP Massage Studio', kw: 'антицелулитен масаж, резултати целулит, масаж Павликени, NP Massage Studio' },
  { slug: 'aromaterapiya-eterichni-masla-veliko-tarnovo', title: 'Ароматерапия: етерични масла за дълбок релакс в NP Massage Studio', kw: 'ароматерапия, етерични масла, релакс Велико Търново, NP Massage Studio' },
  { slug: 'masazh-stres-oblekchavane-veliko-tarnovo', title: 'Масаж за облекчаване на стреса: техники и съвети от NP Massage Studio', kw: 'масаж стрес, облекчаване стрес, релаксиращ масаж, NP Massage Studio' },
  { slug: 'kolko-chesto-masazh-rutina-np-massage', title: 'Колко често трябва да ходите на масаж? Оптимална рутина от NP Massage Studio', kw: 'колко често масаж, масаж рутина, оптимален график, NP Massage Studio' },
  { slug: 'masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo', title: 'Пълно ръководство за масажи във Велико Търново и Павликени — NP Massage Studio', kw: 'масажи Велико Търново, масажи Павликени, видове масажи, NP Massage Studio' },
  { slug: 'chastichen-masazh-grab-oblekchavane-veliko-tarnovo', title: 'Частичен масаж на гръб: бързо облекчаване на напрежението в NP Massage Studio', kw: 'частичен масаж гръб, масаж гръб Велико Търново, напрежение врат, NP Massage Studio' },
  { slug: 'pomaga-li-masazhat-pri-diskopatiya', title: 'Помага ли масажът при дископатия? | NP Massage Studio Велико Търново', kw: 'масаж дископатия, дискова херния, терапевтичен масаж, NP Massage Studio' },
  { slug: 'razlika-lecheben-sporten-masazh', title: 'Каква е разликата между лечебен и спортен масаж? | NP Massage Studio', kw: 'лечебен масаж, спортен масаж, разлика масажи, NP Massage Studio' },
  { slug: 'kolko-vreme-trae-edin-masazh', title: 'Колко време трае един масаж? | NP Massage Studio Велико Търново', kw: 'колко време масаж, продължителност масаж, видове масажи, NP Massage Studio' },
  { slug: 'digitalen-marketing-np-massage-studio-veliko-tarnovo', title: 'Как дигиталният маркетинг помогна на NP Massage Studio да достигне повече клиенти във Велико Търново', kw: 'дигитален маркетинг, SEO Велико Търново, онлайн реклама, NP Massage Studio' },
  { slug: 'zashto-masazhno-studio-investira-digitalen-marketing-2026', title: 'Защо всяко масажно студио във Велико Търново трябва да инвестира в дигитален маркетинг през 2026', kw: 'дигитален маркетинг, масажно студио маркетинг, SEO масажен салон, NP Massage Studio' },
  { slug: 'masazhni-studia-veliko-tarnovo-seo-online-reklama', title: 'Как масажните студиа във Велико Търново печелят повече клиенти чрез SEO и онлайн реклама', kw: 'масажни студиа маркетинг, SEO масажи, онлайн реклама Велико Търново, NP Massage Studio' },
];

const mainPages = [
  { slug: 'uslugi', title: 'Услуги и цени | Масажи Велико Търново и Павликени | NP Massage Studio', desc: 'Пълен списък с масажни услуги и цени. Класически масаж 25€, спортен 25€, антицелулитен 20€, ароматерапия 30€, масаж на гръб 15€. Велико Търново и Павликени. ' + PHONE + '.', kw: 'масажни услуги, цени масажи, класически масаж цена, спортен масаж цена, антицелулитен масаж цена, ароматерапия цена, NP Massage Studio' },
  { slug: 'blog', title: 'Блог за масажи, здраве и релаксация | NP Massage Studio', desc: 'Блог на NP Massage Studio — статии за масажи, здраве, релаксация и уелнес. Практически съвети от професионални терапевти във Велико Търново и Павликени.', kw: 'блог масажи, статии масаж, здраве релаксация, масажна терапия, уелнес блог, NP Massage Studio' },
  { slug: 'kontakti', title: 'Контакти | NP Massage Studio — Велико Търново и Павликени', desc: 'Свържете се с NP Massage Studio. Адреси: Велико Търново, бул. България 72 и Павликени, ул. Атанас Дончев 10. ' + PHONE + '.', kw: 'контакти масажен салон, адрес NP Massage Studio, телефон масажи, локация' },
  { slug: 'za-nas', title: 'За нас | NP Massage Studio — Професионални масажи от 2019', desc: 'NP Massage Studio е професионален масажен салон във Велико Търново и Павликени. Квалифицирани терапевти, модерно оборудване, цени от 15 €.', kw: 'за нас масажен салон, NP Massage Studio история, професионални масажисти, масажно студио' },
  { slug: 'lokacii', title: 'Локации | NP Massage Studio — Велико Търново и Павликени', desc: 'NP Massage Studio на две локации: Велико Търново, бул. България 72 и Павликени, ул. Атанас Дончев 10. ' + PHONE + '.', kw: 'локации масажен салон, адрес Велико Търново, адрес Павликени, NP Massage Studio' },
  { slug: 'vaucheri', title: 'Подаръчни ваучери за масаж | NP Massage Studio', desc: 'Подаръчни ваучери за масаж в NP Massage Studio. Идеален подарък за рожден ден, годишнина или специален повод. Велико Търново и Павликени. ' + PHONE + '.', kw: 'подаръчен ваучер масаж, ваучер масаж, подарък масаж, NP Massage Studio' },
  { slug: 'rezervaciya', title: 'Резервация на масаж онлайн | NP Massage Studio', desc: 'Запазете час за масаж онлайн в NP Massage Studio. Бърза и лесна резервация 24/7 за Велико Търново и Павликени. ' + PHONE + '.', kw: 'резервация масаж, онлайн резервация, запази час масаж, NP Massage Studio' },
  { slug: 'sravnenie-na-masazhi', title: 'Сравнение на масажи | Кой масаж е за мен? | NP Massage Studio', desc: 'Сравнение на всички видове масажи в NP Massage Studio. Цени, продължителност, ползи. ' + PHONE + '.', kw: 'сравнение масажи, кой масаж да избера, видове масажи, NP Massage Studio' },
  { slug: 'za-np-massage-studio', title: 'NP Massage Studio | Юридическа информация и ЕИК', desc: 'Юридическа информация за NP Massage Studio. Управител, ЕИК, адреси. ' + PHONE + '.', kw: 'NP Massage Studio ЕИК, юридическа информация, данни фирма' },
];

// ============================================================
// STEP 3: HTML template builder
// ============================================================

function buildHtml({ title, description, keywords, canonicalPath, textContent, depth }) {
  const prefix = depth === 0 ? '.' : '..';
  const geoTagBlock = depth === 0
    ? `<meta name="geo.placename" content="Велико Търново, България" />
    <meta name="geo.region" content="BG-04" />
    <meta name="geo.position" content="43.081037;25.612733" />
    <meta name="ICBM" content="43.081037, 25.612733" />`
    : '';

  return `<!doctype html>
<html lang="bg">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    ${geoTagBlock}
    <meta name="author" content="NP Massage Studio" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="last-modified" content="${new Date().toISOString().split('T')[0]}" />
    <link rel="canonical" href="${BASE_URL}${canonicalPath}" />
    <link rel="alternate" hreflang="bg" href="${BASE_URL}${canonicalPath}" />
    <link rel="alternate" hreflang="x-default" href="${BASE_URL}${canonicalPath}" />
    <meta property="og:locale" content="bg_BG" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${BASE_URL}${canonicalPath}" />
    <meta property="og:site_name" content="NP Massage Studio" />
    <meta name="twitter:card" content="summary_large_image" />
    ${linkTags}
    ${allScripts}
  </head>
  <body>
    ${textContent}
  </body>
</html>`;
}

// ============================================================
// STEP 4: Content generators
// ============================================================

function landingContent(serviceName, cityName, travelInfo) {
  const serviceDesc = getServiceDesc(serviceName);
  const locDesc = getLocationDesc(cityName, travelInfo);

  return `
    <div id="root">
      <div id="static-seo-content" style="padding:2rem;max-width:860px;margin:0 auto;font-family:Inter,system-ui,sans-serif;line-height:1.7;color:#1a1a1a;">
        <header style="margin-bottom:2.5rem;text-align:center;">
          <h1 style="font-size:2rem;font-weight:700;color:#1a4734;margin-bottom:1rem;line-height:1.3;">${serviceName} — ${cityName}${travelInfo}</h1>
          <p style="font-size:1.05rem;color:#555;max-width:650px;margin:0 auto;">Професионален ${serviceName.toLowerCase()} от NP Massage Studio. Квалифицирани терапевти, достъпни цени и персонализиран подход за всеки клиент.</p>
        </header>
        <main style="font-size:1rem;">
          <section style="margin-bottom:2rem;">
            <p style="margin-bottom:1rem;">${locDesc}</p>
            <p style="margin-bottom:1rem;">${serviceDesc}</p>
          </section>
          <section style="margin-bottom:2rem;background:#f3f4f6;padding:1.5rem;border-radius:8px;">
            <h3 style="font-size:1.1rem;font-weight:600;color:#1a4734;margin-bottom:0.75rem;">Запазете час сега</h3>
            <p style="margin-bottom:0.5rem;">Телефон: <strong><a href="tel:+359988926120" style="color:#1a4734;">${PHONE}</a></strong></p>
            <p style="margin-bottom:0.5rem;">Работно време: Пн–Пт 09:00–19:00 | Сб 09:00–17:00 | Нд 10:00–16:00</p>
            <p style="margin-bottom:0;">Локации: Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10)</p>
          </section>
        </main>
        <footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;text-align:center;font-size:0.85rem;color:#777;">
          <p style="margin-bottom:0.5rem;"><strong>NP Massage Studio</strong></p>
          <p style="margin-bottom:0.5rem;"><a href="${BASE_URL}" style="color:#1a4734;">Начало</a> | <a href="${BASE_URL}/uslugi" style="color:#1a4734;">Услуги</a> | <a href="${BASE_URL}/kontakti" style="color:#1a4734;">Контакти</a> | <a href="${BASE_URL}/rezervaciya" style="color:#1a4734;">Резервация</a></p>
        </footer>
      </div>
    </div>`;
}

function getServiceDesc(name) {
  const descs = {
    'Масажи': 'NP Massage Studio предлага пълна гама от професионални масажни услуги: класически масаж (60 мин, 25 €), спортен масаж (60 мин, 25 €), антицелулитен масаж (40 мин, 20 €), ароматерапия (60 мин, 30 €) и частичен масаж на гръб (40 мин, 15 €). Всяка процедура започва с кратка консултация и се изпълнява с висококачествени натурални масла.',
    'Класически масаж': 'Класическият масаж (60 мин, 25 €) е универсална терапия за всеки. Терапевтът работи върху гърба, раменете, врата, ръцете и краката, редувайки ефлораж, петрисаж и фрикция. Резултатът е пълно отпускане, подобрено кръвообращение и трайно чувство на лекота.',
    'Спортен масаж': 'Спортният масаж (60 мин, 25 €) е по-интензивен и се фокусира върху натоварените мускулни групи. Използва дълбоки манипулации, компресии и разтягания за ускоряване на възстановяването и предотвратяване на травми.',
    'Антицелулитен масаж': 'Антицелулитният масаж (40 мин, 20 €) комбинира дълбоки манипулации с техники за стимулиране на кръвообращението и лимфния дренаж. Предлага се и пакет от 10 процедури на цена 175 €.',
    'Ароматерапия': 'Ароматерапията (60 мин, 30 €) съчетава масаж с чисти етерични масла (лавандула, евкалипт, розмарин, цитруси) за дълбоко психо-емоционално и физическо балансиране.',
    'Масаж на гръб': 'Частичният масаж на гръб (40 мин, 15 €) е фокусиран върху гърба, раменете и врата — зоните, които най-често страдат от заседналия начин на живот. Бързо, достъпно и ефективно решение.',
    'Релаксиращ масаж': 'Релаксиращият масаж (60 мин, 25 €) използва бавни, плавни движения за успокояване на нервната система и понижаване на нивата на кортизол. Идеален за хора с хроничен стрес.',
    'Лечебен масаж': 'Лечебният масаж (60 мин, 25 €) започва с обстойна консултация и е насочен към специфични здравословни проблеми — болки в гърба, дископатия, схванат врат и мускулни дисбаланси.',
  };
  return descs[name] || `Професионален ${name.toLowerCase()} в NP Massage Studio с индивидуален подход и достъпни цени.`;
}

function getLocationDesc(city, travel) {
  if (city === 'Велико Търново') return 'NP Massage Studio се намира в сърцето на Велико Търново, на бул. България 72 — в уютен и лесно достъпен квартал само на няколко минути от центъра, с удобен паркинг. Студиото е проектирано така, че още с влизането да усетите спокойствие и релакс.';
  if (city === 'Павликени') return 'NP Massage Studio в Павликени се намира на ул. Атанас Дончев 10, в самия център на града. Студиото е обзаведено с модерно оборудване в уютна, спокойна атмосфера с удобен достъп и паркинг.';
  return `NP Massage Studio обслужва клиенти от ${city} в студиото си във Велико Търново${travel}. Пътят е кратък и удобен с добри пътни връзки и достатъчно паркоместа пред студиото.`;
}

function blogContent(title) {
  return `
    <div id="root">
      <div id="static-seo-content" style="padding:2rem;max-width:860px;margin:0 auto;font-family:Inter,system-ui,sans-serif;line-height:1.7;color:#1a1a1a;">
        <header style="margin-bottom:2rem;">
          <h1 style="font-size:2rem;font-weight:700;color:#1a4734;margin-bottom:1rem;line-height:1.3;">${title}</h1>
        </header>
        <main style="font-size:1rem;">
          <p style="margin-bottom:1rem;">Тази статия от блога на NP Massage Studio разглежда важна тема за масажите, здравето и благосъстоянието. Нашите терапевти споделят знания, натрупани през годините работа с клиенти от Велико Търново, Павликени и целия регион.</p>
          <p style="margin-bottom:1rem;">NP Massage Studio предлага класически, спортен, антицелулитен масаж, ароматерапия и частичен масаж на гръб на достъпни цени от 15 €. Две локации: Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10).</p>
          <p>За повече информация: <strong><a href="tel:+359988926120" style="color:#1a4734;">${PHONE}</a></strong></p>
        </main>
        <footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;text-align:center;font-size:0.85rem;color:#777;">
          <p style="margin-bottom:0.5rem;"><a href="${BASE_URL}" style="color:#1a4734;">Начало</a> | <a href="${BASE_URL}/blog" style="color:#1a4734;">Блог</a> | <a href="${BASE_URL}/kontakti" style="color:#1a4734;">Контакти</a></p>
        </footer>
      </div>
    </div>`;
}

function mainContent(slug, title) {
  const htmlTitle = title.replace(/\|.*/, '').trim();
  let specificContent = '';
  if (slug === 'uslugi') {
    specificContent = `<h2 style="font-size:1.4rem;font-weight:600;color:#1a4734;margin-bottom:1rem;">Нашите услуги</h2>
      <ul style="padding-left:1.5rem;margin-bottom:1rem;">
        <li style="margin-bottom:0.5rem;"><strong>Класически масаж</strong> — 60 мин, 25 €</li>
        <li style="margin-bottom:0.5rem;"><strong>Спортен масаж</strong> — 60 мин, 25 €</li>
        <li style="margin-bottom:0.5rem;"><strong>Антицелулитен масаж</strong> — 40 мин, 20 €</li>
        <li style="margin-bottom:0.5rem;"><strong>Ароматерапия</strong> — 60 мин, 30 €</li>
        <li style="margin-bottom:0.5rem;"><strong>Частичен масаж на гръб</strong> — 40 мин, 15 €</li>
      </ul>`;
  } else if (slug === 'kontakti') {
    specificContent = `<p style="margin-bottom:0.5rem;"><strong>Велико Търново:</strong> бул. България 72</p>
      <p style="margin-bottom:0.5rem;"><strong>Павликени:</strong> ул. Атанас Дончев 10</p>
      <p style="margin-bottom:0.5rem;"><strong>Телефон:</strong> <a href="tel:+359988926120" style="color:#1a4734;">${PHONE}</a></p>
      <p style="margin-bottom:0.5rem;"><strong>Работно време:</strong> Пн–Пт 09:00–19:00, Сб 09:00–17:00, Нд 10:00–16:00</p>`;
  }

  return `
    <div id="root">
      <div id="static-seo-content" style="padding:2rem;max-width:860px;margin:0 auto;font-family:Inter,system-ui,sans-serif;line-height:1.7;color:#1a1a1a;">
        <header style="margin-bottom:2rem;">
          <h1 style="font-size:2rem;font-weight:700;color:#1a4734;margin-bottom:0.5rem;line-height:1.3;">${htmlTitle}</h1>
        </header>
        <main style="font-size:1rem;">
          ${specificContent}
          <p style="margin-bottom:1rem;">NP Massage Studio е вашият доверен партньор за професионални масажи във Велико Търново и Павликени. С две удобни локации и екип от опитни терапевти, предлагаме качествени масажни услуги на достъпни цени.</p>
          <p>Запазете час: <strong><a href="tel:+359988926120" style="color:#1a4734;">${PHONE}</a></strong></p>
        </main>
        <footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;text-align:center;font-size:0.85rem;color:#777;">
          <p style="margin-bottom:0.5rem;"><a href="${BASE_URL}" style="color:#1a4734;">Начало</a> | <a href="${BASE_URL}/uslugi" style="color:#1a4734;">Услуги</a> | <a href="${BASE_URL}/kontakti" style="color:#1a4734;">Контакти</a></p>
        </footer>
      </div>
    </div>`;
}

// ============================================================
// STEP 5: Generate all pages
// ============================================================

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function writePage(dirName, fileName, html) {
  const dirPath = path.join(OUTPUT_DIR, dirName);
  ensureDir(dirPath);
  fs.writeFileSync(path.join(dirPath, fileName), html, 'utf8');
}

let count = 0;

console.log('\n📄 Generating landing pages...');
for (const service of services) {
  for (const city of cities) {
    // Only valid combinations
    if (['relaksirasht-masazh', 'lecheben-masazh'].includes(service.slug) && !['tarnovo', 'pavlikeni'].includes(city.slug)) continue;
    if (service.slug === 'masazh-grab' && !['tarnovo', 'pavlikeni'].includes(city.slug)) continue;
    // lecheben-masazh-pavlikeni is not in the router, skip it
    if (service.slug === 'lecheben-masazh' && city.slug === 'pavlikeni') continue;

    // "Масажи + Велико Търново" uses veliko-tarnovo (matching router & sitemap)
    let citySlug = city.slug;
    if (service.slug === 'masazhi' && city.slug === 'tarnovo') {
      citySlug = 'veliko-tarnovo';
    }
    const pageSlug = `${service.slug}-${citySlug}`;
    const isDirect = ['tarnovo', 'pavlikeni'].includes(city.slug);
    const titleSuffix = isDirect ? `| NP Massage Studio` : `| NP Massage Studio — ${city.name}`;
    const title = `${service.name} ${isDirect ? city.name : 'за ' + city.name} ${titleSuffix}`;
    const desc = `Професионален ${service.name.toLowerCase()} ${isDirect ? 'в ' + city.name : 'за клиенти от ' + city.name} от NP Massage Studio${city.travel}. ${isDirect ? 'В студиото ни в ' + city.base + '.' : ''} Запазете час на ${PHONE}.`;
    const kw = `${service.name.toLowerCase()} ${city.name}, ${service.name.toLowerCase()}, масажи ${city.name}, NP Massage Studio, професионален масаж`;

    const html = buildHtml({
      title, description: desc, keywords: kw,
      canonicalPath: `/${pageSlug}`,
      textContent: landingContent(service.name, city.name, city.travel),
      depth: 0,
    });
    writePage(pageSlug, 'index.html', html);
    count++;
  }
}

console.log('📄 Generating additional landing pages...');
for (const p of additionalPages) {
  const namePart = p.title.split('|')[0].trim();
  const html = buildHtml({
    title: p.title, description: p.desc, keywords: p.kw,
    canonicalPath: `/${p.slug}`,
    textContent: landingContent(namePart, 'Велико Търново', ''),
    depth: 0,
  });
  writePage(p.slug, 'index.html', html);
  count++;
}

console.log('📝 Generating blog post pages...');
for (const p of blogPosts) {
  const desc = `Статия от блога на NP Massage Studio: ${p.title}. Професионални масажи във Велико Търново и Павликени. ${PHONE}.`;
  const html = buildHtml({
    title: p.title, description: desc, keywords: p.kw,
    canonicalPath: `/blog/${p.slug}`,
    textContent: blogContent(p.title),
    depth: 1,
  });
  writePage(`blog/${p.slug}`, 'index.html', html);
  count++;
}

console.log('🏠 Generating main pages...');
for (const p of mainPages) {
  const desc = p.desc || `NP Massage Studio — професионални масажи във Велико Търново и Павликени. ${PHONE}.`;
  const kw = p.kw || 'NP Massage Studio, масажи Велико Търново, масажи Павликени';
  const html = buildHtml({
    title: p.title, description: desc, keywords: kw,
    canonicalPath: `/${p.slug}`,
    textContent: mainContent(p.slug, p.title),
    depth: 0,
  });
  writePage(p.slug, 'index.html', html);
  count++;
}

console.log(`\n✨ Done! Generated ${count} static HTML pages in: ${OUTPUT_DIR}\n`);