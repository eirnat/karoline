// Strukturerte data (schema.org) som gjør at Google og KI-tjenester forstår siden.
import type {Faq, Innstillinger, Kategori} from './typer'
import {googleAdresse, instagramAdresse, utenPlassholder} from './tekst'

export function bedrift(i: Innstillinger, site: URL, bilde?: string) {
  const bedriftId = new URL('/#bedrift', site).href
  const personId = new URL('/#karoline', site).href
  const samme = [instagramAdresse(i?.instagram), googleAdresse(i?.googleUrl)].filter(Boolean)
  const kart = googleAdresse(i?.googleUrl)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': bedriftId,
        name: i?.navn || 'Fotograf Karoline Rage',
        description: i?.omTekst,
        url: site.href,
        image: bilde,
        email: utenPlassholder(i?.epost) || undefined,
        telephone: utenPlassholder(i?.telefon) || undefined,
        areaServed: i?.omrader?.map((o) => ({'@type': 'AdministrativeArea', name: o})),
        address: i?.poststed ? {'@type': 'PostalAddress', addressLocality: i.poststed, addressCountry: 'NO'} : undefined,
        sameAs: samme.length ? samme : undefined,
        hasMap: kart || undefined,
        knowsAbout: ['Bryllupsfotografering', 'Familiefotografering', 'Kjærestebilder', 'Ansattbilder', 'Portrettfotografering'],
        founder: {'@id': personId},
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Karoline Rage',
        jobTitle: 'Fotograf',
        url: new URL('/om', site).href,
        worksFor: {'@id': bedriftId},
        sameAs: samme.length ? samme : undefined,
      },
    ],
  }
}

export function tjeneste(k: Kategori, site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${k.navn} – fotografering`,
    serviceType: k.navn,
    description: utenPlassholder(k.ingress || k.kortTekst),
    url: new URL(`/${k.slug}`, site).href,
    provider: {'@id': new URL('/#bedrift', site).href},
    offers: utenPlassholder(k.prisFra) ? {'@type': 'Offer', description: utenPlassholder(k.prisFra), priceCurrency: 'NOK'} : undefined,
  }
}

export function faqSide(sporsmal: Faq[]) {
  if (!sporsmal.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sporsmal.map((f) => ({
      '@type': 'Question',
      name: f.sporsmal,
      acceptedAnswer: {'@type': 'Answer', text: f.svar},
    })),
  }
}

export function brodsmuler(ledd: {navn: string; url: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: ledd.map((l, n) => ({'@type': 'ListItem', position: n + 1, name: l.navn, item: l.url})),
  }
}
