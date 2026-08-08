import { useState } from "react"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import { useNotifyError } from "../../../../../../infrastructure/notifications/useNotifyError.ts"
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog.tsx"
import ComputeProgress from "../../../../components/ComputeProgress.tsx"
import { calculateRankingBatches } from "../../../../shared/calculateRankingBatches.ts"
import { Progress } from "../../../../shared/progress.ts"

interface ProcessResultsDialogProps {
  open: boolean
  onClose: () => void
  rankingId: string
  eventId: string
  stageId: string
}

const SUCCESS_NOTIFICATION_MS = 4000

export default function ProcessResultsDialog({
  open,
  onClose,
  rankingId,
  eventId,
  stageId,
}: ProcessResultsDialogProps) {
  const { t } = useTranslationRanking()
  const notifications = useNotifications()
  const notifyError = useNotifyError()
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState<Progress | null>(null)

  const close = () => {
    setProcessing(false)
    setProgress(null)
    onClose()
  }

  const confirm = async () => {
    setProcessing(true)
    setProgress(null)
    try {
      await calculateRankingBatches(rankingId, eventId, stageId, (completed, total) =>
        setProgress({ completed, total }),
      )
      notifications.show(t("StageOrders.processResultsSuccess"), {
        severity: "success",
        autoHideDuration: SUCCESS_NOTIFICATION_MS,
      })
      close()
    } catch (error) {
      setProcessing(false)
      notifyError(error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title={t("StageOrders.processResults")}
      confirmLabel={t("common:confirm")}
      closeLabel={t("common:close")}
      isConfirming={processing}
      onConfirm={() => void confirm()}
      onClose={close}
    >
      {processing ? (
        <ComputeProgress progress={progress} />
      ) : (
        <p className="m-0 text-sm text-neutral-600">{t("StageOrders.processResultsConfirm")}</p>
      )}
    </ConfirmDialog>
  )
}
