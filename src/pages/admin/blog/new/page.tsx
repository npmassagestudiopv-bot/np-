import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/components/AdminLayout';

export default function AdminBlogNewPage() {
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');
  const [titleBg, setTitleBg] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [excerptBg, setExcerptBg] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [contentBg, setContentBg] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewLang, setPreviewLang] = useState<'bg' | 'en'>('bg');

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!titleBg || !titleEn || !contentBg || !contentEn) {
      setError('Заглавията и съдържанието (BG и EN) са задължителни.');
      return;
    }
    const finalSlug = slug || generateSlug(titleBg);

    setLoading(true);
    try {
      const { error: err } = await supabase.from('blog_posts').insert({
        slug: finalSlug,
        title_bg: titleBg.trim(),
        title_en: titleEn.trim(),
        excerpt_bg: excerptBg.trim(),
        excerpt_en: excerptEn.trim(),
        content_bg: contentBg.trim(),
        content_en: contentEn.trim(),
        image_url: imageUrl.trim(),
        category: category.trim(),
        read_time: readTime,
        published_at: publishedAt,
      });

      if (err) {
        if (err.code === '23505') {
          setError('Slug вече съществува. Промени го.');
        } else {
          setError(err.message);
        }
        setLoading(false);
        return;
      }

      navigate('/admin/blog');
    } catch {
      setError('Грешка при запазване.');
    }
    setLoading(false);
  }

  function renderPreview(content: string) {
    return content
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-1">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-sm mb-2">')
      .replace(/^(.+)$/gm, '<p class="text-sm mb-2">$1</p>');
  }

  const previewContent = previewLang === 'bg' ? contentBg : contentEn;

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate('/admin/blog')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-100 cursor-pointer">
          <div className="w-4 h-4 flex items-center justify-center text-foreground-600"><i className="ri-arrow-left-line"></i></div>
        </button>
        <h2 className="text-base font-semibold text-foreground-950">Нова статия</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-foreground-700 mb-1">Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="blog-post-slug (автоматично от заглавие)" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1">Категория</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="Масажи" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1">Време за четене (мин)</label>
            <input type="number" value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} className="w-full h-11 px-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400" min={1} max={60} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1">Дата на публикуване</label>
            <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1">URL на снимка</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground-700 mb-1">Заглавие (BG)</label>
          <input type="text" value={titleBg} onChange={(e) => { setTitleBg(e.target.value); if (!slug) setSlug(generateSlug(e.target.value)); }} className="w-full h-11 px-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="Заглавие на български" />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground-700 mb-1">Заглавие (EN)</label>
          <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="Title in English" />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground-700 mb-1">Откъс (BG)</label>
          <textarea value={excerptBg} onChange={(e) => setExcerptBg(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" placeholder="Кратко описание..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground-700 mb-1">Откъс (EN)</label>
          <textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" placeholder="Short description..." />
        </div>

        {/* Content with preview toggle */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-foreground-700">Съдържание</label>
            <div className="flex bg-background-100 rounded-full p-0.5">
              <button type="button" onClick={() => setPreviewLang('bg')} className={`px-2.5 py-1 text-[10px] font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${previewLang === 'bg' ? 'bg-background-50 text-foreground-950 shadow-sm' : 'text-foreground-500'}`}>BG</button>
              <button type="button" onClick={() => setPreviewLang('en')} className={`px-2.5 py-1 text-[10px] font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${previewLang === 'en' ? 'bg-background-50 text-foreground-950 shadow-sm' : 'text-foreground-500'}`}>EN</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1">Markdown (BG)</label>
            <textarea value={contentBg} onChange={(e) => setContentBg(e.target.value)} rows={8} className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 resize-y" placeholder="## Заглавие&#10;&#10;**Удебелен** текст&#10;&#10;- Точка 1&#10;- Точка 2" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1">Markdown (EN)</label>
            <textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} rows={8} className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 resize-y" placeholder="## Title&#10;&#10;**Bold** text&#10;&#10;- Point 1&#10;- Point 2" />
          </div>
        </div>

        {/* Preview */}
        {previewContent && (
          <div className="border border-background-200/70 rounded-lg p-3">
            <p className="text-[10px] text-foreground-400 mb-2 uppercase">Преглед ({previewLang === 'bg' ? 'Български' : 'English'})</p>
            <div className="prose prose-sm max-w-none text-foreground-900" dangerouslySetInnerHTML={{ __html: renderPreview(previewContent) }} />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="flex-1 h-11 rounded-lg border border-background-200/70 text-sm font-medium text-foreground-700 hover:bg-background-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Отказ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-11 bg-primary-500 text-background-50 rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            {loading ? 'Запазване...' : 'Публикувай'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}