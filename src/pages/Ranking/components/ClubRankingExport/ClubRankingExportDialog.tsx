import { useState } from "react"
import { useTranslationRanking } from "../../shared/useTranslationRanking.ts"
import { useNotifyError } from "../../../../infrastructure/notifications/useNotifyError.ts"
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog.tsx"
import { downloadClubRanking } from "./shared/downloadClubRanking.ts"

interface ClubRankingExportDialogProps {
  eventId: string
  stageId: string
  onClose: () => void
}

export default function ClubRankingExportDialog({
  eventId,
  stageId,
  onClose,
}: ClubRankingExportDialogProps) {
  const { t } = useTranslationRanking()
  const notifyError = useNotifyError()
  const [downloading, setDownloading] = useState(false)

  const download = async () => {
    setDownloading(true)
    try {
      await downloadClubRanking(eventId, stageId)
      onClose()
    } catch (error) {
      notifyError(error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <ConfirmDialog
      open
      title={t("ClubRankingExport.title")}
      confirmLabel={t("ClubRankingExport.download")}
      closeLabel={t("common:close")}
      isConfirming={downloading}
      onConfirm={() => void download()}
      onClose={onClose}
    >
      <p className="rk-club-ranking-export-dialog m-0 text-sm text-neutral-700">
        {t("ClubRankingExport.description")}
      </p>
    </ConfirmDialog>
  )
}
