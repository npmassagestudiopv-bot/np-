import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import FaqAccordion from '@/components/feature/FaqAccordion';
import CtaBanner from '@/components/feature/CtaBanner';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { serviceDetailMap, serviceDetails, serviceSlugToNameKey } from '@/mocks/serviceDetails';
import EntityBlock from '@/pages/home/components/EntityBlock';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildFaqSchema,
  buildWebPageSchema,
  buildPersonSchema,
  buildProductSchema,
  buildHowToSchema,
} from '@/lib/seoSchemas';

const serviceSlugMap: Record<string, string> = {
  'klasicheski-masazh': 'classical',
  'sporten-masazh': 'sport',
  'anticeluliten-masazh': 'anticellulite',
  'aromaterapiya': 'aromatherapy',
  'masazh-na-grab': 'back',
};

function getSlugForPath(slug: string): string {
  return serviceSlugMap[slug] || slug;
}

function getServiceNameBg(slug: string): string {
  const map: Record<string, string> = {
    'klasicheski-masazh': 'Класически и релаксиращ масаж',
    'sporten-masazh': 'Спортен и терапевтичен масаж',
    'anticeluliten-masazh': 'Антицелулитен масаж',
    'aromaterapiya': 'Ароматерапия',
    'masazh-na-grab': 'Частичен масаж на гръб',
  };
  return map[slug] || slug;
}

function getServiceNameEn(slug: string): string {
  const map: Record<string, string> = {
    'klasicheski-masazh': 'Classical & Relaxing Massage',
    'sporten-masazh': 'Sports & Therapeutic Massage',
    'anticeluliten-masazh': 'Anti-cellulite Massage',
    'aromaterapiya': 'Aromatherapy',
    'masazh-na-grab': 'Partial Back Massage',
  };
  return map[slug] || slug;
}

function getRelatedBlogTitleBg(slug: string): string {
  const map: Record<string, string> = {
    'polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni': 'Ползи от класическия масаж',
    'sporten-masazh-vazstanovyavane-veliko-tarnovo': 'Спортен масаж: възстановяване и превенция',
    'anticeluliten-masazh-rezultati-pavlikeni': 'Антицелулитен масаж: резултати',
    'aromaterapiya-eterichni-masla-veliko-tarnovo': 'Ароматерапия: етерични масла',
    'masazh-stres-oblekchavane-veliko-tarnovo': 'Масаж за облекчаване на стреса',
    'kolko-chesto-masazh-rutina-np-massage': 'Колко често да ходите на масаж?',
    'masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo': 'Пълно ръководство за масажи',
    'chastichen-masazh-grab-oblekchavane-veliko-tarnovo': 'Частичен масаж на гръб',
  };
  return map[slug] || slug;
}

function getRelatedBlogTitleEn(slug: string): string {
  const map: Record<string, string> = {
    'polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni': 'Benefits of Classical Massage',
    'sporten-masazh-vazstanovyavane-veliko-tarnovo': 'Sports Massage: Recovery & Prevention',
    'anticeluliten-masazh-rezultati-pavlikeni': 'Anti-Cellulite Massage: Results',
    'aromaterapiya-eterichni-masla-veliko-tarnovo': 'Aromatherapy: Essential Oils',
    'masazh-stres-oblekchavane-veliko-tarnovo': 'Massage for Stress Relief',
    'kolko-chesto-masazh-rutina-np-massage': 'How Often to Get a Massage?',
    'masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo': 'Complete Guide to Massages',
    'chastichen-masazh-grab-oblekchavane-veliko-tarnovo': 'Partial Back Massage',
  };
  return map[slug] || slug;
}

function getRelatedServiceNameBg(slug: string): string {
  return getServiceNameBg(slug);
}

