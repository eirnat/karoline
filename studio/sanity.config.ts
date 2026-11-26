import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {nbNOLocale} from '@sanity/locale-nb-no'
import {schemaTypes} from './schemaTypes'
import {structure, defaultDocumentNode} from './structure'
import {theme} from './theme'
import {projectId, dataset} from './env'
import {Logo} from './components/Logo'

const SINGLETONS = new Set(['siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'Fotograf Karoline Rage',
  projectId,
  dataset,
  theme,
  icon: Logo,
  plugins: [
    structureTool({structure, defaultDocumentNode}),
    nbNOLocale(),
    visionTool({title: 'GROQ'}),
  ],
  schema: {
    types: schemaTypes,
    // Egne maler, slik at et nytt bryllup får riktig kategori når det lages fra menyen
    templates: (prev) => [
      ...prev.filter((t) => !SINGLETONS.has(t.schemaType)),
      {
        id: 'story-i-kategori',
        title: 'Oppdrag i kategori',
        schemaType: 'story',
        parameters: [{name: 'kategoriId', type: 'string'}],
        value: (params: {kategoriId: string}) => ({
          kategori: {_type: 'reference', _ref: params.kategoriId},
        }),
      },
    ],
  },
  document: {
    // Innstillinger er ett fast dokument: kan ikke lages på nytt eller slettes
    actions: (prev, {schemaType}) =>
      SINGLETONS.has(schemaType)
        ? prev.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : prev,
    // Steder har ingen egen liste. De lages fra feltet «Sted» på et oppdrag.
    newDocumentOptions: (prev, {creationContext}) =>
      prev.filter((item) => !SINGLETONS.has(item.templateId) && (creationContext.type !== 'global' || item.templateId !== 'location')),
  },
})
