import {createImageUrlBuilder} from '@sanity/image-url'
import {sanityConfig} from './sanity'
import type {Bilde} from './typer'

const builder = createImageUrlBuilder(sanityConfig)

export function harBilde(b: Bilde | undefined): b is NonNullable<Bilde> & {asset: {_ref: string}} {
  return Boolean(b && b.asset && b.asset._ref)
}

// Én URL. Med både bredde og høyde beskjæres bildet rundt fokuspunktet Karoline satte.
export function bildeUrl(b: Bilde, bredde: number, forhold?: number) {
  if (!harBilde(b)) return ''
  let u = builder.image(b).width(bredde).auto('format').quality(80)
  if (forhold) u = u.height(Math.round(bredde / forhold)).fit('crop')
  return u.url()
}

export function srcset(b: Bilde, bredder: number[], forhold?: number) {
  return bredder.map((w) => `${bildeUrl(b, w, forhold)} ${w}w`).join(', ')
}

// Faste nøytrale toner som vises når et bilde mangler, slik som i skissene
const TONER = ['#5d625c', '#6a7062', '#6f6a62', '#4f5551', '#66625e', '#58604f']
export const tone = (i: number) => TONER[((i % TONER.length) + TONER.length) % TONER.length]

export function forholdFra(b: Bilde, reserve = 1.5) {
  return b?.dim?.aspectRatio || reserve
}
