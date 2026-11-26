import type {DefaultDocumentNodeResolver, StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {CommentIcon} from '@sanity/icons/Comment'
import {TagIcon} from '@sanity/icons/Tag'
import {HeartIcon} from '@sanity/icons/Heart'
import {UsersIcon} from '@sanity/icons/Users'
import {SunIcon} from '@sanity/icons/Sun'
import {UserIcon} from '@sanity/icons/User'

// Venstremenyen: én liste per kategori, så resten. Steder har ingen egen liste.
// Titlene hentes fra kategoridokumentene, så menyen følger navnet på nettsiden.
const KATEGORIER = [
  {id: 'kategori-bryllup', tittel: 'Bryllup', ikon: HeartIcon},
  {id: 'kategori-familie', tittel: 'Familie', ikon: UsersIcon},
  {id: 'kategori-tur', tittel: 'Kjærestebilder', ikon: SunIcon},
  {id: 'kategori-ansatt', tittel: 'Ansattbilder', ikon: UserIcon},
]

export const structure: StructureResolver = async (S, context) => {
  const rader = await context
    .getClient({apiVersion: '2026-11-26'})
    .fetch<{_id: string; navn?: string}[]>(`*[_id in $ids]{_id, navn}`, {ids: KATEGORIER.map((k) => k.id)})
  const navn = new Map(rader.map((r) => [r._id, r.navn]))
  const tittel = (k: (typeof KATEGORIER)[number]) => navn.get(k.id) || k.tittel

  return S.list()
    .title('Innhold')
    .items([
      ...KATEGORIER.map((k) =>
        S.listItem()
          .id(k.id.replace('kategori-', ''))
          .title(tittel(k))
          .icon(k.ikon)
          .child(
            S.documentList()
              .id(`liste-${k.id}`)
              .title(tittel(k))
              .schemaType('story')
              .apiVersion('2026-11-26')
              .filter('_type == "story" && kategori._ref == $kategori')
              .params({kategori: k.id})
              .defaultOrdering([{field: 'dato', direction: 'desc'}])
              .initialValueTemplates([
                S.initialValueTemplateItem('story-i-kategori', {kategoriId: k.id}).title(
                  k.id === 'kategori-bryllup' ? 'Nytt bryllup' : `Nytt oppdrag: ${tittel(k)}`,
                ),
              ]),
          ),
      ),
      S.divider(),
      S.documentTypeListItem('page').title('Sider (Om, Kontakt, Priser)').icon(DocumentTextIcon),
      S.documentTypeListItem('faq').title('Spørsmål og svar').icon(HelpCircleIcon),
      S.documentTypeListItem('testimonial').title('Omtaler').icon(CommentIcon),
      S.documentTypeListItem('category').title('Tjenester og priser').icon(TagIcon),
      S.divider(),
      S.listItem()
        .id('innstillinger')
        .title('Innstillinger')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Innstillinger')),
    ])
}

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => S.document().views([S.view.form()])
