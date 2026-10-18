import { rankingDuplicatedRunnersPath } from "../../../shared/routes.ts"
import { DropdownMenuItem } from "../components/DropdownMenu/DropdownMenu.tsx"

interface CompetitionResultsMenuInput {
  exportLabel: string
  duplicatedRunnersLabel: string
  rankingId?: string
  onExport: () => void
}

export function competitionResultsMenuItems({
  exportLabel,
  duplicatedRunnersLabel,
  rankingId,
  onExport,
}: CompetitionResultsMenuInput): DropdownMenuItem[] {
  const exportItem: DropdownMenuItem = { label: exportLabel, onSelect: onExport }
  if (!rankingId) return [exportItem]
  return [
    exportItem,
    { label: duplicatedRunnersLabel, to: rankingDuplicatedRunnersPath(rankingId) },
  ]
}
