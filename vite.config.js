import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'MyState — Iowa State University',
        short_name: 'MyState',
        description: 'The ultimate ISU campus companion app',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0a0a0f',
        theme_color: '#C8102E',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json}']
      }
    })
  ],
  base: './',
  server: {
    proxy: {
      '/cyride-api': {
        target: 'https://www.mycyride.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/cyride-api/, ''),
        secure: true,
      },
      '/amesride-api': {
        target: 'https://amesride.demerstech.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/amesride-api/, ''),
        secure: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
