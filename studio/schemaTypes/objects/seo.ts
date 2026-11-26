import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'Søk og deling (valgfritt)',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'tittel',
      title: 'Tittel i Google',
      type: 'string',
      description: 'Tom = lages automatisk fra navn og sted.',
      validation: (rule) => rule.max(65).warning('Google viser rundt 60 tegn'),
    }),
    defineField({
      name: 'beskrivelse',
      title: 'Beskrivelse i Google',
      type: 'text',
      rows: 2,
      description: 'Tom = de første setningene i fortellingen.',
      validation: (rule) => rule.max(160).warning('Google viser rundt 155 tegn'),
    }),
  ],
})
