// Cloudflare Pages Function: zet een e-mailadres op de maandradar-lijst in Laposta.
// Nodig in Cloudflare (Settings → Variables and Secrets):
//   LAPOSTA_API_KEY  – je API-sleutel uit Laposta (als geheim opslaan)
//   LAPOSTA_LIST_ID  – de ID van de lijst "Maandradar"
// De sleutel staat zo nooit in de code of op de site.

const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('content-type') || '').includes('application/json');
  const reply = (status, body) => {
    if (wantsJson) return Response.json(body, { status });
    // zonder JavaScript: gewoon terug naar een pagina
    const to = body.ok ? '/aangemeld' : '/#maandradar';
    return Response.redirect(new URL(to, request.url), 303);
  };

  let email = '';
  try {
    if (wantsJson) email = (await request.json()).email || '';
    else email = (await request.formData()).get('email') || '';
  } catch {
    return reply(400, { ok: false, reason: 'email' });
  }
  email = String(email).trim();
  if (!MAIL.test(email) || email.length > 254) return reply(400, { ok: false, reason: 'email' });

  if (!env.LAPOSTA_API_KEY || !env.LAPOSTA_LIST_ID) return reply(503, { ok: false, reason: 'niet-ingesteld' });

  const form = new URLSearchParams({
    list_id: env.LAPOSTA_LIST_ID,
    ip: request.headers.get('CF-Connecting-IP') || '0.0.0.0',
    email,
    source_url: new URL('/', request.url).toString(),
  });
  const ua = request.headers.get('User-Agent');
  if (ua) form.set('user_agent', ua);

  let res;
  try {
    res = await fetch('https://api.laposta.org/v2/member', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(env.LAPOSTA_API_KEY + ':'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });
  } catch {
    return reply(502, { ok: false, reason: 'laposta' });
  }

  if (res.ok) return reply(200, { ok: true, status: 'aangemeld' });

  const data = await res.json().catch(() => ({}));
  const err = data && data.error ? data.error : {};
  const exists = err.code === 204 || /exist|bestaat/i.test(err.message || '');
  if (exists) return reply(200, { ok: true, status: 'bestaat' });
  if (err.parameter === 'email') return reply(400, { ok: false, reason: 'email' });
  return reply(502, { ok: false, reason: 'laposta' });
}

export function onRequest() {
  return new Response('Alleen POST', { status: 405, headers: { Allow: 'POST' } });
}
