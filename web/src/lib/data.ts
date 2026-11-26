// Ett sted for å hente data. Hvert kall mellomlagres under bygget, så Sanity
// bare får én forespørsel per spørring selv om mange sider bruker den.
// Med DEMO=1 brukes eksempelinnholdet fra skissene i stedet for Sanity.
import * as Q from './queries'
import type {Faq, Innstillinger, Kategori, Omtale, StoryKort} from './typer'
import {utenPlassholder} from './tekst'

const DEMO = import.meta.env.DEMO === '1' || process.env.DEMO === '1'

const cache = new Map<string, Promise<unknown>>()

async function q<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const key = query + JSON.stringify(params)
  if (!cache.has(key)) {
    cache.set(
      key,
      DEMO
        ? import('./demo').then((d) => d.demoSvar(query, params))
        : import('./sanity').then(({hent}) => hent<T>(query, params)),
    )
  }
  return cache.get(key) as Promise<T>
}

export type StoryFull = StoryKort & {
  _updatedAt?: string
  seo?: {tittel?: string; beskrivelse?: string}
  leverandorer?: {_key: string; rolle?: string; navn?: string; lenke?: string}[]
  sted?: string
  stedInfo?: {navn: string; region?: string; preposisjon?: 'i' | 'på'}
  kategori: {_id: string; navn: string; slug: string; prisFra?: string}
  bilder?: import('./typer').Bilde[]
  omtale?: Omtale
}

export type GalleriStory = {
  navn: string
  slug: string
  sted?: string
  kategori: {navn: string; slug: string}
  bilder: import('./typer').Bilde[]
}

export type Side = {
  tittel: string
  slug: string
  ingress?: string
  tekst?: unknown[]
  seo?: {tittel?: string; beskrivelse?: string}
  bilde?: import('./typer').Bilde
}

export const innstillinger = () => q<Innstillinger>(Q.INNSTILLINGER)
export const kategorier = () => q<Kategori[]>(Q.KATEGORIER)
export const stories = () => q<StoryKort[]>(Q.STORIES)
export const galleri = () => q<GalleriStory[]>(Q.GALLERI)
function reneSporsmal(liste: Faq[]) {
  return liste.map((f) => ({...f, svar: utenPlassholder(f.svar)})).filter((f) => f.sporsmal && f.svar)
}

export const faqForside = async () => reneSporsmal(await q<Faq[]>(Q.FAQ_FORSIDE))
export const faqKategori = async (kategoriId: string) => reneSporsmal(await q<Faq[]>(Q.FAQ_KATEGORI, {kategoriId}))
export const omtaleForside = () => q<Omtale>(Q.OMTALE_FORSIDE)
export const sider = () => q<Side[]>(Q.SIDER)

export async function story(slug: string): Promise<StoryFull | null> {
  const s = await q<(Omit<StoryFull, 'sted'> & {sted?: {navn: string; region?: string; preposisjon?: 'i' | 'på'}}) | null>(Q.STORY, {slug})
  if (!s) return null
  return {...s, sted: s.sted?.navn, stedInfo: s.sted}
}
