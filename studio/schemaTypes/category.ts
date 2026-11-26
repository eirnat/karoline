import {defineArrayMember, defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

// En tjeneste: Bryllup, Familie, Tur og kjæreste, Ansattbilder.
export const category = defineType({
  name: 'category',
  title: 'Tjeneste',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({name: 'navn', title: 'Navn', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Adresse',
      type: 'slug',
      description: 'For eksempel «bryllup» gir /bryllup',
      options: {source: 'navn'},
      validation: (r) => r.required(),
      readOnly: ({document}) => Boolean(document?._id?.replace('drafts.', '').startsWith('kategori-')),
    }),
    defineField({
      name: 'kortTekst',
      title: 'Kort tekst til kortet på forsiden',
      type: 'string',
      description: 'Én setning, for eksempel «Ute i naturen, i deres tempo.»',
    }),
    defineField({
      name: 'prisFra',
      title: 'Pris fra',
      type: 'string',
      description: 'Slik den skal stå, for eksempel «Heldag fra 40 000 kr inkl. mva.»',
    }),
    defineField({
      name: 'ingress',
      title: 'Ingress',
      type: 'text',
      rows: 3,
      description: 'Vises øverst på tjenestesiden.',
    }),
    defineField({
      name: 'tekst',
      title: 'Tekst',
      type: 'array',
      of: [defineArrayMember({type: 'block', styles: [{title: 'Normal', value: 'normal'}, {title: 'Overskrift', value: 'h2'}]})],
    }),
    defineField({
      name: 'pakker',
      title: 'Pakker',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pakke',
          fields: [
            defineField({name: 'navn', title: 'Navn', type: 'string'}),
            defineField({name: 'pris', title: 'Pris', type: 'string'}),
            defineField({name: 'beskrivelse', title: 'Hva som er inkludert', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'navn', subtitle: 'pris'}},
        }),
      ],
    }),
    defineField({name: 'bilde', title: 'Bilde til kortet på forsiden', type: 'bilde'}),
    defineField({
      name: 'rekkefolge',
      title: 'Rekkefølge',
      type: 'number',
      description: 'Lavest først. Bryllup = 1.',
      initialValue: 10,
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
  orderings: [{title: 'Rekkefølge', name: 'rekkefolge', by: [{field: 'rekkefolge', direction: 'asc'}]}],
  preview: {select: {title: 'navn', subtitle: 'prisFra', media: 'bilde'}},
})
