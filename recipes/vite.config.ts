import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Change base to '/' if deploying to a custom domain or repo root
const base = '/10k-tracker/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // Cache recipes.json so the app works offline
        runtimeCaching: [
          {
            urlPattern: /\/recipes\.json$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'recipes-data',
              expiration: { maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
      manifest: {
        name: 'Protein Recipes',
        short_name: 'Recipes',
        description: 'Browse high-protein recipes',
        theme_color: '#16a34a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
