import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

// Ett bilde i et oppdrag: fokuspunkt, beskrivelse, bildetekst og favoritt.
export const bilde = defineType({
  name: 'bilde',
  title: 'Bilde',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true, metadata: ['lqip', 'palette']},
  fields: [
    defineField({
      name: 'alt',
      title: 'Bildebeskrivelse',
      type: 'string',
      description:
        'Én setning om hva bildet viser. Leses av Google, KI-tjenester og skjermlesere – vises ikke på siden.',
      validation: (rule) => rule.required().warning('Mangler bildebeskrivelse'),
    }),
    defineField({
      name: 'bildetekst',
      title: 'Bildetekst',
      type: 'string',
      description: 'Valgfritt. Vises under bildet på bryllupssiden.',
    }),
    defineField({
      name: 'favoritt',
      title: 'Favoritt – vis bildet i galleriet',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {media: 'asset', alt: 'alt', favoritt: 'favoritt'},
    prepare: ({media, alt, favoritt}) => ({
      media,
      title: alt || 'Mangler beskrivelse',
      subtitle: favoritt ? '★ Favoritt' : undefined,
    }),
  },
})
