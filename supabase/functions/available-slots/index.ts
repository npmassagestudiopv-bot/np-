import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const ALLOWED_ORIGINS = [
  'https://npmassagestudio.com',
  'https://www.npmassagestudio.com',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsHeaders(origin: string | null) {
  const allowed = ALLOWED_ORIGINS.includes(origin ?? '') ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

const ipMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.reset) {
    ipMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
    });
  }

  try {
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const date = url.searchParams.get('date');
    const location = url.searchParams.get('location');

    if (!date || !location) {
      return new Response(JSON.stringify({ error: 'Missing date or location parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allowedLocations = ['vt', 'pv'];
    if (!allowedLocations.includes(location)) {
      return new Response(JSON.stringify({ error: 'Invalid location' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing env vars: SUPABASE_URL or SERVICE_ROLE_KEY');
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // ── CHECK BLOCKED DATES (DAY OFF) ──────────────────
    const { data: blockedData, error: blockedCheckError } = await supabase
      .from('blocked_dates')
      .select('id')
      .eq('blocked_date', date)
      .maybeSingle();

    if (blockedCheckError) {
      console.error('Blocked check error:', blockedCheckError.message);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (blockedData) {
      return new Response(JSON.stringify({ takenSlots: [], blocked: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const otherLocation = location === 'vt' ? 'pv' : 'vt';

    // Fetch bookings for BOTH locations in parallel
    const [localResult, otherResult] = await Promise.all([
      supabase
        .from('appointments')
        .select('appointment_time')
        .eq('location', location)
        .eq('appointment_date', date)
        .neq('status', 'cancelled'),
      supabase
        .from('appointments')
        .select('appointment_time')
        .eq('location', otherLocation)
        .eq('appointment_date', date)
        .neq('status', 'cancelled'),
    ]);

    if (localResult.error) {
      console.error('DB error (local):', localResult.error.message);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (otherResult.error) {
      console.error('DB error (other):', otherResult.error.message);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const takenSet = new Set<string>();

    (localResult.data ?? []).forEach((row: any) => {
      takenSet.add(row.appointment_time);
    });

    (otherResult.data ?? []).forEach((row: any) => {
      const time = row.appointment_time;
      takenSet.add(time);

      const [h, m] = time.split(':').map(Number);
      const nextH = h + 1;
      if (nextH <= 18) {
        const nextTime = `${String(nextH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        takenSet.add(nextTime);
      }
    });

    const takenSlots = Array.from(takenSet).sort();

    return new Response(JSON.stringify({ takenSlots, blocked: false }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
