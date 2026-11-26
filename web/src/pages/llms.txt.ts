// Kort, ren tekst om bedriften og alle oppdrag, for KI-tjenester (llmstxt.org).
import type {APIRoute} from 'astro'
import {innstillinger, kategorier, stories, faqForside} from '../lib/data'
import {googleAdresse, instagramAdresse, kortTekst, storyUrl, typeTekst, utenPlassholder} from '../lib/tekst'

export const GET: APIRoute = async ({site}) => {
  const i = await innstillinger()
  const k = await kategorier()
  const s = await stories()
  const faq = await faqForside()
  const url = (p: string) => new URL(p, site).href

  const linjer = [
    `# ${i?.navn || 'Fotograf Karoline Rage'}`,
    '',
    `> ${i?.etikett || 'Bryllupsfotograf'}. ${i?.omTekst || ''}`.trim(),
    ...(i?.omrader?.length ? ['', `Områder: ${i.omrader.join(', ')}.`] : []),
    '',
    '## Tjenester',
    ...k.map((x) => `- [${x.navn}](${url('/' + x.slug)}): ${[x.kortTekst, utenPlassholder(x.prisFra)].filter(Boolean).join(' ')}`),
    '',
    '## Oppdrag',
    ...s.map((x) => `- [${x.navn}](${url(storyUrl(x))}): ${[typeTekst(x), x.lokale, x.sted, x.dato?.slice(0, 4)].filter(Boolean).join(', ')}. ${kortTekst(utenPlassholder(x.fortelling), 200)}`.trim()),
    '',
    ...(faq.length ? ['## Ofte stilte spørsmål', ...faq.map((f) => `- ${f.sporsmal} ${f.svar}`), ''] : []),
    '## Kontakt',
    `- [Send forespørsel](${url('/kontakt')})`,
    ...(utenPlassholder(i?.epost) ? [`- E-post: ${i!.epost}`] : []),
    ...(instagramAdresse(i?.instagram) ? [`- [Instagram](${instagramAdresse(i?.instagram)})`] : []),
    ...(googleAdresse(i?.googleUrl) ? [`- [Google-profil](${googleAdresse(i?.googleUrl)})`] : []),
  ]
  return new Response(linjer.join('\n') + '\n', {headers: {'Content-Type': 'text/plain; charset=utf-8'}})
}
