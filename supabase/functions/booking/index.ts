import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

interface AppointmentPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  appointment_date: string;
  appointment_time: string;
  message?: string;
}

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/[\x00-\x1F\x7F]/g, '').trim().substring(0, 500);
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

const VALID_TIMES = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00',
];

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ct = req.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 415,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let body: AppointmentPayload;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!body.name || !body.email || !body.phone || !body.service || !body.location || !body.appointment_date || !body.appointment_time) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allowedServices = ['classical', 'sport', 'anticellulite', 'aromatherapy', 'back'];
    const allowedLocations = ['vt', 'pv'];
    if (!allowedServices.includes(body.service)) {
      return new Response(JSON.stringify({ error: 'Invalid service value' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!allowedLocations.includes(body.location)) {
      return new Response(JSON.stringify({ error: 'Invalid location value' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!VALID_TIMES.includes(body.appointment_time)) {
      return new Response(JSON.stringify({ error: 'Invalid appointment time' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.appointment_date)) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const appointDate = new Date(body.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    if (appointDate < today || appointDate > maxDate) {
      return new Response(JSON.stringify({ error: 'Invalid appointment date' }), {
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
      .eq('blocked_date', body.appointment_date)
      .maybeSingle();

    if (blockedCheckError) {
      console.error('Blocked check error:', blockedCheckError.message);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (blockedData) {
      return new Response(JSON.stringify({
        error: 'Day is blocked',
        message: 'Този ден е почивен. Моля, изберете друга дата за вашия час.',
      }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === CROSS-LOCATION DOUBLE-BOOKING PREVENTION ===
    const otherLocation = body.location === 'vt' ? 'pv' : 'vt';

    // 1. Check direct conflict in selected location
    const { data: localConflict, error: localCheckError } = await supabase
      .from('appointments')
      .select('id')
      .eq('location', body.location)
      .eq('appointment_date', body.appointment_date)
      .eq('appointment_time', body.appointment_time)
      .neq('status', 'cancelled')
      .maybeSingle();

    if (localCheckError) {
      console.error('Local check error:', localCheckError.message);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (localConflict) {
      return new Response(JSON.stringify({
        error: 'Slot already taken',
        message: 'Този час вече е резервиран. Моля, изберете друг час.',
      }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Check cross-location conflict
    const [h, m] = body.appointment_time.split(':').map(Number);
    const prevH = h - 1;
    const prevTime = prevH >= 9 ? `${String(prevH).padStart(2, '0')}:${String(m).padStart(2, '0')}` : null;

    const crossTimesToCheck = [body.appointment_time];
    if (prevTime) crossTimesToCheck.push(prevTime);

    const { data: crossConflicts, error: crossCheckError } = await supabase
      .from('appointments')
      .select('id, appointment_time')
      .eq('location', otherLocation)
      .eq('appointment_date', body.appointment_date)
      .in('appointment_time', crossTimesToCheck)
      .neq('status', 'cancelled');

    if (crossCheckError) {
      console.error('Cross check error:', crossCheckError.message);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (crossConflicts && crossConflicts.length > 0) {
      return new Response(JSON.stringify({
        error: 'Slot already taken',
        message: 'Този час не е наличен, защото масажистът е зает в другото студио. Моля, изберете друг час.',
      }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === INSERT APPOINTMENT ===
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        name: sanitize(body.name),
        email: body.email.trim().toLowerCase().substring(0, 254),
        phone: sanitize(body.phone).substring(0, 20),
        service: body.service,
        location: body.location,
        appointment_date: body.appointment_date,
        appointment_time: body.appointment_time,
        message: body.message ? sanitize(body.message).substring(0, 500) : '',
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') {
        return new Response(JSON.stringify({
          error: 'Slot already taken',
          message: 'Този час току-що беше резервиран от друг клиент. Моля, изберете друг час.',
        }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.error('DB error:', error.message);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
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
