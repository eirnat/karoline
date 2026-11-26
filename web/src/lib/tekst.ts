import type {StoryKort} from './typer'

const MANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']

export function manedAar(dato?: string) {
  if (!dato) return ''
  const [aar, mnd] = dato.split('-').map(Number)
  const m = MANEDER[(mnd || 1) - 1] || ''
  return `${m.charAt(0).toUpperCase()}${m.slice(1)} ${aar}`
}

export function sesong(dato?: string) {
  if (!dato) return ''
  const m = Number(dato.slice(5, 7))
  if (m === 12 || m <= 2) return 'Vinter'
  if (m <= 5) return 'Vår'
  if (m <= 8) return 'Sommer'
  return 'Høst'
}

const TYPER = {heldag: 'Heldagsbryllup', halvdag: 'Halvdagsbryllup', vielse: 'Vielse'} as const
const TYPE_KORT = {heldag: 'Heldag', halvdag: 'Halvdag', vielse: 'Vielse'} as const

// «Heldagsbryllup» for bryllup, ellers kategorinavnet («Familie»)
export function typeTekst(s: Pick<StoryKort, 'type' | 'kategori'>) {
  if (s.kategori?.slug === 'bryllup') return s.type ? TYPER[s.type] : 'Bryllup'
  return s.kategori?.navn || ''
}

export function typeKort(type?: keyof typeof TYPE_KORT) {
  return type ? TYPE_KORT[type] : ''
}

export function storyUrl(s: {slug: string; kategori: {slug: string}}) {
  return `/${s.kategori.slug}/${s.slug}`
}

export function kortTekst(tekst = '', maks = 155) {
  const t = tekst.replace(/\s+/g, ' ').trim()
  if (t.length <= maks) return t
  return t.slice(0, maks - 1).replace(/\s+\S*$/, '') + '…'
}

// Plassholdere i hakeparentes fra skissene skal ikke sendes til Google
export function utenPlassholder(t?: string) {
  if (!t) return ''
  return t
    .replace(/\s*\[[^[\]]*\]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .trim()
}

export function instagramAdresse(brukernavn?: string) {
  const ig = brukernavn?.replace(/^@/, '').trim()
  if (!ig || ig.startsWith('[')) return ''
  return `https://www.instagram.com/${ig}/`
}

export function googleAdresse(url?: string) {
  const u = url?.trim()
  if (!u || u.startsWith('[') || !u.startsWith('https://')) return ''
  return u
}
