// Cloudflare Worker: serverer de statiske sidene og tar imot kontaktskjemaet på /api/kontakt.
// Alt annet enn /api/* går rett til filene i dist/ (se run_worker_first i wrangler.jsonc).

interface Env {
  ASSETS: Fetcher
  /** send_email-binding. Settes opp i wrangler.jsonc når Email Routing er klart. */
  EPOST?: SendEmail
  /** Hemmelig nøkkel fra Turnstile: npx wrangler secret put TURNSTILE_SECRET */
  TURNSTILE_SECRET?: string
  /** Avsender på et domene i Cloudflare, f.eks. skjema@fotografkarolinerage.com */
  KONTAKT_FRA?: string
  /** Karolines bekreftede adresse i Email Routing */
  KONTAKT_TIL?: string
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {status, headers: {'Content-Type': 'application/json; charset=utf-8'}})

async function sjekkTurnstile(token: string, secret: string, ip: string | null) {
  const body = new FormData()
  body.append('secret', secret)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)
  const svar = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {method: 'POST', body})
  const data = (await svar.json()) as {success: boolean}
  return data.success
}

async function kontakt(request: Request, env: Env) {
  const vilHaJson = request.headers.get('Accept')?.includes('application/json')
  const svar = (ok: boolean, feil?: string, status = 400) =>
    vilHaJson ? json(ok ? {ok} : {feil}, ok ? 200 : status) : Response.redirect(new URL(ok ? '/kontakt?sendt=1' : '/kontakt?feil=1', request.url).href, 303)

  const f = await request.formData()
  const felt = (n: string) => String(f.get(n) ?? '').trim().slice(0, 5000)

  // Honningkrukke: skjult felt som bare roboter fyller ut
  if (felt('nettside')) return svar(true)

  const navn = felt('navn')
  const epost = felt('epost')
  const melding = felt('melding')
  if (!navn || !epost || !melding || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) {
    return svar(false, 'Fyll inn navn, en gyldig e-post og en melding.')
  }

  if (env.TURNSTILE_SECRET) {
    const ok = await sjekkTurnstile(felt('cf-turnstile-response'), env.TURNSTILE_SECRET, request.headers.get('CF-Connecting-IP'))
    if (!ok) return svar(false, 'Spamsjekken feilet. Last siden på nytt og prøv igjen.')
  }

  if (!env.EPOST || !env.KONTAKT_FRA || !env.KONTAKT_TIL) {
    console.error('Kontaktskjema: EPOST, KONTAKT_FRA eller KONTAKT_TIL er ikke satt opp')
    return svar(false, 'Skjemaet er ikke ferdig satt opp ennå.', 503)
  }

  const fakta = [
    ['Navn', navn],
    ['E-post', epost],
    ['Telefon', felt('telefon')],
    ['Gjelder', felt('oppdrag')],
    ['Dato', felt('dato')],
    ['Sted', felt('sted')],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
  const tekst = [...fakta, '', melding].join('\n')

  try {
    await env.EPOST.send({
      from: {email: env.KONTAKT_FRA, name: 'Nettsiden'},
      to: env.KONTAKT_TIL,
      replyTo: {email: epost, name: navn},
      subject: `Forespørsel fra ${navn}${felt('dato') ? ` – ${felt('dato')}` : ''}`,
      text: tekst,
    })
  } catch (e) {
    console.error('Kontaktskjema: sending feilet', e)
    return svar(false, 'E-posten kunne ikke sendes.', 502)
  }
  return svar(true)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/kontakt') {
      if (request.method !== 'POST') return json({feil: 'Bruk POST'}, 405)
      return kontakt(request, env)
    }
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
