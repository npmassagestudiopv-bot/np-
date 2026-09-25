import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface RelatedArticle {
  slug: string;
  title: string;
  excerpt: string;
  image_url: string | null;
  published_at: string;
  read_time: number;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  currentSlug: string;
  isEn: boolean;
}

export default function RelatedArticles({ articles, currentSlug, isEn }: RelatedArticlesProps) {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const filtered = articles.filter((a) => a.slug !== currentSlug).slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={ref}
      className={`mt-12 pt-8 border-t border-background-200/70 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <h3 className="font-heading text-xl font-semibold text-foreground-950 mb-6">
        {isEn ? 'Related Articles' : 'Свързани статии'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((article, index) => (
          <article
            key={article.slug}
            className="group bg-background-100 rounded-xl overflow-hidden border border-background-200/70 hover:border-primary-300/60 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/blog/${article.slug}`)}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {article.image_url && (
              <div className="w-full h-40 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width="800"
                  height="400"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-foreground-500 mb-2">
                <time dateTime={article.published_at}>
                  {new Date(article.published_at).toLocaleDateString(isEn ? 'en-US' : 'bg-BG', { day: 'numeric', month: 'short' })}
                </time>
                <span className="w-1 h-1 rounded-full bg-foreground-300" />
                <span>{article.read_time} {isEn ? 'min' : 'мин'}</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors duration-300">
                {article.title}
              </h4>
              <p className="text-xs text-foreground-600 leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}