import { sentryVitePlugin } from "@sentry/vite-plugin"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["@emotion/styled", "@mui/material/Tooltip"],
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
  },
})
