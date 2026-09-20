import { useState } from "react"
import { useTranslationRanking } from "../shared/useTranslationRanking.ts"
import CompetitionResultsLink from "./CompetitionResultsLink.tsx"
import SettingsIcon from "./icons/SettingsIcon.tsx"
import ExportResultsDialog from "./ExportResults/ExportResultsDialog.tsx"

interface CompetitionResultsActionsProps {
  eventId: string
  stageId: string
}

export default function CompetitionResultsActions({
  eventId,
  stageId,
}: CompetitionResultsActionsProps) {
  const { t } = useTranslationRanking()
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <div className="rk-competition-results-actions flex items-center gap-2 self-start">
      <CompetitionResultsLink eventId={eventId} stageId={stageId} />
      <button
        type="button"
        onClick={() => setExportOpen(true)}
        aria-label={t("ExportResults.title")}
        className="text-neutral-500 transition-colors hover:text-primary"
      >
        <SettingsIcon />
      </button>
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
