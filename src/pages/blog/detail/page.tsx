import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import TableOfContents from '@/components/feature/TableOfContents';
import RelatedArticles from '@/components/feature/RelatedArticles';

import SeoTextBlock from '@/components/feature/SeoTextBlock';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { supabase } from '@/lib/supabase';
import { blogPosts } from '@/mocks/blogPosts';
import FaqAccordion from '@/components/feature/FaqAccordion';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildWebPageSchema,
  buildImageObjectSchema,
  buildPersonSchema,
  buildFaqSchema,
} from '@/lib/seoSchemas';

const OFF_TOPIC_SLUGS = new Set([
  'digitalen-marketing-np-massage-studio-veliko-tarnovo',
  'zashto-masazhno-studio-investira-digitalen-marketing-2026',
  'masazhni-studia-veliko-tarnovo-seo-online-reklama',
]);

const FAQ_BLOG_DETAIL: Array<{ q: string; a: string }> = [
  { q: 'Колко често публикувате нови статии в блога?', a: 'Публикуваме нови статии редовно, обикновено всяка седмица или две. Следете блога ни за актуална информация за масажна терапия, здраве и уелнес от NP Massage Studio.' },
  { q: 'Мога ли да споделя статии от блога на NP Massage Studio?', a: 'Да, можете свободно да споделяте всички статии в социалните мрежи. Насърчаваме споделянето на полезна информация за ползите от масажа и здравословния начин на живот.' },
  { q: 'Кой пише статиите в блога?', a: 'Статиите се пишат от екипа на NP Massage Studio под ръководството на Натан Петков — професионален масажист с многогодишен опит. Съдържанието е базирано на реален опит и професионални познания.' },
  { q: 'Какви теми обхващате в блога?', a: 'Темите включват класически масаж, спортен масаж, антицелулитни процедури, ароматерапия, техники за релакс, здравословни съвети, ползи от редовните масажи и много други теми за здраве и благосъстояние.' },
  { q: 'За кого са предназначени статиите?', a: 'Статиите са полезни както за клиенти на масажен салон, така и за всички, които се интересуват от здраве, уелнес и масажна терапия във Велико Търново, Павликени и региона.' },
  { q: 'Мога ли да предложа тема за статия?', a: 'Да, ще се радваме да чуем вашите предложения! Свържете се с нас чрез контактната форма или на +359 988 926 120 с вашата идея за тема.' },
  { q: 'Помага ли масажът при дископатия?', a: 'Да, професионалният терапевтичен масаж може значително да облекчи симптомите на дископатия — намалява мускулния спазъм около засегнатия диск, подобрява кръвообращението и подпомага естественото възстановяване. Важно е масажът да се извършва от квалифициран терапевт и след консултация с лекар. В NP Massage Studio използваме нежни, контролирани техники. Прочетете повече в статията ни "Помага ли масажът при дископатия?"' },
  { q: 'Каква е разликата между лечебен и спортен масаж?', a: 'Лечебният (терапевтичен) масаж е реактивен — третира вече съществуващи здравословни проблеми като дископатия, схванат врат или ставни болки. Спортният масаж е проактивен — подобрява спортната функция, ускорява възстановяването и предотвратява травми. И двата се предлагат в NP Massage Studio. Вижте подробното сравнение в статията ни "Разлика между лечебен и спортен масаж".' },
  { q: 'Колко време трае един професионален масаж?', a: 'Стандартната продължителност е 60 минути за класически, спортен и ароматерапевтичен масаж. Антицелулитният масаж и частичният масаж на гръб са по 40 минути. Планирайте още 10-15 минути за консултация и преобличане. Прочетете пълната статия "Колко време трае един масаж?" за детайлна разбивка по видове.' },
  { q: 'Кой е най-добрият масаж за мен?', a: 'Най-добрият масаж зависи от вашите цели: за релакс и стрес — класически масаж; за спортно възстановяване — спортен масаж; за болки в гърба — лечебен масаж; за безсъние — ароматерапия. Консултирайте се с терапевт в NP Massage Studio на +359 988 926 120 за персонализирана препоръка.' },
  { q: 'Какви са ползите от редовния масаж?', a: 'Редовният масаж намалява кортизола с до 30%, подобрява кръвообращението, облекчава хронични мускулни болки, подобрява качеството на съня и засилва имунната система. За оптимални резултати препоръчваме поне веднъж седмично. Вижте още в лендинг страницата ни за ползите от редовния масаж.' },
  { q: 'Къде мога да си направя лечебен масаж във Велико Търново?', a: 'NP Massage Studio предлага професионален лечебен масаж във Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10). Нашите терапевти са обучени да работят с дископатия, схванат врат, болки в кръста и други гръбначни проблеми. Цена: 25 € за 60 минути. Запазете час на +359 988 926 120.' },
];

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

