import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./i18n.ts"
import "../styles/tokens.css"
import "../styles/tailwind.css"
import Spinner from "../components/Spinner/Spinner.tsx"
import { RankingRoutes } from "../index.ts"

// Standalone dev points the generated client at a real backend. A bearer token
// can be supplied via VITE_DEV_TOKEN (copied from a logged-in host session);
// without it, authenticated endpoints simply return empty.
const API_DOMAIN =
  (import.meta.env.VITE_API_DOMAIN as string) || "http://localhost/"
const DEV_TOKEN = (import.meta.env.VITE_DEV_TOKEN as string) || null

/*
 * Standalone dev shell. It mimics what the host provides — a single React /
 * react-query / router runtime, the Tailwind styles, and an i18n instance whose
 * config (`./i18n.ts`) is a verbatim copy of the host's `src/i18n.ts` — so the
 * module can be developed in isolation with HMR. It is never shipped.
 *
 * The host wraps its app in <Suspense>; we mirror that here so the same i18n
 * config (which suspends while http-backend loads) works without changes.
 */
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Spinner label="Loading…" />}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/ranking" replace />} />
            <Route
              path="/ranking/*"
              element={
                <RankingRoutes apiBaseUrl={API_DOMAIN} authToken={DEV_TOKEN} />
              }
            />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>,
)
