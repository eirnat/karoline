export type Bilde = {
  _key?: string
  alt?: string
  bildetekst?: string
  favoritt?: boolean
  asset?: {_ref: string}
  crop?: unknown
  hotspot?: unknown
  dim?: {width: number; height: number; aspectRatio: number}
  lqip?: string
} | null

export type Kategori = {
  _id: string
  navn: string
  slug: string
  kortTekst?: string
  prisFra?: string
  ingress?: string
  tekst?: unknown[]
  pakker?: {navn?: string; pris?: string; beskrivelse?: string; _key: string}[]
  seo?: {tittel?: string; beskrivelse?: string}
  bilde?: Bilde
  reservebilde?: Bilde
}

export type StoryKort = {
  _id: string
  navn: string
  slug: string
  dato?: string
  lokale?: string
  type?: 'heldag' | 'halvdag' | 'vielse'
  iKarusell?: boolean
  sted?: string
  kategori: {navn: string; slug: string}
  fortelling?: string
  forsidebilde?: Bilde
  forste?: Bilde
}

export type Innstillinger = {
  etikett?: string
  overskrift?: string
  omTekst?: string
  knappetekst?: string
  kontaktOverskrift?: string
  kontaktTekst?: string
  navn?: string
  epost?: string
  telefon?: string
  instagram?: string
  orgnr?: string
  poststed?: string
  omrader?: string[]
  seoTittel?: string
  seoBeskrivelse?: string
  delingsbilde?: Bilde
} | null

export type Faq = {sporsmal: string; svar: string}
export type Omtale = {sitat: string; navn?: string; sted?: string} | null
