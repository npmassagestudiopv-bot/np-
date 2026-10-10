# Readdy: проверка на публикуването и критичен SEO проблем

Проверка: 10 октомври 2026 г., около 19:30 Europe/Sofia. Домейн: https://npmassagestudio.com. Потребителят потвърди, че Pull е през Readdy. Новото английско съдържание от `0a1901c` вече се показва след изпълнение на JavaScript.

## P0: различен HTML за посетител и crawler

Проверките са директни GET заявки без JavaScript, форми, cookie-consent или запис в Supabase. Използвани са обикновен User-Agent и Googlebot User-Agent; допълнително е проверен Facebook User-Agent за `/en/services`.

| Адрес | Обикновена заявка | Googlebot User-Agent |
| --- | --- | --- |
| `/` | HTTP 200, български SPA shell, без H1/main/canonical | HTTP 200, действително съдържание, един H1, правилен canonical, index |
| `/en` | HTTP 200, същият български SPA shell | HTTP 200, българска страница „404“, **noindex, nofollow**, без canonical |
| `/uslugi` и `/en/services` | HTTP 200, същият български SPA shell | HTTP 200, българска страница „404“, **noindex, nofollow**, без canonical |
| `/masazhi-veliko-tarnovo` | HTTP 200, същият български SPA shell | HTTP 200, българска страница „404“, **noindex, nofollow**, без canonical |
| BG/EN класически масаж | HTTP 200, същият български SPA shell | HTTP 200, българска страница „404“, **noindex, nofollow**, без canonical |
| BG/EN статия `polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni` | HTTP 200, същият български SPA shell | HTTP 200, българска страница „404“, **noindex, nofollow**, без canonical |
| Несъществуващ контролен адрес | HTTP 200, SPA shell, index | HTTP 200, „404“, noindex; HTTP статусът трябва да е 404 |

Facebook User-Agent за `/en/services` получава същата „404“ страница като Googlebot. Това засяга и прегледа на споделени връзки.

Това доказва как сървърът реагира на тестовите User-Agent стойности. Не доказва кога действителен Googlebot е обхождал сайта или защо даден URL е отпаднал от индекса. След корекцията се проверява и „Test live URL“ в Search Console.

## Какво е установено и какво предстои

Кодът генерира реален HTML за 103 маршрута в `out/<route>/index.html` и премахва неканоничния alias от build sitemap. Публичният sitemap все още съдържа 103 адреса, а `prerender-manifest.json` не е публично достъпен. Rendered HTML на началната страница съдържа cookie banner и DOM елементи от клиентското приложение, които отсъстват от локалния SSR шаблон. Това насочва към отделно генериране/обслужване на crawler HTML в Readdy; точният механизъм и настройката му не са потвърдени без достъп до проекта.

Официалната документация описва:

- Pull създава нова версия в Readdy; Publish е отделно действие.
- SEO Configuration съдържа настройки по страница и по версия. След промени по страниците се прегенерира SEO и се публикува отново.
- AEO/GEO добавя `llms.txt` и schema; документацията не твърди, че тази опция поправя липсващите HTML подстраници.

Документираните настройки не са доказателство, че повторно Generate само по себе си ще отстрани наблюдаваното поведение.

## Корекция в конкретния Readdy проект

1. Потвърждава се проектът, свързан с `npmassagestudio.com`, и избраната версия след Pull на `0a1901c`.
2. В **SEO Configuration** се проверяват списъкът с маршрути, BG/EN метаданните и настройката Indexable за реалните публични страници. Особено `/en`, `/uslugi`, `/en/services`, лендингът, вложените услуги и статиите.
3. Проверява се publishing pipeline: изпълнява ли се `npm run build`, публикува ли се целият `out`, и обслужват ли се съществуващите `/<route>/index.html` преди SPA fallback. Ако Readdy използва собствен crawler HTML, неговият route list, generation result и cache трябва да покриват същите реални маршрути.
4. Публична съществуваща страница трябва да връща собственото си съдържание и метаданни, без 404/noindex. Истински неизвестен адрес трябва да връща HTTP 404. Проверяват се и обикновената, и crawler заявката.
5. Публикува се проверената версия, следват директна HTTP проверка, отваряне на формите до изпращане и Search Console live inspection. DNS или преместване на хостинга не са необходими за диагностиката.

За тези стъпки е нужен точният линк към проекта и достъп до неговите настройки. В наличната браузърна сесия няма отворен Readdy проект, а при търсене не е намерен Readdy конектор. Репото само по себе си не дава достъп до настройките на хостинга.

## Повторяема проверка

```sh
npm run audit:seo
npm run audit:seo -- --json
npm run audit:seo -- --paths /uslugi,/en/services
npm run audit:seo -- --base-url https://preview.example.com
```

Командата проверява първоначалния HTML с два User-Agent профила, H1, main, език, canonical, hreflang и noindex; проверява и един неизвестен адрес. При проблем излиза с код 1. При preview canonical и hreflang продължават да сочат действителния домейн на студиото. Скриптът прави само GET към посочения origin и не изпълнява JavaScript, формите или Supabase операции.

Тестовете с локален HTTP сървър проверяват както правилна BG/EN публикация, така и точно наблюдавания дефект: посетителят получава правилна страница, а Googlebot получава HTTP 200 с 404/noindex. `npm test`: 12/12 успешно.

Източници: [GitHub sync](https://docs.readdy.ai/integrations/github), [SEO Configuration](https://docs.readdy.ai/features/seo), [React publishing](https://docs.readdy.ai/features/publish-react-v2), [AEO/GEO](https://docs.readdy.ai/features/geo-optimization).
