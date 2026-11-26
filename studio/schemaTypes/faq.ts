import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'

export const faq = defineType({
  name: 'faq',
  title: 'Spørsmål og svar',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'sporsmal', title: 'Spørsmål', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'svar', title: 'Svar', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({
      name: 'kategorier',
      title: 'Vis på tjenestesidene',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
    }),
    defineField({name: 'forsiden', title: 'Vis på forsiden', type: 'boolean', initialValue: false}),
    defineField({name: 'rekkefolge', title: 'Rekkefølge', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'Rekkefølge', name: 'rekkefolge', by: [{field: 'rekkefolge', direction: 'asc'}]}],
  preview: {select: {title: 'sporsmal', subtitle: 'svar'}},
})
