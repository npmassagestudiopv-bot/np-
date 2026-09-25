import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import CategoryFilter from '@/components/feature/CategoryFilter';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { fetchBlogPosts } from '@/lib/supabase';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildBlogSchema,
  buildLocalBusinessSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from '@/lib/seoSchemas';
import SeoTextBlock from '@/components/feature/SeoTextBlock';
import FaqAccordion from '@/components/feature/FaqAccordion';

interface BlogPost {
  id: string;
  slug: string;
  title_bg: string;
  title_en: string;
  excerpt_bg: string;
  excerpt_en: string;
  content_bg: string;
  content_en: string;
  image_url: string | null;
  read_time: number;
  published_at: string;
  created_at: string;
  category?: string;
}

const FAQ_BLOG = [
  { q: 'Какво ще намеря в блога на NP Massage Studio?', a: 'В блога публикуваме полезни статии за ползите от масажа, видовете масажни терапии, съвети за здраве и уелнес, информация за ароматерапия, антицелулитни процедури и спортен масаж.' },
  { q: 'Как често публикувате нови статии?', a: 'Публикуваеме нови статии редовно, обикновено всяка седмица или две. Следете ни за актуална информация за масажна терапия и уелнес.' },
  { q: 'Мога ли да споделя статии от блога?', a: 'Да, можете свободно да споделяте статии от блога в социалните мрежи. Всички статии са полезни за всеки, който се интересува от масажи и здраве.' },
  { q: 'Какви теми обхващате в блога?', a: 'Темите включват класически масаж, спортен масаж, антицелулитни процедури, ароматерапия, техники за релакс, здравословни съвети и ползи от редовните масажи.' },
  { q: 'За кого са предназначени статите в блога?', a: 'Статите са полезни както за клиенти на масажен салон, така и за всички, които се интересуват от здраве, уелнес и масажна терапия във Велико Търново и Павликени.' },
  { q: 'Имате ли блог на английски?', a: 'Да, блогът е достъпен на български и английски. Можете да превключите езика от навигацията в горния десен ъгъл.' },
  { q: 'Помага ли масажът при дископатия?', a: 'Да, професионалният терапевтичен масаж може значително да облекчи симптомите на дископатия, но при стриктни условия и след консултация с лекар. Прочетете пълната ни статия "Помага ли масажът при дископатия?" за детайлна информация и научни обяснения.' },
  { q: 'Каква е разликата между лечебен и спортен масаж?', a: 'Лечебният масаж третира вече съществуващи здравословни проблеми, докато спортният масаж подобрява спортната функция и предотвратява травми. Вижте статията ни "Разлика между лечебен и спортен масаж" за подробно сравнение на двата подхода.' },
  { q: 'Колко време трае един масаж и колко често трябва да го правя?', a: 'Стандартната продължителност е 60 минути (класически, спортен, ароматерапия) или 40 минути (антицелулитен, частичен гръб). Честотата зависи от целите — от всеки ден до веднъж месечно. Прочетете статията ни "Колко време трае един масаж?" за пълна разбивка.' },
];

