import { useState } from "react"
import { useTranslationRanking } from "../../shared/useTranslationRanking.ts"
import { competitionResultsPath } from "../../shared/competitionLink.ts"
import SettingsIcon from "../../pages/RankingList/components/icons/SettingsIcon.tsx"
import ExportResultsDialog from "./components/ExportResultsDialog.tsx"

interface CompetitionResultsLinkProps {
  eventId: string
  stageId: string
}

export default function CompetitionResultsLink({ eventId, stageId }: CompetitionResultsLinkProps) {
  const { t } = useTranslationRanking()
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <div className="rk-competition-results-link flex items-center gap-2 self-start">
      <a
        href={competitionResultsPath(eventId, stageId)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:underline"
      >
        {t("Settings.competitionLink")}
      </a>
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
