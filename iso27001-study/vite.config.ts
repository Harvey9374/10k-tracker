import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves this app from /<repo>/. Override with BASE_PATH if needed.
const base = process.env.BASE_PATH ?? '/10k-tracker/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'ISO 27001 Lead Implementer Study',
        short_name: 'ISO 27001 LI',
        description: 'Learn, practise and test for the ISO/IEC 27001 Lead Implementer exam',
        theme_color: '#0b1020',
        background_color: '#0b1020',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
