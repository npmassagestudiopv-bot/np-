import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/components/AdminLayout';

interface BlogPost {
  id: string;
  slug: string;
  title_bg: string;
  title_en: string;
  excerpt_bg: string;
  excerpt_en: string;
  content_bg: string;
  content_en: string;
  image_url: string;
  category: string;
  read_time: number;
  published_at: string;
}

export default function AdminBlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (err) throw err;
      setPosts(data ?? []);
    } catch {
      setError('Грешка при зареждане.');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Сигурен ли си, че искаш да изтриеш тази статия?')) return;
    try {
      const { error: err } = await supabase.from('blog_posts').delete().eq('id', id);
      if (err) throw err;
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Грешка при изтриване.');
    }
  }

  const filtered = posts.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title_bg.toLowerCase().includes(q) ||
      p.title_en.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-foreground-400">
            <i className="ri-search-line"></i>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="Търси статия..."
          />
        </div>
        <button
          onClick={() => navigate('/admin/blog/new')}
          className="h-10 px-4 bg-primary-500 text-background-50 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
        >
          Нова
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <p className="text-xs text-red-700">{error}</p>
          <button onClick={() => setError('')} className="mt-1 text-xs text-red-600 underline cursor-pointer">Затвори</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-background-100 flex items-center justify-center">
            <div className="w-7 h-7 flex items-center justify-center text-foreground-400"><i className="ri-article-line text-2xl"></i></div>
          </div>
          <p className="text-sm text-foreground-500">{search ? 'Няма намерени статии' : 'Няма статии'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <div key={post.id} className="bg-background-50 border border-background-200/70 rounded-xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground-950 line-clamp-1">{post.title_bg}</p>
                  <p className="text-xs text-foreground-400 mt-0.5">
                    {post.category && <span className="bg-secondary-100 text-secondary-700 px-1.5 py-0.5 rounded text-[10px] mr-1">{post.category}</span>}
                    {post.published_at && new Date(post.published_at).toLocaleDateString('bg-BG')}
                    <span className="mx-1">·</span>
                    {post.read_time}мин
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5 mt-3">
                <button
                  onClick={() => navigate(`/admin/blog/${post.id}/edit`)}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Редактирай
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Изтрий
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}