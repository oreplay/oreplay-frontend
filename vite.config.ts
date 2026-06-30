import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// DEV ONLY: if the ranking module's source is present (bind-mounted into the
// dev container), alias to it for HMR. Absent in CI/prod → uses the published
// @oreplay/ranking package. cwd(), not import.meta.url (temp-compiled config).
const rankingSource = resolve(process.cwd(), "oreplay-ranking/src/index.ts")
const rankingAlias = existsSync(rankingSource) ? { "@oreplay/ranking": rankingSource } : {}

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["@emotion/styled", "@mui/material/Tooltip"],
  },

  // Keep one copy of the shared singletons when using the dev-linked source;
  // mirrors the module's peerDependencies (Tailwind-only, so no MUI/emotion).
  resolve: {
    alias: rankingAlias,
    dedupe: ["react", "react-dom", "react-router-dom", "react-query", "react-i18next", "i18next"],
  },

  base: "https://purple-coast-02f129503.2.azurestaticapps.net/",
  plugins: [
    react(),
    sentryVitePlugin({
      org: "o-replay",
      project: "o-replay",
    }),
  ],

  server: {
    allowedHosts: [".oreplay.es"],
    port: 8080,
  },

  preview: {
    allowedHosts: [".oreplay.es"],
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "use client" directive warnings from dependencies
        if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes('"use client"')) {
          return
        }
        warn(warning)
      },
    },
  },
})