function getRelatedServiceNameEn(slug: string): string {
  return getServiceNameEn(slug);
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { getPath, handleNav } = useLocalizedNav();

  const isEn = getPath('').startsWith('/en');
  const detail = slug ? serviceDetailMap[slug] : undefined;

  const content = detail ? (isEn ? detail.en : detail.bg) : null;

  const seoTitle = content ? `${content.title} | NP Massage Studio — Велико Търново и Павликени` : '';
  const seoDesc = content ? `${content.heroDescription} Резервирайте онлайн или на +359 988 926 120.` : '';

  const enSeoTitle = content ? `${content.title} | NP Massage Studio — Veliko Tarnovo & Pavlikeni` : '';
  const enSeoDesc = content ? `${content.heroDescription} Book online or call +359 988 926 120.` : '';

  const bgPath = slug ? `/uslugi/${slug}` : '';
  const enPath = slug ? `/en/services/${slug}` : '';

  const serviceName = isEn ? getServiceNameEn(slug || '') : getServiceNameBg(slug || '');

  const howToBook = useMemo(() => {
    if (!slug) return null;
    const name = getServiceNameBg(slug);
    return buildHowToSchema(
      `Как да си запазите час за ${name} в NP Massage Studio`,
      `Стъпка по стъпка инструкции за резервация на ${name} в NP Massage Studio — Велико Търново и Павликени.`,
      [
        { name: 'Изберете локация', text: `NP Massage Studio предлага ${name} във Велико Търново (бул. България 72) и в Павликени (ул. Атанас Дончев 10).` },
        { name: 'Изберете дата и час', text: 'Проверете наличните часове и изберете удобна за вас дата. Работим всеки ден от 09:00 до 19:00.' },
        { name: 'Запазете час', text: `Обадете се на +359 988 926 120 или попълнете онлайн формата за резервация за ${name}.` },
        { name: 'Потвърдете резервацията', text: 'Ще получите потвърждение по телефон в рамките на 2 часа. Пристигнете навреме и се насладете на процедурата!' },
      ]
    );
  }, [slug]);

  const productSchema = useMemo(() => {
    if (!content || !slug) return null;
    const pathSlug = getSlugForPath(slug);
    const priceMap: Record<string, string> = {
      'klasicheski-masazh': '25',
      'sporten-masazh': '25',
      'anticeluliten-masazh': '20',
      'aromaterapiya': '30',
      'masazh-na-grab': '15',
    };
    const price = priceMap[slug] || '25';
    return buildProductSchema(content.title, content.subtitle, price, 'EUR', undefined, pathSlug);
  }, [content, slug]);

  useSeo(useMemo(() => ({
    title: isEn ? enSeoTitle : seoTitle,
    description: isEn ? enSeoDesc : seoDesc,
    canonical: isEn ? enPath : bgPath,
    lastModified: '2026-08-06',
    hreflangs: [
      { lang: 'bg', url: bgPath },
      { lang: 'en', url: enPath },
      { lang: 'x-default', url: bgPath },
    ],
    og: {
      title: isEn ? enSeoTitle : seoTitle,
      description: isEn ? enSeoDesc : seoDesc,
      type: 'website',
      locale: isEn ? 'en_US' : 'bg_BG',
      localeAlternate: [isEn ? 'bg_BG' : 'en_US'],
    },
    schemas: [
      buildWebPageSchema(isEn ? enSeoTitle : seoTitle, seoDesc, isEn ? enPath : bgPath),
      buildBreadcrumbSchema([
        { name: isEn ? 'Home' : 'Начало', url: isEn ? '/en' : '/' },
        { name: isEn ? 'Services' : 'Услуги', url: isEn ? '/en/services' : '/uslugi' },
        { name: serviceName, url: isEn ? enPath : bgPath },
      ]),
      buildLocalBusinessSchema(),
      buildPersonSchema(),
      ...(content ? [buildFaqSchema(content.faqs)] : []),
      ...(howToBook ? [howToBook] : []),
      ...(productSchema ? [productSchema] : []),
      {
        type: 'Service',
        data: {
          name: `${serviceName} — NP Massage Studio`,
          description: content?.heroDescription || '',
          provider: { '@id': `${baseUrl}/#business` },
          areaServed: [
            { '@type': 'City', name: isEn ? 'Veliko Tarnovo' : 'Велико Търново' },
            { '@type': 'City', name: isEn ? 'Pavlikeni' : 'Павликени' },
          ],
          serviceType: serviceName,
        },
      },
    ],
  }), [isEn, seoTitle, seoDesc, enSeoTitle, bgPath, enPath, serviceName, content, howToBook, productSchema]));

  if (!detail || !content) {
    return (
      <div className="min-h-screen bg-background-50">
        <Navbar />
        <main className="pt-20 md:pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-semibold text-foreground-950 mb-4">
              {isEn ? 'Service Not Found' : 'Услугата не е намерена'}
            </h1>
            <p className="text-foreground-600 mb-6">
              {isEn ? 'The requested service page does not exist.' : 'Страницата за тази услуга не съществува.'}
            </p>
            <Link
              to={getPath('/uslugi')}
              className="px-6 py-3 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              {isEn ? 'View All Services' : 'Виж всички услуги'}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <HeroSection content={content} isEn={isEn} />
            <FullDescription content={content} />
            <BenefitsSection content={content} />
            <TechniquesSection content={content} />
            <WhoForSection content={content} />

            <div className="mb-14 md:mb-18">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                  {isEn ? 'Frequently Asked Questions' : 'Често задавани въпроси'}
                </h2>
              </div>
              <FaqAccordion items={content.faqs} />
            </div>

            <RelatedServices
              slugs={content.relatedServices}
              isEn={isEn}
              getServiceNameBg={getRelatedServiceNameBg}
              getServiceNameEn={getRelatedServiceNameEn}
            />

            <RelatedBlogs
              slugs={content.relatedBlogSlugs}
              isEn={isEn}
              getBlogTitleBg={getRelatedBlogTitleBg}
              getBlogTitleEn={getRelatedBlogTitleEn}
            />

            <CtaBanner />
            <EntityBlock />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function HeroSection({ content, isEn }: { content: NonNullable<ReturnType<typeof getContent>>; isEn: boolean }) {
  return (
    <div className="mb-10 md:mb-14">
      <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-3">
        {content.title}
      </h1>
      <p className="text-lg md:text-xl text-foreground-600 mb-3 font-medium">
        {content.subtitle}
      </p>
      <p className="text-base text-foreground-500 max-w-2xl leading-relaxed">
        {content.heroDescription}
      </p>
    </div>
  );
}

function FullDescription({ content }: { content: NonNullable<ReturnType<typeof getContent>> }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70 mb-10 md:mb-14 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-4">
        {content.title}
      </h2>
      <div className="text-sm text-foreground-700 leading-relaxed space-y-3 whitespace-pre-line">
        {content.fullDescription}
      </div>
    </div>
  );
}

function BenefitsSection({ content, isEn }: { content: NonNullable<ReturnType<typeof getContent>>; isEn: boolean }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`mb-10 md:mb-14 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        {isEn ? 'Benefits' : 'Ползи'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {content.benefits.map((benefit, i) => (
          <div key={i} className="flex items-start gap-3 bg-background-100 rounded-xl p-4 border border-background-200/70">
            <div className="w-6 h-6 flex items-center justify-center bg-accent-100 rounded-full flex-shrink-0 mt-0.5">
              <i className="ri-check-line text-accent-700 text-xs" />
            </div>
            <span className="text-sm text-foreground-700 leading-relaxed">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechniquesSection({ content, isEn }: { content: NonNullable<ReturnType<typeof getContent>>; isEn: boolean }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`mb-10 md:mb-14 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        {isEn ? 'Techniques Used' : 'Използвани техники'}
      </h2>
      <div className="space-y-3">
        {content.techniques.map((tech, i) => (
          <div key={i} className="flex items-start gap-3 bg-background-100 rounded-xl p-4 border border-background-200/70">
            <div className="w-7 h-7 flex items-center justify-center bg-secondary-100 rounded-full flex-shrink-0">
              <span className="text-xs font-semibold text-secondary-700">{i + 1}</span>
            </div>
            <span className="text-sm text-foreground-700 leading-relaxed">{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhoForSection({ content, isEn }: { content: NonNullable<ReturnType<typeof getContent>>; isEn: boolean }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`mb-10 md:mb-14 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        {isEn ? 'Who Is This For?' : 'За кого е подходящ?'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {content.whoFor.map((person, i) => (
          <div key={i} className="flex items-start gap-3 bg-background-100 rounded-xl p-4 border border-background-200/70">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary-500">
              <i className="ri-user-heart-line text-sm" />
            </div>
            <span className="text-sm text-foreground-700 leading-relaxed">{person}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedServices({
  slugs,
  isEn,
  getServiceNameBg,
  getServiceNameEn,
}: {
  slugs: string[];
  isEn: boolean;
  getServiceNameBg: (s: string) => string;
  getServiceNameEn: (s: string) => string;
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const basePath = isEn ? '/en/services' : '/uslugi';

  return (
    <div
      ref={ref}
      className={`mb-10 md:mb-14 bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        {isEn ? 'Related Services' : 'Свързани услуги'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {slugs.map((s) => (
          <Link
            key={s}
            to={`${basePath}/${s}`}
            className="flex items-center gap-3 bg-background-50 rounded-xl p-4 border border-background-200/70 hover:border-primary-300/60 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-primary-100 rounded-full flex-shrink-0 group-hover:bg-primary-200 transition-colors">
              <i className="ri-arrow-right-line text-primary-600 text-sm" />
            </div>
            <span className="text-sm font-medium text-foreground-800 group-hover:text-primary-600 transition-colors">
              {isEn ? getServiceNameEn(s) : getServiceNameBg(s)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function RelatedBlogs({
  slugs,
  isEn,
  getBlogTitleBg,
  getBlogTitleEn,
}: {
  slugs: string[];
  isEn: boolean;
  getBlogTitleBg: (s: string) => string;
  getBlogTitleEn: (s: string) => string;
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const basePath = isEn ? '/en/blog' : '/blog';

  return (
    <div
      ref={ref}
      className={`mb-10 md:mb-14 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-5">
        {isEn ? 'Related Articles' : 'Свързани статии'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {slugs.map((s) => (
          <Link
            key={s}
            to={`${basePath}/${s}`}
            className="flex items-center gap-3 bg-background-100 rounded-xl p-4 border border-background-200/70 hover:border-accent-300/60 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-accent-100 rounded-full flex-shrink-0 group-hover:bg-accent-200 transition-colors">
              <i className="ri-article-line text-accent-600 text-sm" />
            </div>
            <span className="text-sm font-medium text-foreground-800 group-hover:text-accent-600 transition-colors">
              {isEn ? getBlogTitleEn(s) : getBlogTitleBg(s)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getContent(detail: NonNullable<typeof serviceDetailMap[string]>, isEn: boolean) {
  return isEn ? detail.en : detail.bg;
}