import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { StaticRouter, useRoutes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';
import routes from '../src/router/config';
import { AuthProvider } from '../src/hooks/useAuth';
import { SeoRenderContext, type SeoOptions } from '../src/lib/seoContext';
import { PrerenderDataContext, type PublicBlogPost } from '../src/lib/prerenderContext';
import { supabase } from '../src/lib/supabase';
import { blogPosts } from '../src/mocks/blogPosts';

export async function readPublicPosts(): Promise<PublicBlogPost[]> {
  // SELECT only. Merge the existing local fallbacks to preserve all blog URLs.
  const { data, error } = await supabase.from('blog_posts').select('*')
    .order('published_at', { ascending: false }).abortSignal(AbortSignal.timeout(10000));
  if (error) console.warn('[SEO] Public blog read unavailable; using the existing local articles.');
  const live = data || [];
  const posts = new Map(blogPosts.map((post) => [post.slug, post]));
  for (const post of live) posts.set(post.slug, post);
  return [...posts.values()] as PublicBlogPost[];
}

function PublicRoutes() {
  return useRoutes(routes);
}

export async function renderPage(path: string, posts: PublicBlogPost[]) {
  await i18n.changeLanguage(path === '/en' || path.startsWith('/en/') ? 'en' : 'bg');
  let seo: SeoOptions | undefined;
  const tree = (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <StaticRouter location={path}>
          <PrerenderDataContext.Provider value={{ posts }}>
            <SeoRenderContext.Provider value={(options) => { seo = options; }}>
              <a href="#main-content" className="skip-to-content">{i18n.language === 'en' ? 'Skip to content' : 'Към съдържанието'}</a>
              <PublicRoutes />
            </SeoRenderContext.Provider>
          </PrerenderDataContext.Provider>
        </StaticRouter>
      </AuthProvider>
    </I18nextProvider>
  );
  const html = await new Promise<string>((resolve, reject) => {
    const stream = new PassThrough();
    let html = '';
    let timeout: ReturnType<typeof setTimeout>;
    const fail = (error: Error) => { clearTimeout(timeout); reject(error); };
    stream.on('data', (chunk) => { html += chunk.toString(); });
    stream.on('end', () => { clearTimeout(timeout); resolve(html); });
    stream.on('error', fail);
    const render = renderToPipeableStream(tree, {
      onAllReady() { render.pipe(stream); },
      onShellError: fail,
      onError: fail,
    });
    timeout = setTimeout(() => {
      render.abort();
      reject(new Error(`Pre-render timed out: ${path}`));
    }, 25000);
  });
  if (!seo?.title || !seo.description) throw new Error(`Missing SEO metadata: ${path}`);
  return { html, seo };
}
