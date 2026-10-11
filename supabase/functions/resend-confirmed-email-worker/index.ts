import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { createEmailWorker, createResendSender } from './worker.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY');
const resendApiKey = Deno.env.get('RESEND_API');
if (!supabaseUrl || !serviceRoleKey || !resendApiKey) throw new Error('Notification configuration missing');

Deno.serve(createEmailWorker({
  keys: [serviceRoleKey, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')],
  verification: { url: supabaseUrl, apiKey: Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey },
  database: createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } }),
  send: createResendSender(resendApiKey),
  from: 'reservations@npmassagestudio.com',
  region: Deno.env.get('SB_REGION'),
}));
