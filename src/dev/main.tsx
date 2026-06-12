import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import "./i18n.ts"
import "../styles/tokens.css"
import "../styles/tailwind.css"
import { initAxiosClientInstance } from "../infrastructure/orval/AxiosInstance.ts"
import { RankingRoutes } from "../index.ts"

// In the host this is configured centrally; for standalone dev we point the
// generated client at a real backend (defaults to the local one).
const API_DOMAIN =
  (import.meta.env.VITE_API_DOMAIN as string) || "http://localhost/"
initAxiosClientInstance(API_DOMAIN)

/*
 * Standalone dev shell. It mimics what the host provides — a single React /
 * react-query / router runtime and the shared MUI theme — so the module can be
 * developed in isolation with HMR. It is never shipped in the package.
 */
const theme = createTheme({
  palette: {
    primary: { main: "#ff710a", light: "#f5f5f5" },
    secondary: { main: "#5e2572", light: "#efefef" },
    text: { secondary: "#646464" },
  },
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/ranking" replace />} />
            <Route path="/ranking/*" element={<RankingRoutes />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