function buildBlogPostingSchema(post: BlogPost, isEn: boolean) {
  const title = isEn ? post.title_en : post.title_bg;
  const description = isEn ? post.excerpt_en : post.excerpt_bg;
  const content = isEn ? post.content_en : post.content_bg;
  return {
    type: 'BlogPosting',
    data: {
      headline: title,
      description,
      articleBody: content,
      datePublished: post.published_at,
      dateModified: post.published_at,
      author: {
        '@type': 'Person',
        name: 'Натан Петков',
        url: `${baseUrl}/za-np-massage-studio`,
        '@id': `${baseUrl}/#person`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'NP Massage Studio',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: 'https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/a44364ff-b9d6-4117-8394-dcd7f0becbd6_compressed_--.webp',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${post.slug}`,
      },
      image: post.image_url || 'https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/a44364ff-b9d6-4117-8394-dcd7f0becbd6_compressed_--.webp',
      inLanguage: isEn ? 'en' : 'bg',
    },
  };
}

function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
  const lines = content.split('\n');
  const headings: Array<{ id: string; text: string; level: number }> = [];
  lines.forEach((line) => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      headings.push({ id, text, level });
    }
  });
  return headings;
}

function convertContentToHtml(content: string): string {
  const lines = content.split('\n');
  const htmlParts: string[] = [];
  let inParagraph = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h3Match = line.match(/^### (.+)$/);
    const h2Match = line.match(/^## (.+)$/);

    if (h2Match) {
      if (inParagraph) { htmlParts.push('</p>'); inParagraph = false; }
      const text = h2Match[1].trim();
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      htmlParts.push(`<h2 id="${id}" class="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mt-10 mb-4 scroll-mt-24">${text}</h2>`);
    } else if (h3Match) {
      if (inParagraph) { htmlParts.push('</p>'); inParagraph = false; }
      const text = h3Match[1].trim();
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      htmlParts.push(`<h3 id="${id}" class="font-heading text-lg md:text-xl font-semibold text-foreground-900 mt-8 mb-3 scroll-mt-24">${text}</h3>`);
    } else if (line.trim() === '') {
      if (inParagraph) { htmlParts.push('</p>'); inParagraph = false; }
    } else {
      if (!inParagraph) { htmlParts.push('<p class="mb-4 leading-relaxed">'); inParagraph = true; }
      else { htmlParts.push('<br/>'); }
      htmlParts.push(line);
    }
  }

  if (inParagraph) { htmlParts.push('</p>'); }
  return htmlParts.join('');
}

export default function BlogDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isEn } = useLocalizedNav();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setError(true);
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const [{ data: postData, error: postError }, { data: postsData, error: postsError }] = await Promise.all([
          supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle(),
          supabase.from('blog_posts').select('*').order('published_at', { ascending: false }).limit(10),
        ]);
        if (!cancelled) {
          if (postData) {
            setPost(postData as BlogPost);
          } else {
            const fallback = blogPosts.find((p) => p.slug === slug);
            if (fallback) {
              setPost(fallback as BlogPost);
            } else {
              setError(true);
            }
          }
          if (postsData) {
            setAllPosts(postsData as BlogPost[]);
          } else {
            setAllPosts(blogPosts as BlogPost[]);
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          const fallback = blogPosts.find((p) => p.slug === slug);
          if (fallback) {
            setPost(fallback as BlogPost);
          } else {
            setError(true);
          }
          setAllPosts(blogPosts as BlogPost[]);
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  useSeo(
    useMemo(() => {
      if (!post) {
        return {
          title: 'Статията не е намерена | NP Massage Studio',
          description: 'Търсената статия не съществува. Разгледайте други полезни статии за масажи в NP Massage Studio.',
          noIndex: true,
        };
      }
      const title = isEn ? post.title_en : post.title_bg;
      const description = isEn ? post.excerpt_en : post.excerpt_bg;

      const schemas = [
        buildWebPageSchema(title, description, `/blog/${post.slug}`, 'WebPage'),
        buildBreadcrumbSchema([
          { name: 'Начало', url: '/' },
          { name: 'Блог', url: '/blog' },
          { name: title },
        ]),
        buildBlogPostingSchema(post, isEn),
        buildLocalBusinessSchema(),
        buildPersonSchema(),
        buildFaqSchema(FAQ_BLOG_DETAIL),
        ...(post.image_url ? [buildImageObjectSchema(post.image_url, title, 1200, 675)] : []),
      ];

      return {
        title: `${title} | NP Massage Studio Блог`,
        description,
        canonical: `/blog/${post.slug}`,
        lastModified: post.published_at,
        noIndex: OFF_TOPIC_SLUGS.has(post.slug),
        hreflangs: [
          { lang: 'bg', url: `/blog/${post.slug}` },
          { lang: 'en', url: `/en/blog/${post.slug}` },
          { lang: 'x-default', url: `/blog/${post.slug}` },
        ],
        og: {
          title,
          description,
          url: `${baseUrl}/blog/${post.slug}`,
          image: post.image_url || 'https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/a44364ff-b9d6-4117-8394-dcd7f0becbd6_compressed_--.webp',
          type: 'article',
        },
        schemas,
      };
    }, [post, isEn])
  );

  useEffect(() => {
    if (!post) return;
    const publishedTime = post.published_at;
    if (!publishedTime) return;

    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('article:published_time', publishedTime);
    setMeta('article:modified_time', publishedTime);

    return () => {
      document.querySelectorAll('meta[property="article:published_time"], meta[property="article:modified_time"]').forEach((el) => el.remove());
    };
  }, [post]);

  const breadcrumbItems = [
    { label: t('breadcrumbHome'), path: '/' },
    { label: t('breadcrumbBlog'), path: '/blog' },
    ...(post ? [{ label: isEn ? post.title_en : post.title_bg }] : []),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-50">
        <Navbar />
        <main className="pt-20 md:pt-24">
          <div className="flex items-center justify-center py-32">
            <i className="ri-loader-4-line animate-spin text-4xl text-primary-500" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background-50">
        <Navbar />
        <main className="pt-20 md:pt-24">
          <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mt-10">
                <i className="ri-file-damage-line text-6xl text-background-300 mb-4" />
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                  {isEn ? 'Article not found' : 'Статията не е намерена'}
                </h1>
                <p className="text-foreground-600 mb-6">
                  {isEn
                    ? 'The article you are looking for does not exist or has been moved.'
                    : 'Статията, която търсите, не съществува или е преместена.'}
                </p>
                <button
                  onClick={() => navigate('/blog')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 transition-all duration-300 cursor-pointer"
                >
                  <i className="ri-arrow-left-line" />
                  {isEn ? 'Back to blog' : 'Назад към блога'}
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const title = isEn ? post.title_en : post.title_bg;
  const content = isEn ? post.content_en : post.content_bg;
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString(isEn ? 'en-US' : 'bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const tocItems = extractHeadings(content);
  const hasTOC = tocItems.length > 0;

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <article className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
          <div className="mt-8 mb-10">
              <div className="flex items-center gap-3 text-xs text-foreground-500 mb-4">
                <time dateTime={post.published_at}>{dateStr}</time>
                <span className="w-1 h-1 rounded-full bg-foreground-300" />
                <span>{post.read_time} {t('blogReadTime')}</span>
                <span className="w-1 h-1 rounded-full bg-foreground-300" />
                <span className="text-primary-600 font-medium">{t('blogBy')}</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-5 leading-tight">
                {title}
              </h1>
              <p className="text-lg text-foreground-600 leading-relaxed">
                {isEn ? post.excerpt_en : post.excerpt_bg}
              </p>
            </div>

            {post.image_url && (
              <div className="w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-10">
                <img
                  src={post.image_url}
                  alt={title}
                  title={title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  width="1200"
                  height="675"
                />
              </div>
            )}

            {hasTOC && <TableOfContents items={tocItems} />}

            <AuthorBlock isEn={isEn} publishedAt={post.published_at} />

            <div
              className="prose prose-lg max-w-none text-foreground-700 text-base md:text-lg blog-content"
              dangerouslySetInnerHTML={{ __html: convertContentToHtml(content) }}
            />

            <RelatedArticles
              articles={allPosts.map((p) => ({
                slug: p.slug,
                title: isEn ? p.title_en : p.title_bg,
                excerpt: isEn ? p.excerpt_en : p.excerpt_bg,
                image_url: p.image_url,
                published_at: p.published_at,
                read_time: p.read_time,
              }))}
              currentSlug={post.slug}
              isEn={isEn}
            />

            <div className="mt-12 pt-8 border-t border-background-200/70">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button
                  onClick={() => navigate('/blog')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer"
                >
                  <i className="ri-arrow-left-line" />
                  {isEn ? 'Back to all articles' : 'Назад към всички статии'}
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-foreground-500">{isEn ? 'Share:' : 'Сподели:'}</span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background-100 hover:bg-primary-100 text-foreground-600 hover:text-primary-600 transition-all duration-300"
                    aria-label="Share on Facebook"
                  >
                    <i className="ri-facebook-fill text-sm" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${baseUrl}/blog/${post.slug}`)}&text=${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background-100 hover:bg-primary-100 text-foreground-600 hover:text-primary-600 transition-all duration-300"
                    aria-label="Share on Twitter"
                  >
                    <i className="ri-twitter-x-fill text-sm" />
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${baseUrl}/blog/${post.slug}`)}`}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background-100 hover:bg-primary-100 text-foreground-600 hover:text-primary-600 transition-all duration-300"
                    aria-label="Share by email"
                  >
                    <i className="ri-mail-line text-sm" />
                  </a>
                </div>
              </div>
            </div>

            <CtaBlock isEn={isEn} />

            <div className="mt-12">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                  {isEn ? 'Frequently Asked Questions' : 'Често задавани въпроси'}
                </h2>
                <p className="text-sm text-foreground-600">
                  {isEn ? 'More questions about our blog and massage articles.' : 'Още въпроси за нашия блог и статии за масажи.'}
                </p>
              </div>
              <FaqAccordion items={FAQ_BLOG_DETAIL.map((item) => ({ q: item.q, a: item.a }))} />
            </div>

            <SeoTextBlock isEn={isEn} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function AuthorBlock({ isEn, publishedAt }: { isEn: boolean; publishedAt: string }) {
  const dateStr = publishedAt ? new Date(publishedAt).toLocaleDateString(isEn ? 'en-US' : 'bg-BG', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div className="flex items-center gap-4 bg-background-100 rounded-xl p-4 border border-background-200/70 mb-8">
      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
        <i className="ri-user-star-line text-primary-600 text-xl" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground-900">Натан Петков</p>
        <p className="text-xs text-foreground-500">
          {isEn ? 'Professional Massage Therapist, NP Massage Studio' : 'Професионален масажист, NP Massage Studio'}
          {' · '}
          <time dateTime={publishedAt}>{dateStr}</time>
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <a href="/za-np-massage-studio" className="text-xs text-primary-600 hover:text-primary-700 transition-colors">
            {isEn ? 'About the owner' : 'За управителя'}
          </a>
          <span className="text-foreground-300">|</span>
          <a href="/uslugi" className="text-xs text-primary-600 hover:text-primary-700 transition-colors">
            {isEn ? 'Services' : 'Услуги'}
          </a>
        </div>
      </div>
    </div>
  );
}

function CtaBlock({ isEn }: { isEn: boolean }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const navigate = useNavigate();

  return (
    <div
      ref={ref}
      className={`mt-12 bg-primary-500 rounded-2xl p-6 md:p-8 text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <h3 className="font-heading text-xl md:text-2xl font-semibold text-background-50 mb-3">
        {isEn ? 'Ready to experience the benefits?' : 'Готови ли сте да изпитате ползите?'}
      </h3>
      <p className="text-sm text-background-200/90 mb-5 max-w-lg mx-auto">
        {isEn
          ? 'Book your massage appointment at NP Massage Studio in Veliko Tarnovo or Pavlikeni.'
          : 'Запазете час за масаж в NP Massage Studio във Велико Търново или Павликени.'}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => navigate('/rezervaciya')}
          className="inline-flex items-center justify-center px-8 py-4 bg-background-50 text-primary-700 font-medium text-sm rounded-full hover:bg-background-100 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
        >
          {isEn ? 'Book an Appointment' : 'Запази час'}
        </button>
        <a
          href="tel:+359988926120"
          className="inline-flex items-center justify-center px-8 py-4 border border-background-50/40 text-background-50 font-medium text-sm rounded-full hover:bg-background-50/10 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
        >
          <i className="ri-phone-line mr-2" />
          +359 988 926 120
        </a>
      </div>
    </div>
  );
}