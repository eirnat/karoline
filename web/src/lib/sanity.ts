import {createClient, type QueryParams, type SanityClient} from '@sanity/client'

// Prosjekt-ID-en er ikke hemmelig. .env kan overstyre den, f.eks. mot et testprosjekt.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'ujffh8q9'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

// Brukes av bilde-URL-ene.
export const sanityConfig = {projectId, dataset}

let klient: SanityClient | null = null

export function hent<T>(query: string, params: QueryParams = {}): Promise<T> {
  if (!projectId) {
    throw new Error(
      'PUBLIC_SANITY_PROJECT_ID mangler. Kopier web/.env.example til web/.env og fyll inn prosjekt-ID-en fra sanity.io/manage. Lagre filen og start utviklingsserveren på nytt.',
    )
  }
  klient ??= createClient({
    projectId,
    dataset,
    apiVersion: '2026-11-26',
    // Bygget skal alltid få det sist publiserte, ikke en mellomlagret versjon
    useCdn: false,
    perspective: 'published',
  })
  return klient.fetch<T>(query, params)
}
