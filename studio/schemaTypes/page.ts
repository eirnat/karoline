import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const page = defineType({
  name: 'page',
  title: 'Side',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'tittel', title: 'Tittel', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Adresse',
      type: 'slug',
      description: '«om» gir /om, «kontakt» gir /kontakt',
      options: {source: 'tittel'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'ingress', title: 'Ingress', type: 'text', rows: 3}),
    defineField({name: 'bilde', title: 'Bilde', type: 'bilde'}),
    defineField({
      name: 'tekst',
      title: 'Tekst',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Overskrift', value: 'h2'},
          ],
        }),
        defineArrayMember({type: 'bilde'}),
      ],
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {select: {title: 'tittel', subtitle: 'slug.current', media: 'bilde'}},
})
