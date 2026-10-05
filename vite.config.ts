/// <reference types="vitest/config" />
import { sentryVitePlugin } from "@sentry/vite-plugin"
import { configDefaults, defineConfig } from "vitest/config"
import { loadEnv, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

const ONE_DAY_IN_SECONDS = 24 * 60 * 60
const FIVE_MEBIBYTES = 5 * 1024 * 1024
const NO_CACHE_HEADERS = { "cache-control": "no-cache" }
const ALWAYS_FRESH_FILES = ["/sw.js", "/registerSW.js", "/manifest.webmanifest"]
const AZURE_CONFIG_FILE = "staticwebapp.config.json"
const ASSET_LINKS_FILE = ".well-known/assetlinks.json"
const AGENT_WORKTREES = ".claude/**"

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const parseList = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const azureStaticWebAppConfig = (websiteOrigin: string) => ({
  globalHeaders: {
    "Access-Control-Allow-Origin": websiteOrigin,
    "Access-Control-Allow-Methods": "HEAD, GET, OPTIONS",
  },
  routes: [
    ...ALWAYS_FRESH_FILES.map((route) => ({ route, headers: NO_CACHE_HEADERS })),
    { route: `/${ASSET_LINKS_FILE}`, headers: { "content-type": "application/json" } },
  ],
  mimeTypes: { ".webmanifest": "application/manifest+json" },
})

const androidAssetLinks = (packageName: string, fingerprints: string[]) => [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: packageName,
      sha256_cert_fingerprints: fingerprints,
    },
  },
]

const deploymentFiles = (env: Record<string, string>): Plugin => ({
  name: "oreplay-deployment-files",
  apply: "build",
  generateBundle() {
    const websiteOrigin = new URL(env.VITE_WEBSITE_DOMAIN).origin
    this.emitFile({
      type: "asset",
      fileName: AZURE_CONFIG_FILE,
      source: JSON.stringify(azureStaticWebAppConfig(websiteOrigin), null, 2),
    })

    const fingerprints = parseList(env.TWA_SHA256_CERT_FINGERPRINTS)
    if (fingerprints.length === 0) {
      this.warn(`TWA_SHA256_CERT_FINGERPRINTS is empty: ${ASSET_LINKS_FILE} not generated`)
      return
    }
    this.emitFile({
      type: "asset",
      fileName: ASSET_LINKS_FILE,
      source: JSON.stringify(androidAssetLinks(env.TWA_PACKAGE_ID, fingerprints), null, 2),
    })
  },
})

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
      deploymentFiles(env),
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
          globIgnores: [AZURE_CONFIG_FILE, ".well-known/**", "organizers/**"],
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
      exclude: [...configDefaults.exclude, AGENT_WORKTREES],
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
