import {defineCliConfig} from 'sanity/cli'
import {projectId, dataset} from './env'

export default defineCliConfig({
  api: {projectId, dataset},
  // Adressen Studio legges ut på: https://<studioHost>.sanity.studio
  studioHost: process.env.SANITY_STUDIO_HOST || 'karolinerage',
  deployment: {autoUpdates: true, appId: 'a2cabcuqmmvw31d50yo8i5m5'},
})
