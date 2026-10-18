import { useState } from "react"
import { useTranslationRanking } from "../shared/useTranslationRanking.ts"
import { competitionResultsMenuItems } from "../shared/competitionResultsMenu.ts"
import CompetitionResultsLink from "./CompetitionResultsLink.tsx"
import DropdownMenu from "./DropdownMenu/DropdownMenu.tsx"
import SettingsIcon from "./icons/SettingsIcon.tsx"
import ExportResultsDialog from "./ExportResults/ExportResultsDialog.tsx"

interface CompetitionResultsActionsProps {
  eventId: string
  stageId: string
  rankingId?: string
}

export default function CompetitionResultsActions({
  eventId,
  stageId,
  rankingId,
}: CompetitionResultsActionsProps) {
  const { t } = useTranslationRanking()
  const [exportOpen, setExportOpen] = useState(false)
  const menuItems = competitionResultsMenuItems({
    exportLabel: t("ExportResults.title"),
    duplicatedRunnersLabel: t("DuplicatedRunners.title"),
    rankingId,
    onExport: () => setExportOpen(true),
  })

  return (
    <div className="rk-competition-results-actions flex items-center gap-2 self-start">
      <CompetitionResultsLink eventId={eventId} stageId={stageId} />
      <DropdownMenu
        triggerLabel={t("Settings.competitionMenuLabel")}
        trigger={<SettingsIcon />}
        items={menuItems}
      />
      {exportOpen && (
        <ExportResultsDialog
          open
          eventId={eventId}
          stageId={stageId}
          onClose={() => setExportOpen(false)}
        />
      )}
    </div>
  )
}
