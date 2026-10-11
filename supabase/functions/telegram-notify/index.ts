import { createTelegramHandler } from './handler.ts';

Deno.serve(createTelegramHandler({
  keys: [Deno.env.get('SERVICE_ROLE_KEY'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')],
  verification: {
    url: Deno.env.get('SUPABASE_URL') ?? '',
    apiKey: Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? '',
  },
  token: Deno.env.get('TELEGRAM_BOT_TOKEN'),
  chatId: Deno.env.get('TELEGRAM_CHAT_ID'),
}));
