/// <reference types="vitest/config" />
import { sentryVitePlugin } from "@sentry/vite-plugin"
import { defineConfig } from "vitest/config"
import { loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

const ONE_DAY_IN_SECONDS = 24 * 60 * 60
const FIVE_MEBIBYTES = 5 * 1024 * 1024
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const websiteDomainAndSubdomains = `.${new URL(env.VITE_WEBSITE_DOMAIN).hostname.replace(/^www\./, "")}`
  const apiOrigin = new URL(env.VITE_API_DOMAIN).origin

  return {
    optimizeDeps: {
      include: ["@emotion/styled", "@mui/material/Tooltip"],
    },

    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["apple-touch-icon.png"],
        manifest: {
          name: "O-Replay - Live Orienteering Results",
          short_name: "O-Replay",
          description: "Live results for orienteering, Rogaining and Relay races.",
          theme_color: "#1e2327",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait",
          start_url: "/",
          scope: "/",
          icons: [
            { src: "/pwa-icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/pwa-icons/icon-512.png", sizes: "512x512", type: "image/png" },
            {
              src: "/pwa-icons/icon-maskable-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "/pwa-icons/icon-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico,json,woff,woff2}"],
          globIgnores: ["staticwebapp.config.json", "organizers/**"],
          maximumFileSizeToCacheInBytes: FIVE_MEBIBYTES,
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api\//, /^\/\.well-known\//],
          runtimeCaching: [
            {
              urlPattern: new RegExp(`^${escapeRegExp(apiOrigin)}/api/`),
              handler: "NetworkFirst",
              options: {
                cacheName: "oreplay-api-cache",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 200, maxAgeSeconds: 7 * ONE_DAY_IN_SECONDS },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "oreplay-images-cache",
                expiration: { maxEntries: 200, maxAgeSeconds: 30 * ONE_DAY_IN_SECONDS },
              },
            },
          ],
        },
      }),
      sentryVitePlugin({
        org: "o-replay",
        project: "o-replay",
      }),
    ],

    server: {
      allowedHosts: [websiteDomainAndSubdomains],
      port: 8080,
    },

    preview: {
      allowedHosts: [websiteDomainAndSubdomains],
    },

    build: {
      sourcemap: true,
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress "use client" directive warnings from dependencies
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" &&
            warning.message.includes('"use client"')
          ) {
            return
          }
          warn(warning)
        },
      },
    },

    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      env: {
        TZ: "UTC",
      },
      // @toolpad/core ships ESM that does a directory import of @mui/material/styles,
      // which Node's resolver rejects; inline it so Vite transforms/resolves it.
      server: {
        deps: {
          inline: ["@toolpad/core"],
        },
      },
    },
  }
})
