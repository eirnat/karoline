// Alle GROQ-spørringer samlet ett sted.

// Felles projeksjon for ett bilde: nok til å lage URL-er med fokuspunkt og riktig format.
const BILDE = `{
  _key, alt, bildetekst, favoritt, crop, hotspot, asset,
  "dim": asset->metadata.dimensions,
  "lqip": asset->metadata.lqip
}`

const STORY_KORT = `{
  _id, navn, "slug": slug.current, dato, lokale, type, iKarusell,
  "sted": sted->navn,
  "kategori": kategori->{navn, "slug": slug.current},
  fortelling,
  "forsidebilde": forsidebilde${BILDE},
  "forste": bilder[0]${BILDE}
}`

export const INNSTILLINGER = `*[_id == "siteSettings"][0]{
  ..., "delingsbilde": delingsbilde${BILDE}
}`

export const KATEGORIER = `*[_type == "category" && defined(slug.current)] | order(rekkefolge asc) {
  _id, navn, "slug": slug.current, kortTekst, prisFra, ingress, tekst, pakker, seo,
  "bilde": bilde${BILDE},
  "reservebilde": *[_type == "story" && references(^._id)] | order(dato desc)[0]{
    "b": coalesce(forsidebilde, bilder[0])${BILDE}
  }.b
}`

export const STORIES = `*[_type == "story" && defined(slug.current) && defined(kategori)] | order(dato desc) ${STORY_KORT}`

export const STORY = `*[_type == "story" && slug.current == $slug][0]{
  _id, _updatedAt, navn, "slug": slug.current, dato, lokale, type, fortelling, seo, leverandorer,
  "sted": sted->{navn, region},
  "kategori": kategori->{_id, navn, "slug": slug.current, prisFra},
  "forsidebilde": forsidebilde${BILDE},
  "bilder": bilder[]${BILDE},
  "omtale": *[_type == "testimonial" && bryllup._ref == ^._id][0]{sitat, navn, sted}
}`

export const GALLERI = `*[_type == "story" && count(bilder[favoritt == true]) > 0] | order(dato desc) {
  navn, "slug": slug.current, "sted": sted->navn,
  "kategori": kategori->{navn, "slug": slug.current},
  "bilder": bilder[favoritt == true]${BILDE}
}`

export const FAQ_FORSIDE = `*[_type == "faq" && forsiden == true] | order(rekkefolge asc){sporsmal, svar}`

export const FAQ_KATEGORI = `*[_type == "faq" && $kategoriId in kategorier[]._ref] | order(rekkefolge asc){sporsmal, svar}`

export const OMTALE_FORSIDE = `*[_type == "testimonial" && forsiden == true][0]{sitat, navn, sted}`

export const SIDER = `*[_type == "page" && defined(slug.current)]{
  tittel, "slug": slug.current, ingress, tekst, seo, "bilde": bilde${BILDE}
}`
