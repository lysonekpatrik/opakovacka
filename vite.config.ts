import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Aplikace běží na GitHub Pages na adrese https://<uživatel>.github.io/opakovacka/
// Při přechodu na vlastní doménu stačí změnit BASE na '/'.
const BASE = '/opakovacka/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: `${BASE}index.html`,
      },
      manifest: {
        name: 'Opakovačka',
        short_name: 'Opakovačka',
        description: 'Kvízy na procvičování školního učiva. Po každé odpovědi vysvětlení.',
        lang: 'cs',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F3F5FB',
        theme_color: '#2846C4',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