export default function BlogPage() {
  const { t } = useTranslation();
  const { isEn } = useLocalizedNav();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchBlogPosts()
      .then((data) => {
        if (!cancelled) { setPosts(data || []); setLoading(false); }
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  useSeo(useMemo(() => ({
    title: 'Блог за масажи и здраве | NP Massage Studio',
    description: 'Статии за масажна терапия и здраве от NP Massage Studio. Класически, спортен, антицелулитен масаж, ароматерапия. Велико Търново и Павликени. +359 988 926 120.',
    keywords: 'блог масажи, ползи от масаж, класически масаж статии, спортен масаж съвети, лечебен масаж информация, антицелулитен масаж блог, ароматерапия ползи, NP Масажно студио блог',
    canonical: isEn ? '/en/blog' : '/blog',
    lastModified: '2026-06-08',
    hreflangs: [
      { lang: 'bg', url: '/blog' },
      { lang: 'en', url: '/en/blog' },
      { lang: 'x-default', url: '/blog' },
    ],
    og: {
      title: 'Блог за масажи и здраве | NP Massage Studio',
      description: 'Професионални статии за масаж и здраве от NP Massage Studio. Класически, спортен, антицелулитен масаж и ароматерапия. +359 988 926 120.',
    },
    schemas: [
      buildWebPageSchema(
        'Блог | NP Massage Studio',
        'Професионални статии за масажна терапия, здраве и релакс. Класически, спортен, антицелулитен масаж, ароматерапия и съвети от сертифицирани терапевти.',
        '/blog',
        'CollectionPage',
        { cssSelector: ['h1', 'h2', '.blog-summary'] }
      ),
      buildBreadcrumbSchema([{ name: 'Начало', url: '/' }, { name: 'Блог', url: '/blog' }]),
      buildBlogSchema(posts.map((p) => ({
        title: isEn ? p.title_en : p.title_bg,
        description: isEn ? p.excerpt_en : p.excerpt_bg,
        publishedAt: p.published_at,
        slug: p.slug,
      }))),
      buildLocalBusinessSchema(),
      buildFaqSchema(FAQ_BLOG),
    ],
  }), [posts, isEn]));



  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24" id="main-content">
        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
                {t('blogTitle')}
              </h1>
              <p className="text-base text-foreground-600 max-w-2xl leading-relaxed blog-summary">
                {t('blogSubtitle')}
              </p>
            </div>

            {categories.length > 0 && (
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onChange={setActiveCategory}
                isEn={isEn}
              />
            )}

            {loading && (
              <div className="flex items-center justify-center py-20">
                <i className="ri-loader-4-line animate-spin text-3xl text-primary-500" />
              </div>
            )}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-sm text-red-700">{t('errorGeneral')}</p>
              </div>
            )}
            {!loading && !error && filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-foreground-500">{isEn ? 'No articles found.' : 'Няма намерени статии.'}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {filteredPosts.map((article, index) => (
                <BlogCard key={article.id} article={article} index={index} isEn={isEn} />
              ))}
            </div>

            <SeoTextBlock isEn={isEn} />

            <div className="mt-16 md:mt-20 mb-12">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                  {isEn ? 'Frequently Asked Questions' : 'Често задавани въпроси'}
                </h2>
                <p className="text-sm text-foreground-600">
                  {isEn ? 'Answers to the most popular questions about our blog and massage articles.' : 'Отговори на най-популярните въпроси за нашия блог и статии за масажи.'}
                </p>
              </div>
              <FaqAccordion items={FAQ_BLOG.map((item) => ({ q: item.q, a: item.a }))} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function BlogCard({ article, index, isEn }: { article: BlogPost; index: number; isEn: boolean }) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const dateStr = article.published_at ? new Date(article.published_at).toLocaleDateString(isEn ? 'en-US' : 'bg-BG', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <article
      ref={ref}
      className={`group bg-background-100 rounded-2xl overflow-hidden border border-background-200/70 hover:border-primary-300/60 transition-all duration-500 card-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {article.image_url && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={article.image_url}
            alt={isEn ? article.title_en : article.title_bg}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            width="800"
            height="450"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-3 text-xs text-foreground-500 mb-3">
          <time dateTime={article.published_at}>{dateStr}</time>
          <span className="w-1 h-1 rounded-full bg-foreground-300" />
          <span>{article.read_time} {t('blogReadTime')}</span>
          {article.category && (
            <>
              <span className="w-1 h-1 rounded-full bg-foreground-300" />
              <span className="bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {article.category}
              </span>
            </>
          )}
        </div>
        <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground-950 mb-2 leading-tight group-hover:text-primary-600 transition-colors duration-300">
          {isEn ? article.title_en : article.title_bg}
        </h3>
        <p className="text-sm text-foreground-600 mb-4 leading-relaxed">
          {isEn ? article.excerpt_en : article.excerpt_bg}
        </p>
        <a
          href={isEn ? `/en/blog/${article.slug}` : `/blog/${article.slug}`}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer inline-flex items-center gap-1"
        >
          {t('blogReadMore')}
          <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  );
}