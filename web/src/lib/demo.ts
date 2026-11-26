// Eksempelinnhold fra skissene, brukt når siden bygges med DEMO=1.
// Bildene mangler med vilje: da vises nøytrale gråtoner, som i lerretet.
import * as Q from './queries'

const kat = {
  bryllup: {_id: 'kategori-bryllup', navn: 'Bryllup', slug: 'bryllup'},
  familie: {_id: 'kategori-familie', navn: 'Familie', slug: 'familie'},
  tur: {_id: 'kategori-tur', navn: 'Tur og kjæreste', slug: 'tur'},
  ansatt: {_id: 'kategori-ansatt', navn: 'Ansattbilder', slug: 'ansattbilder'},
}

const kategorier = [
  {...kat.bryllup, kortTekst: 'Fra forberedelsene om morgenen til første dans. Jeg dokumenterer hele dagen deres – de store øyeblikkene og alt det små imellom.', prisFra: 'Heldag fra 40 000 kr inkl. mva.', ingress: 'Bryllupsfotograf i Rogaland og på Vestlandet. Heldag fra 40 000 kr inkl. mva.'},
  {...kat.familie, kortTekst: 'Ute i naturen, i deres tempo.', prisFra: 'Fra [PRIS] kr'},
  {...kat.tur, kortTekst: 'Forlovelse, kjæreste eller bare dere to på tur.', prisFra: 'Fra [PRIS] kr'},
  {...kat.ansatt, kortTekst: 'Naturlige portretter for nettside og LinkedIn.', prisFra: 'Fra [PRIS] kr per ansatt'},
]

const fortelling =
  '[Kort fortelling om dagen, 3–5 setninger: hvem de er, været, stemningen og et øyeblikk som skilte seg ut. Denne teksten gjør at siden blir funnet når noen søker etter «bryllup Solstua» eller spør en KI om bryllupsfotografer i Oslo.]'

const s = (slug: string, navn: string, sted: string, dato: string, lokale = '', k = kat.bryllup) => ({
  _id: 'demo-' + slug,
  slug,
  navn,
  sted,
  dato,
  lokale,
  type: 'heldag',
  kategori: {navn: k.navn, slug: k.slug},
  fortelling,
  iKarusell: true,
  forsidebilde: null,
  forste: null,
})

const stories = [
  s('lyra-og-stian-solstua-oslo', 'Lyra & Stian', 'Oslo', '2026-06-20', 'Solstua'),
  s('charlotte-og-frode-bremanger', 'Charlotte & Frode', 'Bremanger', '2025-08-16'),
  s('signe-og-anders-sandnes', 'Signe & Anders', 'Sandnes', '2025-07-05'),
  s('marte-og-vegard-floro', 'Marte & Vegard', 'Florø', '2025-06-14'),
  s('malene-og-vegard-hardanger', 'Malene & Vegard', 'Hardanger', '2024-08-24'),
  s('marte-og-kristian-gulen', 'Marte & Kristian', 'Gulen', '2024-07-13'),
  s('andrea-og-jorgen-sotra', 'Andrea & Jørgen', 'Sotra', '2024-06-01'),
  s('camilla-jo-og-eivind-italia', 'Camilla Jo & Eivind', 'Italia', '2023-09-09'),
  s('familie-i-fjaera', 'Familie i fjæra', 'Sola', '2025-05-10', '', kat.familie),
  s('birgitte-og-torjus', 'Birgitte & Torjus', 'Lysefjorden', '2025-09-20', '', kat.tur),
]

const b = (alt: string, ar: number, favoritt = true, bildetekst = '') => ({
  _key: alt.slice(0, 12),
  alt,
  favoritt,
  bildetekst,
  dim: {width: 1000 * ar, height: 1000, aspectRatio: ar},
})

const lyraBilder = [
  b('Skiltet til Solstua ved en skogsvei', 1.5, true),
  b('Bruden gjør seg klar ved vinduet', 0.8, false),
  b('Brudgommen venter ved alteret i skogen', 0.8, false),
  b('Vielse i skogen med gjester på stoler', 1.5, true, 'Vielsen i skogen bak Solstua'),
  b('Brudebukett i nærbilde', 0.8, false),
  b('Gjester som ler under talene', 0.8, false),
  b('Hendene til brudeparet med ringene', 0.8, false),
  b('Første dans i kveldslys', 1.5, true),
]

const galleriRad = (st: (typeof stories)[number], bilder: ReturnType<typeof b>[]) => ({
  navn: st.navn,
  slug: st.slug,
  sted: st.sted,
  kategori: st.kategori,
  bilder,
})

