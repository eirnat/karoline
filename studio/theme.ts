import {buildTheme} from '@sanity/themer'

// Samme uttrykk som nettsiden: svart på hvitt, ingen sterk aksentfarge.
// Gull (#B7791F) brukes bare på stjerner og favoritter i bildelisten.
export const theme = buildTheme({
  light: {
    accent: '#1F1F1F',
    text: '#1F1F1F',
    background: '#ffffff',
    contrast: 100,
  },
  dark: {
    accent: '#f2f2f2',
    background: '#111111',
  },
})
