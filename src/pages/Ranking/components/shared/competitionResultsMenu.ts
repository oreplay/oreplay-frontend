import { rankingDuplicatedRunnersPath } from "../../../../shared/routes.ts"
import { DropdownMenuItem } from "../DropdownMenu/DropdownMenu.tsx"

interface CompetitionResultsMenuInput {
  exportLabel: string
  clubRankingLabel: string
  duplicatedRunnersLabel: string
  rankingId?: string
  onExport: () => void
  onExportClubRanking: () => void
}

export function competitionResultsMenuItems({
  exportLabel,
  clubRankingLabel,
  duplicatedRunnersLabel,
  rankingId,
  onExport,
  onExportClubRanking,
}: CompetitionResultsMenuInput): DropdownMenuItem[] {
  const exportItem: DropdownMenuItem = { label: exportLabel, onSelect: onExport }
  if (!rankingId) return [exportItem]
  return [
    exportItem,
    { label: clubRankingLabel, onSelect: onExportClubRanking },
    { label: duplicatedRunnersLabel, to: rankingDuplicatedRunnersPath(rankingId) },
  ]
}
