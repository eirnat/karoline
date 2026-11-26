import {defineConfig} from 'astro/config'
import sitemap from '@astrojs/sitemap'
import {loadEnv} from 'vite'

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '')

export default defineConfig({
  site: env.SITE_URL || 'https://fotografkarolinerage.com',
  trailingSlash: 'never',
  build: {format: 'file'},
  integrations: [sitemap({filter: (page) => !page.includes('/404')})],
  image: {domains: ['cdn.sanity.io']},
})
