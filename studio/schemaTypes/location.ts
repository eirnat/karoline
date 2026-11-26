import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

export const location = defineType({
  name: 'location',
  title: 'Sted',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'navn',
      title: 'Navn',
      type: 'string',
      description: 'For eksempel Oslo, Bremanger, Italia',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'preposisjon',
      title: 'Preposisjon',
      type: 'string',
      description: '«i Oslo», men «på Sotra».',
      initialValue: 'i',
      options: {
        list: [
          {title: 'i', value: 'i'},
          {title: 'på', value: 'på'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      description: 'For eksempel Østlandet, Vestland, Rogaland, Utlandet',
    }),
  ],
  preview: {select: {title: 'navn', subtitle: 'region'}},
})
