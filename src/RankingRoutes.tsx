// Styles travel with the module so consumers (the host SPA) need no Tailwind
// pipeline of their own: `tokens.css` defines the palette CSS vars and
// `compiled.css` is the precompiled Tailwind output (preflight off — no global
// reset). Regenerate `compiled.css` with `npm run build:css` (or `dev:css` to
// watch). See CLAUDE.md.
import "./styles/tokens.css"
import "./styles/compiled.css"
import i18n from "i18next"
import { useEffect, useRef } from "react"
import { Route, Routes } from "react-router-dom"
import {
  initAxiosClientInstance,
  updateAxiosClientHeaders,
} from "./infrastructure/orval/AxiosInstance.ts"
import { registerRankingResources } from "./i18n/registerRankingResources.ts"
import RankingList from "./pages/RankingList/RankingList.tsx"
import RankingSettings from "./pages/RankingSettings/RankingSettings.tsx"

interface RankingRoutesProps {
  apiBaseUrl: string
  authToken: string | null
}

const bearer = (authToken: string | null) => ({
  Authorization: authToken ? `Bearer ${authToken}` : undefined,
})

/**
 * Routes subtree for the ranking module, mounted at `/ranking/*` by the host
 * (or the standalone dev shell).
 *
 * Auth is injected, not owned: whoever mounts this passes the API base URL and
 * the current bearer token. In the host that is the in-memory token from
 * `useAuth()` — no extra `/me` request on navigation. The token is pushed into
 * this module's axios singleton synchronously on first render (before any child
 * query fires) and refreshed whenever it changes.
 */
export default function RankingRoutes({
  apiBaseUrl,
  authToken,
}: RankingRoutesProps) {
  const configured = useRef(false)
  if (!configured.current) {
    initAxiosClientInstance(apiBaseUrl)
    updateAxiosClientHeaders(bearer(authToken))
    // The module owns its translations: merge them into the shared i18next
    // instance (the host's, or the dev shell's) so the host carries no
    // `Ranking.*` keys. Synchronous, before any child reads a key.
    registerRankingResources(i18n)
    configured.current = true
  }

  useEffect(() => {
    updateAxiosClientHeaders(bearer(authToken))
  }, [authToken])

  return (
    // `rk-root` carries the module's font stack (font-family inherits, so it
    // cascades to every child). `font-sans` resolves to the host-matching stack
    // configured in tailwind.config.js.
    <div className="rk-root font-sans">
      <Routes>
        <Route index element={<RankingList />} />
        <Route path=":rankingId/settings" element={<RankingSettings />} />
      </Routes>
    </div>
  )
}
