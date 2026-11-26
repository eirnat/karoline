import {defineConfig} from 'astro/config'
import sitemap from '@astrojs/sitemap'
import {createClient} from '@sanity/client'
import {loadEnv} from 'vite'

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '')

// Én spørring per bygging. Brukes til lastmod i nettstedskartet.
let datoer
function hentDatoer() {
  if (env.DEMO === '1') return Promise.resolve(new Map())
  datoer ??= createClient({
    projectId: env.PUBLIC_SANITY_PROJECT_ID || 'ujffh8q9',
    dataset: env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-11-26',
    useCdn: false,
  })
    .fetch(
      `*[(_type == "story" && defined(slug.current) && defined(kategori->slug.current)) || (_type in ["category", "page"] && defined(slug.current)) || _id == "siteSettings"]{
        _updatedAt,
        "path": select(
          _id == "siteSettings" => "/",
          _type == "story" => "/" + kategori->slug.current + "/" + slug.current,
          "/" + slug.current
        )
      }`,
    )
    .then((rader) => new Map(rader.filter((r) => r.path && r._updatedAt).map((r) => [r.path, r._updatedAt.slice(0, 10)])))
    .catch(() => new Map())
  return datoer
}

export default defineConfig({
  site: env.SITE_URL || 'https://fotografkarolinerage.com',
  trailingSlash: 'never',
  build: {format: 'file'},
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      async serialize(item) {
        const map = await hentDatoer()
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/'
        const lastmod = map.get(path)
        if (lastmod) item.lastmod = lastmod
        return item
      },
    }),
  ],
  image: {domains: ['cdn.sanity.io']},
})
