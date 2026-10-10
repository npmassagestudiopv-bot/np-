import { createContext } from 'react';

export interface SeoSchema {
  type: string;
  data: Record<string, unknown>;
}

export interface SeoOptions {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  hreflangs?: Array<{ lang: string; url: string }>;
  og?: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    type?: string;
    locale?: string;
    localeAlternate?: string[];
  };
  twitter?: { title?: string; description?: string; image?: string; card?: string };
  schemas?: SeoSchema[];
  robots?: string;
  lastModified?: string;
  noIndex?: boolean;
  geo?: { placename?: string; region?: string; position?: string; icbm?: string };
}

// Only the build-time renderer supplies this collector. Browsers use the hook.
export const SeoRenderContext = createContext<((options: SeoOptions) => void) | null>(null);
