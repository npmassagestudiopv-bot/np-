import { createContext } from 'react';
import type { Database } from '@/types/database';

export type PublicBlogPost = Database['public']['Tables']['blog_posts']['Row'];
export const PrerenderDataContext = createContext<{ posts: PublicBlogPost[] } | null>(null);
