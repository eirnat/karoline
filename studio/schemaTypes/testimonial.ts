import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Omtale',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({name: 'sitat', title: 'Sitat', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({name: 'navn', title: 'Navn', type: 'string', description: 'For eksempel «Lyra & Stian»'}),
    defineField({name: 'sted', title: 'Sted', type: 'string'}),
    defineField({
      name: 'bryllup',
      title: 'Hører til bryllup',
      type: 'reference',
      to: [{type: 'story'}],
      description: 'Valgfritt. Da vises omtalen også på bryllupssiden.',
    }),
    defineField({name: 'forsiden', title: 'Vis på forsiden', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'navn', subtitle: 'sitat'}},
})