const galleri = [
  galleriRad(stories[0], lyraBilder.filter((x) => x.favoritt)),
  galleriRad(stories[1], [b('Brudepar ved fjorden i Bremanger', 0.667), b('Gjester kaster ris over brudeparet', 1.5)]),
  galleriRad(stories[8], [b('Familie leker i fjæra', 1.5), b('Mor og barn i skogen', 0.8)]),
  galleriRad(stories[2], [b('Brudepar i kveldslys i Sandnes', 1.5), b('Ringene i nærbilde', 0.8)]),
  galleriRad(stories[9], [b('Kjærestepar på tur i lyngen', 0.667), b('Par på fjelltopp i solnedgang', 1.5)]),
  galleriRad(stories[3], [b('Brudebukett i nærbilde i Florø', 0.8)]),
  galleriRad(stories[4], [b('Brudepar foran fjell i Hardanger', 1.5), b('Bruden går ned midtgangen', 0.667)]),
  galleriRad(stories[5], [b('Brudepar på Skjerjehamn i Gulen', 0.667)]),
  galleriRad(stories[6], [b('Brudepar på svaberg på Sotra', 1.5)]),
  galleriRad(stories[7], [b('Brudepar i italiensk landsby', 1.5)]),
]

const faq = [
  {sporsmal: 'Hva koster bryllupsfotografering?', svar: 'Heldagsbryllup koster 40 000 kr inkl. mva. [Hva som er inkludert: antall timer, omtrent antall bilder og hvordan de leveres.]'},
  {sporsmal: 'Fotograferer du utenfor Rogaland?', svar: 'Ja. Jeg har fotografert bryllup blant annet i Oslo, Bremanger, Florø, Hardanger, Gulen, Sotra og Italia. [Hvordan reisekostnader beregnes.]'},
  {sporsmal: 'Når får vi bildene?', svar: '[Leveringstid, f.eks. antall uker etter bryllupet.]'},
  {sporsmal: 'Hvordan booker vi?', svar: 'Send en forespørsel med dato og sted, så svarer jeg så fort jeg kan. Hører dere ikke fra meg innen en uke, ta gjerne en titt i søppelposten.'},
]

const innstillinger = {
  etikett: 'Bryllupsfotograf · Rogaland, Vestlandet og hele Norge',
  overskrift: 'Bilder som tar dere tilbake til dagen',
  omTekst:
    'Jeg heter Karoline og har fotografert bryllup og livets store øyeblikk siden 2011. Helst ute i vill natur, og alltid midt mellom det ekte og det ærlige – slik at øyeblikkene kan leve videre i flere generasjoner.',
  knappetekst: 'Sjekk om datoen er ledig',
  kontaktOverskrift: 'Skal dere gifte dere?',
  kontaktTekst: 'Fortell meg litt om dagen deres, så sjekker jeg om datoen er ledig.',
  navn: 'Fotograf Karoline Rage',
  epost: '[e-post]',
  telefon: '[telefon]',
  instagram: '[brukernavn]',
  orgnr: '[ORG.NR.]',
  omrader: ['Rogaland', 'Vestland', 'Norge'],
  seoTittel: 'Bryllupsfotograf Karoline Rage – Rogaland og Vestlandet',
}

const sider = [
  {tittel: 'Om Karoline', slug: 'om', ingress: innstillinger.omTekst},
  {tittel: 'Kontakt', slug: 'kontakt', ingress: 'Fortell meg litt om dagen deres eller oppdraget, så tar jeg kontakt.'},
]

export function demoSvar(query: string, params: Record<string, unknown>): unknown {
  switch (query) {
    case Q.INNSTILLINGER:
      return innstillinger
    case Q.KATEGORIER:
      return kategorier
    case Q.STORIES:
      return stories
    case Q.GALLERI:
      return galleri
    case Q.FAQ_FORSIDE:
      return faq
    case Q.FAQ_KATEGORI:
      return params.kategoriId === 'kategori-bryllup' ? faq : []
    case Q.OMTALE_FORSIDE:
      return {sitat: '[Sitat fra et brudepar – for eksempel hva de følte da de så bildene for første gang.]', navn: '[Navn & navn]', sted: '[Sted]'}
    case Q.SIDER:
      return sider
    case Q.STORY: {
      const st = stories.find((x) => x.slug === params.slug)
      if (!st) return null
      const k = Object.values(kat).find((x) => x.slug === st.kategori.slug)!
      const g = galleri.find((x) => x.slug === st.slug)
      return {
        ...st,
        sted: {navn: st.sted},
        kategori: {...k, prisFra: kategorier.find((x) => x._id === k._id)?.prisFra},
        bilder: st.slug === stories[0].slug ? lyraBilder : g?.bilder || [],
        leverandorer: [
          {_key: 'a', rolle: 'Lokale', navn: st.lokale || '[navn]'},
          {_key: 'b', rolle: 'Blomster', navn: '[navn]'},
          {_key: 'c', rolle: 'Kjole', navn: '[navn]'},
          {_key: 'd', rolle: 'Hår og sminke', navn: '[navn]'},
        ],
      }
    }
    default:
      return null
  }
}
