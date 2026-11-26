// Kjøres etter `astro build`. Skriver dist/_redirects med 301 fra gamle adresser til nye.
// Cloudflare leser filen automatisk. Gamle adresser legges inn i feltet «Gammel adresse» i Sanity.
import {existsSync, writeFileSync} from 'node:fs'
import {createClient} from '@sanity/client'

if (existsSync('.env')) process.loadEnvFile('.env')

const linjer = []

if (process.env.DEMO !== '1') {
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'ujffh8q9'
  if (!projectId) {
    console.error('redirects: PUBLIC_SANITY_PROJECT_ID mangler – hopper over.')
    process.exit(1)
  }
  const sanity = createClient({
    projectId,
    dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-11-26',
    useCdn: false,
  })
  const gamle = await sanity.fetch(
    `*[_type == "story" && defined(gammelAdresse) && defined(slug.current)]{gammelAdresse, "ny": "/" + kategori->slug.current + "/" + slug.current}`,
  )
  for (const {gammelAdresse, ny} of gamle) {
    const fra = gammelAdresse.trim().replace(/\/$/, '')
    if (fra && fra !== ny) linjer.push(`${fra}  ${ny}  301`)
  }
}

// Resten av de gamle blogginnleggene og galleriet sendes til bryllupsoversikten.
// Kjærestebilder het /tur før lansering.
linjer.push('/post/*  /bryllup  301')
linjer.push('/blog  /bryllup  301')
linjer.push('/blog/*  /bryllup  301')
linjer.push('/tur  /kjaerestebilder  301')
linjer.push('/tur/*  /kjaerestebilder/:splat  301')

writeFileSync('dist/_redirects', linjer.join('\n') + '\n')
console.log(`redirects: skrev ${linjer.length} linjer til dist/_redirects`)
