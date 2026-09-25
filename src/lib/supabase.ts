import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

let _supabase: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseKey);
  }
  return _supabase;
}

export const supabase = getClient();

export async function invokeBooking(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  appointment_date: string;
  appointment_time: string;
  message?: string;
}) {
  const client = getClient();
  const { data: result, error } = await client.functions.invoke('booking', {
    body: data,
  });
  if (error) throw error;
  return result;
}

export async function invokeContact(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  message?: string;
}) {
  const client = getClient();
  const { data: result, error } = await client.functions.invoke('contact', {
    body: data,
  });
  if (error) throw error;
  return result;
}

export async function invokeCookieConsent(data: {
  consent_type: string;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  ip_address?: string;
  user_agent?: string;
}) {
  const client = getClient();
  const { data: result, error } = await client.functions.invoke('cookie-consent', {
    body: data,
  });
  if (error) throw error;
  return result;
}

export async function fetchAvailableSlots(date: string, location: string): Promise<{ takenSlots: string[]; blocked: boolean }> {
  const url = new URL(`${supabaseUrl}/functions/v1/available-slots`);
  url.searchParams.set('date', date);
  url.searchParams.set('location', location);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HTTP ${response.status}: ${err}`);
  }

  const result = await response.json();
  return {
    takenSlots: (result?.takenSlots ?? []) as string[],
    blocked: result?.blocked === true,
  };
}

export const fetchBlogPosts = async () => {
  const { blogPosts } = await import('@/mocks/blogPosts');
  // Reuse the single shared client. Creating a second GoTrue client with the
  // same storage key causes an auth-lock deadlock (hangs the login on mobile).
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  if (error || !data || data.length === 0) {
    return blogPosts;
  }
  return data;
};

export async function fetchBlogPost(slug: string) {
  const client = getClient();
  const { data: result, error } = await client.functions.invoke('blog-posts', {
    method: 'GET',
  });
  if (error) throw error;
  return (result?.data ?? []).find((p: any) => p.slug === slug) ?? null;
}

// Lazy-loaded booking operations — avoids bundling supabase-js on pages that don't need it
let _bookingOps: Promise<{
  invokeBooking: typeof invokeBooking;
  fetchAvailableSlots: typeof fetchAvailableSlots;
}> | null = null;

export function getBookingOps() {
  if (!_bookingOps) {
    _bookingOps = import('@/lib/supabase').then((mod) => ({
      invokeBooking: mod.invokeBooking,
      fetchAvailableSlots: mod.fetchAvailableSlots,
    }));
  }
  return _bookingOps;
}