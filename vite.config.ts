/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"

const resolvePath = (relativePath: string) =>
  fileURLToPath(new URL(relativePath, import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/dev", "src/test", "**/*.test.*"],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolvePath("./src/index.ts"),
      name: "OreplayRanking",
      fileName: "oreplay-ranking",
      formats: ["es"],
    },
    rollupOptions: {
      // Shared singletons provided by the host at runtime — never bundle them.
      // Regexes so subpath imports (e.g. `react/jsx-runtime`) are externalised
      // too. `/^react/` covers react, react-dom, react-router-dom, react-query
      // and react-i18next.
      external: [/^react/, /^i18next/, /^axios/],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
})
