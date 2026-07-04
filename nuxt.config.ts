import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    '@nuxtjs/seo',
    'nuxt-security',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'es',
        name: 'Español',
        file: 'es.json',
      },
      {
        code: 'am',
        name: 'አማርኛ',
        file: 'am.json',
      },
    ],
    lazy: true,
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Money Conversion SPA',
      short_name: 'MoneySPA',
      start_url: '/',
      id: '/',
      scope: '/',
      display: 'standalone',
      theme_color: '#6750A4',
      background_color: '#FFFBFE',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: '/offline.html',
      runtimeCaching: [
        {
          urlPattern: /\/(?:[^.]+(?:\?.*)?)?$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 50,
            },
          },
        },
        {
          urlPattern: /\/_nuxt\/.*\.[a-f0-9]+\.\w+$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'hashed-bundles-cache',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 365,
              maxEntries: 200,
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 30,
              maxEntries: 60,
            },
          },
        },
        {
          urlPattern: /\/i18n\/locales\/.*\.json$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'translations-cache',
            expiration: {
              maxEntries: 10,
            },
          },
        },
      ],
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    name: 'Money Conversion SPA',
    description: 'Discover curated, vetted money-making resources and tools. Free calculators, checklists, and expert-selected opportunities.',
    defaultLocale: 'en',
  },

  sitemap: {
    urls: [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/resources', changefreq: 'daily', priority: 0.9 },
    ],
  },

  robots: {
    allow: ['*'],
  },

  ogImage: {
    enabled: true,
  },

  security: {
    ssg: {
      hashScripts: false,
    },
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'"],
        'report-uri': ['/api/csp-report'],
      },
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
      referrerPolicy: 'strict-origin-when-cross-origin',
    },
  },

  $development: {
    ogImage: {
      enabled: false,
    },
  },

  compatibilityDate: '2025-01-01',
})

