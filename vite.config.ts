import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["@emotion/styled", "@mui/material/Tooltip"],
  },
  plugins: [react()],
  server: {
    port: 8080,
  },
})
