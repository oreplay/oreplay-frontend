import { sentryVitePlugin } from "@sentry/vite-plugin"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://purple-coast-02f129503.2.azurestaticapps.net/",

  build: {
    sourcemap: true,
  },

  optimizeDeps: {
    include: ["@emotion/styled", "@mui/material/Tooltip"],
  },

  plugins: [
    react(),
    sentryVitePlugin({
      org: "o-replay",
      project: "o-replay",
    }),
  ],

  preview: {
    allowedHosts: [".oreplay.es"],
  },

  server: {
    allowedHosts: [".oreplay.es"],
    port: 8080,
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
})
