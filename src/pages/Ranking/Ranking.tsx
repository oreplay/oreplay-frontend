// Ranking screens are Tailwind-only. Importing the source `tailwind.css` lets
// the host's Vite/PostCSS compile it at build time (no precompiled artifact).
// `tokens.css` holds the palette CSS vars the Tailwind colors reference.
import "../../styles/tokens.css"
import "../../styles/tailwind.css"
import { Route, Routes } from "react-router-dom"
import RankingList from "./pages/RankingList/RankingList.tsx"
import RankingDuplicate from "./pages/RankingDuplicate/RankingDuplicate.tsx"
import RankingSettings from "./pages/RankingSettings/RankingSettings.tsx"

/**
 * Ranking routes subtree, mounted by the app router at `/rankings/*`. The
 * `rk-root` wrapper scopes the ranking base resets and font stack — Tailwind
 * preflight is off globally, so the MUI tree is untouched (see tailwind.config.js
 * and src/styles/tailwind.css). Auth and i18n need no wiring here: the shared
 * axios client is already initialised in main.tsx with the bearer token, and the
 * `Ranking.*` strings are served from public/locales like every other page.
 */
export default function Ranking() {
  return (
    <div className="rk-root font-sans">
      <Routes>
        <Route index element={<RankingList />} />
        <Route path=":rankingId/settings" element={<RankingSettings />} />
        <Route path=":rankingId/duplicate" element={<RankingDuplicate />} />
      </Routes>
    </div>
  )
}
