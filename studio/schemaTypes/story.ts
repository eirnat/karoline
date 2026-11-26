import {defineArrayMember, defineField, defineType} from 'sanity'
import {HeartIcon} from '@sanity/icons/Heart'
import {norskSlug} from '../lib/slug'
import {apiVersion} from '../env'
import {BilderInput} from '../components/BilderInput'

// Ett bryllup eller annet oppdrag, med alle bildene.
export const story = defineType({
  name: 'story',
  title: 'Oppdrag',
  type: 'document',
  icon: HeartIcon,
  groups: [
    {name: 'innhold', title: 'Innhold', default: true},
    {name: 'detaljer', title: 'Leverandører og søk'},
  ],
  fields: [
    defineField({
      name: 'navn',
      title: 'Navn på paret',
      type: 'string',
      description: 'For eksempel «Lyra & Stian». For andre oppdrag: en kort tittel.',
      group: 'innhold',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dato',
      title: 'Dato',
      type: 'date',
      options: {dateFormat: 'DD.MM.YYYY'},
      group: 'innhold',
    }),
    defineField({
      name: 'sted',
      title: 'Sted',
      type: 'reference',
      to: [{type: 'location'}],
      description: 'Velg et sted, eller lag et nytt.',
      group: 'innhold',
    }),
    defineField({
      name: 'lokale',
      title: 'Lokale',
      type: 'string',
      description: 'For eksempel «Solstua». Tomt for oppdrag uten lokale.',
      group: 'innhold',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Heldag', value: 'heldag'},
          {title: 'Halvdag', value: 'halvdag'},
          {title: 'Vielse', value: 'vielse'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: ({document}) =>
        Boolean(document?.kategori) &&
        (document?.kategori as {_ref?: string})._ref !== 'kategori-bryllup',
      group: 'innhold',
    }),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'reference',
      to: [{type: 'category'}],
      options: {disableNew: true},
      group: 'innhold',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse',
      type: 'slug',
      description: 'Lages automatisk fra navn, lokale og sted. Trykk «Generer».',
      group: 'innhold',
      options: {
        slugify: (input: string) => norskSlug(input),
        source: async (doc, {getClient}) => {
          const d = doc as {navn?: string; lokale?: string; sted?: {_ref?: string}}
          let stedNavn = ''
          if (d.sted?._ref) {
            stedNavn =
              (await getClient({apiVersion}).fetch<string | null>(`*[_id == $id][0].navn`, {
                id: d.sted._ref,
              })) || ''
          }
          return [d.navn, d.lokale, stedNavn].filter(Boolean).join(' ')
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fortelling',
      title: 'Kort fortelling',
      type: 'text',
      rows: 4,
      description:
        '3–5 setninger om dagen: været, stemningen, et øyeblikk du husker. Vises øverst på siden – og er teksten Google og KI-tjenester leser.',
      group: 'innhold',
    }),
    defineField({
      name: 'forsidebilde',
      title: 'Forsidebilde',
      type: 'bilde',
      description: 'Vises i oversikter og når siden deles.',
      group: 'innhold',
    }),
    defineField({
      name: 'iKarusell',
      title: 'Vis forsidebildet i karusellen på forsiden',
      type: 'boolean',
      initialValue: false,
      group: 'innhold',
    }),
    defineField({
      name: 'bilder',
      title: 'Bilder',
      type: 'array',
      of: [defineArrayMember({type: 'bilde'})],
      options: {layout: 'grid'},
      components: {input: BilderInput},
      description:
        'Dra inn opptil 100 bilder om gangen. Bytt til «Liste» for å skrive tekst til mange bilder på rad. Stjernemerkede bilder vises i galleriet.',
      group: 'innhold',
    }),
    defineField({
      name: 'leverandorer',
      title: 'Leverandører',
      type: 'array',
      group: 'detaljer',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'leverandor',
          fields: [
            defineField({
              name: 'rolle',
              title: 'Rolle',
              type: 'string',
              description: 'For eksempel Lokale, Blomster, Kjole, Hår og sminke',
            }),
            defineField({name: 'navn', title: 'Navn', type: 'string'}),
            defineField({name: 'lenke', title: 'Nettside (valgfritt)', type: 'url'}),
          ],
          preview: {select: {title: 'navn', subtitle: 'rolle'}},
        }),
      ],
    }),
    defineField({
      name: 'gammelAdresse',
      title: 'Gammel adresse',
      type: 'string',
      description:
        'Adressen bryllupet hadde på den gamle siden, for eksempel /post/lyra-og-stian. Besøkende sendes videre automatisk.',
      group: 'detaljer',
      validation: (rule) =>
        rule.custom((v) => (!v || v.startsWith('/') ? true : 'Må starte med /')),
    }),
    defineField({name: 'seo', type: 'seo', group: 'detaljer'}),
  ],
  orderings: [
    {title: 'Dato, nyeste først', name: 'datoDesc', by: [{field: 'dato', direction: 'desc'}]},
  ],
  preview: {
    select: {
      navn: 'navn',
      sted: 'sted.navn',
      media: 'forsidebilde',
      forste: 'bilder.0',
      dato: 'dato',
    },
    prepare: ({navn, sted, media, forste, dato}) => ({
      title: navn || 'Uten navn',
      subtitle: [sted, dato ? dato.slice(0, 4) : null].filter(Boolean).join(' · '),
      media: media?.asset ? media : forste,
    }),
  },
})
