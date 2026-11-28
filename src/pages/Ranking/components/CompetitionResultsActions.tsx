import { useState } from "react"
import { useTranslationRanking } from "../shared/useTranslationRanking.ts"
import { competitionResultsMenuItems } from "./shared/competitionResultsMenu.ts"
import CompetitionResultsLink from "./CompetitionResultsLink.tsx"
import DropdownMenu from "./DropdownMenu/DropdownMenu.tsx"
import SettingsIcon from "./icons/SettingsIcon.tsx"
import ExportResultsDialog from "./ExportResults/ExportResultsDialog.tsx"
import ClubRankingExportDialog from "./ClubRankingExport/ClubRankingExportDialog.tsx"

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
  const [clubRankingOpen, setClubRankingOpen] = useState(false)
  const menuItems = competitionResultsMenuItems({
    exportLabel: t("ExportResults.title"),
    clubRankingLabel: t("ClubRankingExport.title"),
    duplicatedRunnersLabel: t("DuplicatedRunners.title"),
    rankingId,
    onExport: () => setExportOpen(true),
    onExportClubRanking: () => setClubRankingOpen(true),
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
      {clubRankingOpen && (
        <ClubRankingExportDialog
          eventId={eventId}
          stageId={stageId}
          onClose={() => setClubRankingOpen(false)}
        />
      )}
    </div>
  )
}
