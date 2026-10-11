// These endpoints are called by database webhooks/cron, never by the browser.
// Gateway JWT verification remains enabled; an anon JWT alone is insufficient.
export type LegacyVerification = { url: string; apiKey: string; fetcher?: typeof fetch };

export async function isInternalRequest(request: Request, keys: Array<string | undefined>, verification?: LegacyVerification): Promise<boolean> {
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer ([^\s]+)$/i);
  if (!match) return false;
  const exactKey = keys.some((key) => {
    if (!key || key.length !== match[1].length) return false;
    let difference = 0;
    for (let index = 0; index < key.length; index++) {
      difference |= key.charCodeAt(index) ^ match[1].charCodeAt(index);
    }
    return difference === 0;
  });
  if (exactKey) return true;
  if (!verification?.url || !verification.apiKey) return false;
  try {
    // A database webhook can retain a still-valid legacy service JWT that is
    // different from current environment keys. Decoding alone never authorizes
    // it: PostgREST must also verify it and allow access to the private queue.
    const segments = match[1].split('.');
    if (segments.length !== 3) return false;
    const claims = JSON.parse(atob(segments[1].replace(/-/g, '+').replace(/_/g, '/')));
    const projectRef = new URL(verification.url).hostname.split('.')[0];
    if (claims.role !== 'service_role' || claims.iss !== 'supabase' || claims.ref !== projectRef
      || !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) return false;
    const fetcher = verification.fetcher ?? fetch;
    const response = await fetcher(`${verification.url}/rest/v1/appointment_email_queue?select=id&limit=0`, {
      method: 'HEAD',
      headers: { apikey: verification.apiKey, Authorization: `Bearer ${match[1]}` },
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
