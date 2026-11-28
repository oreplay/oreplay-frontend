// Ranking screens are Tailwind-only. Importing the source `tailwind.css` lets
// the host's Vite/PostCSS compile it at build time (no precompiled artifact).
// `tokens.css` holds the palette CSS vars the Tailwind colors reference.
import "../../styles/tokens.css"
import "../../styles/tailwind.css"
import { Route } from "react-router-dom"
import SentryRoutes from "../../components/SentryRoutes.tsx"
import RankingList from "./pages/RankingList/RankingList.tsx"
import RankingCreate from "./pages/RankingCreate/RankingCreate.tsx"
import RankingDuplicate from "./pages/RankingDuplicate/RankingDuplicate.tsx"
import RankingDuplicatedRunners from "./pages/RankingDuplicatedRunners/RankingDuplicatedRunners.tsx"
import RankingSettings from "./pages/RankingSettings/RankingSettings.tsx"
import RankingOrganizers from "./pages/RankingOrganizers/RankingOrganizers.tsx"

export default function Ranking() {
  return (
    <div className="tw-root font-sans">
      <SentryRoutes>
        <Route index element={<RankingList />} />
        <Route path="new" element={<RankingCreate />} />
        <Route path=":rankingId/settings" element={<RankingSettings />} />
        <Route path=":rankingId/duplicate" element={<RankingDuplicate />} />
        <Route path=":rankingId/duplicated-runners" element={<RankingDuplicatedRunners />} />
        <Route
          path=":rankingId/events/:eventId/stages/:stageId/stage-orders/:stageOrderId/organizers"
          element={<RankingOrganizers />}
        />
      </SentryRoutes>
    </div>
  )
}
