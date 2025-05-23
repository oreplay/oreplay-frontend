import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["@emotion/styled", "@mui/material/Tooltip"],
  },
  plugins: [react()],
  server: {
    allowedHosts: [".oreplay.es"],
    port: 8080,
  },
  preview: {
    allowedHosts: [".oreplay.es"],
  },
})
