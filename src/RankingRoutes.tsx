import { Route, Routes } from "react-router-dom"
import RankingList from "./pages/RankingList/RankingList.tsx"
import RankingSettings from "./pages/RankingSettings/RankingSettings.tsx"

/**
 * Routes subtree for the ranking module, mounted by the host at `/ranking/*`.
 *
 * This is the package entry point — the host only ever mounts a single
 * `<RankingRoutes />` element inside its own `<BrowserRouter>`.
 */
export default function RankingRoutes() {
  return (
    <Routes>
      <Route index element={<RankingList />} />
      <Route path=":rankingId/settings" element={<RankingSettings />} />
    </Routes>
  )
}
