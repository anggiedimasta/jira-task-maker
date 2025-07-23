// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  // Performance optimizations
  experimental: {
    payloadExtraction: false, // Reduce hydration payload
    inlineSSRStyles: false,   // Reduce HTML size
  },

  // Modern build optimizations
  modern: process.env.NODE_ENV === 'production',

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
  ],

  // Font optimization
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      display: 'swap',
      preload: true,
    }
  },

  // Image optimization
  image: {
    format: ['webp', 'avif'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  // Icon optimization - simplified
  icon: {
    mode: 'local'
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },

  // Build optimizations
  build: {
    transpile: [],
    analyze: process.env.ANALYZE === 'true',
  },

  // Vite optimizations
  vite: {
    build: {
      // Chunk size optimization
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libraries
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-utils': ['zod']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router'],
    },
  },

  // Runtime performance
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true },
    // Add headers for static assets
    '/_nuxt/**': { 
      headers: { 
        'Cache-Control': 's-maxage=31536000' 
      } 
    },
  },

  // Nitro optimizations
  nitro: {
    minify: true,
    compressPublicAssets: true,
    prerender: {
      crawlLinks: false
    }
  }
})