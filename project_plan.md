# NP Massage Studio - Премиум двуезичен сайт

## 1. Project Description

NP Massage Studio е професионален масажен салон с две локации в България (Велико Търново и Павликени). Сайтът е двуезичен (BG/EN) с фокус върху Local SEO, GEO и AI оптимизация. Целта е да бъде най-добрият масажен сайт за региона с максимална видимост в Google, ChatGPT, Gemini и Perplexity.

**Target audience:** Хора във Велико Търново, Павликени и региона, търсещи професионален масаж.

**Core value:** Масаж Велико Търново — качество и баланс.

## 2. Page Structure

### Основни страници (BG/EN)
| BG Path | EN Path | Описание |
|---------|---------|----------|
| `/` | `/en` | Начало (Home) |
| `/uslugi` | `/en/services` | Услуги |
| `/za-nas` | `/en/about` | За нас |
| `/lokacii` | `/en/locations` | Локации |
| `/blog` | `/en/blog` | Блог |
| `/kontakti` | `/en/contact` | Контакти |

### Landing Pages (SEO локални страници)
| Path | Описание |
|------|----------|
| `/masazhi-veliko-tarnovo` | Масажи Велико Търново |
| `/masazhi-pavlikeni` | Масажи Павликени |
| `/klassicheski-masazh-tarnovo` | Класически масаж Търново |
| `/klassicheski-masazh-pavlikeni` | Класически масаж Павликени |
| `/sporten-masazh-tarnovo` | Спортен масаж Търново |
| `/sporten-masazh-pavlikeni` | Спортен масаж Павликени |
| `/anticeluliten-masazh-tarnovo` | Антицелулитен масаж Търново |
| `/anticeluliten-masazh-pavlikeni` | Антицелулитен масаж Павликени |
| `/aromaterapiya-tarnovo` | Ароматерапия Търново |
| `/aromaterapiya-pavlikeni` | Ароматерапия Павликени |
| `/masazh-grab-tarnovo` | Масаж гръб Търново |
| `/masazh-grab-pavlikeni` | Масаж гръб Павликени |
| `/relaksirasht-masazh-tarnovo` | Релаксиращ масаж Търново |
| `/relaksirasht-masazh-pavlikeni` | Релаксиращ масаж Павликени |

### Блог статии (20+ статии)
- Ползи от класическия масаж
- Спортен срещу класически масаж
- Антицелулитен масаж
- Ароматерапия и стрес
- Масаж при болки в гърба
- Колко често да ходим на масаж
- Масажи Велико Търново - цени
- Масажи Павликени - цени
- Как да изберем масажен салон
- Масаж при бременност
- Масаж след тренировка
- Масаж при стрес и тревожност
- Масаж за спортисти
- Антицелулитна терапия
- Масаж за всички възрасти
- Техники за релаксиращ масаж
- Етерични масла в масажа
- Избор на масажен салон в Търново
- Масаж за имунитет
- Масаж vs остеопатия

### Допълнителни
- `*` - 404 страница

## 3. Core Features

- [ ] Двуезичен интерфейс (BG/EN) с превключвател
- [ ] Responsive дизайн (mobile-first)
- [ ] Premium wellness/spa визуална идентичност
- [ ] SEO оптимизация (Title, Description, H1-H6, Canonical, Hreflang)
- [ ] Schema.org markup (Organization, LocalBusiness, WebPage, FAQPage, Article, BreadcrumbList)
- [ ] FAQ секции на важни страници
- [ ] Breadcrumbs на всички страници
- [ ] Contact form с полета: Име, Телефон, Имейл, Услуга, Локация, Дата, Съобщение
- [ ] Google Maps вграждане за двете локации
- [ ] Entity block на всяка страница
- [ ] Кликваем телефон и имейл
- [ ] CTA секции на всяка страница
- [ ] Blog с TOC (Table of Contents)
- [ ] Internal linking стратегия
- [ ] Alt текст за всички изображения
- [ ] Footer с навигация, контакти, социални мрежи, линкове
- [ ] Админ панел с login, календар, блог управление, съобщения и история на резервации

## 4. Data Model Design

Не е необходима база данни. Сайтът е статичен с:
- i18n JSON файлове за преводи
- Mock данни за услуги, блог статии, отзиви
- Контактна форма чрез get_form_url

## 5. Backend / Third-party Integration Plan

- **Supabase:** Свързан. Използва се за: booking система, блог статии, контактна форма, cookie consent, админ панел с authentication. Таблици: appointments, blog_posts, contact_messages, cookie_consents. Edge Functions: booking, contact, blog-posts, available-slots, telegram-notify.
- **Shopify:** Не е необходим
- **Stripe:** Не е необходим
- **Google Maps:** Вграждане чрез iframe за локации
- **Form submission:** get_form_url за контактна форма

## 6. Development Phase Plan

### Phase 1: Core Foundation & Homepage
- **Goal:** Изграждане на основната архитектура, навигация, i18n, и дизайн система
- **Deliverable:**
  - Tailwind конфигурация със зададени цветове и шрифтове
  - i18n setup (BG/EN) с превключвател
  - Навигация с mobile menu
  - Hero секция на начална страница
  - Services preview секция
  - About/Philosophy секция
  - Footer с всички линкове
  - SEO meta tags за начална страница

### Phase 2: Services & About Pages
- **Goal:** Услуги и За нас страници
- **Deliverable:**
  - /uslugi и /en/services страници с ценоразпис
  - /za-nas и /en/about страници с философия
  - FAQ секции
  - Schema markup

### Phase 3: Locations & Contact
- **Goal:** Локации и контакти страници
- **Deliverable:**
  - /lokacii и /en/locations с Google Maps
  - /kontakti и /en/contact с форма
  - Работно време, адреси, контакти

### Phase 4: Blog Structure
- **Goal:** Блог страница и статии
- **Deliverable:**
  - /blog и /en/blog страница с листинг
  - Blog article template
  - TOC компонент
  - Първи 5 блог статии

### Phase 5: Landing Pages
- **Goal:** SEO landing pages за всеки масаж и локация
- **Deliverable:**
  - 14 landing pages
  - Schema markup за всеки
  - FAQ секции

### Phase 6: Final Blog Articles & SEO Polish
- **Goal:** Останалите блог статии и финални SEO оптимизации
- **Deliverable:**
  - 20+ блог статии
  - Breadcrumbs на всички страници
  - Hreflang тагове
  - Schema markup за всички страници
  - Entity blocks
  - Финални тестове и оптимизации