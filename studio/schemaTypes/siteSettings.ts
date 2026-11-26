import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

// Ett fast dokument med det som går igjen på alle sider.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Innstillinger',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'forside', title: 'Forsiden', default: true},
    {name: 'kontakt', title: 'Kontakt og bedrift'},
    {name: 'seo', title: 'Søk og deling'},
  ],
  fields: [
    defineField({
      name: 'etikett',
      title: 'Liten tekst over overskriften',
      type: 'string',
      group: 'forside',
      initialValue: 'Bryllupsfotograf · Rogaland, Vestlandet og hele Norge',
    }),
    defineField({
      name: 'overskrift',
      title: 'Overskrift',
      type: 'string',
      group: 'forside',
      initialValue: 'Bilder som tar dere tilbake til dagen',
    }),
    defineField({name: 'omTekst', title: 'Kort om deg', type: 'text', rows: 4, group: 'forside'}),
    defineField({
      name: 'knappetekst',
      title: 'Tekst på hovedknappen',
      type: 'string',
      group: 'forside',
      initialValue: 'Sjekk om datoen er ledig',
    }),
    defineField({
      name: 'kontaktOverskrift',
      title: 'Overskrift i kontaktfeltet',
      type: 'string',
      group: 'forside',
      initialValue: 'Skal dere gifte dere?',
    }),
    defineField({
      name: 'kontaktTekst',
      title: 'Tekst i kontaktfeltet',
      type: 'string',
      group: 'forside',
      initialValue: 'Fortell meg litt om dagen deres, så sjekker jeg om datoen er ledig.',
    }),
    defineField({name: 'navn', title: 'Bedriftsnavn', type: 'string', group: 'kontakt', initialValue: 'Fotograf Karoline Rage'}),
    defineField({name: 'epost', title: 'E-post', type: 'string', group: 'kontakt'}),
    defineField({name: 'telefon', title: 'Telefon', type: 'string', group: 'kontakt'}),
    defineField({name: 'instagram', title: 'Instagram-brukernavn', type: 'string', description: 'Uten @', group: 'kontakt'}),
    defineField({name: 'orgnr', title: 'Org.nr.', type: 'string', group: 'kontakt'}),
    defineField({name: 'poststed', title: 'Poststed', type: 'string', group: 'kontakt', description: 'Brukes i strukturerte data for Google'}),
    defineField({
      name: 'omrader',
      title: 'Områder du fotograferer i',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      group: 'kontakt',
      description: 'Brukes i strukturerte data, f.eks. Rogaland, Vestland, Norge',
    }),
    defineField({
      name: 'seoTittel',
      title: 'Standard tittel i Google',
      type: 'string',
      group: 'seo',
      initialValue: 'Bryllupsfotograf Karoline Rage – Rogaland og Vestlandet',
    }),
    defineField({name: 'seoBeskrivelse', title: 'Standard beskrivelse i Google', type: 'text', rows: 2, group: 'seo'}),
    defineField({name: 'delingsbilde', title: 'Standard delingsbilde', type: 'bilde', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Innstillinger'})},
})
