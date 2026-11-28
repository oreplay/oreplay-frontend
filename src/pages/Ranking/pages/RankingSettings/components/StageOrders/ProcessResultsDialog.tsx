import { useState } from "react"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import { useNotifyError } from "../../../../../../infrastructure/notifications/useNotifyError.ts"
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog.tsx"
import ComputeProgress from "../../../../components/ComputeProgress.tsx"
import Spinner from "../../../../components/Spinner/Spinner.tsx"
import { calculateRankingBatches } from "./shared/calculateRankingBatches.ts"
import { Progress } from "../../../../shared/progress.ts"
import ProcessResultsWarningList from "./ProcessResultsWarningList.tsx"
import {
  areWarningsAcknowledged,
  ProcessResultsWarningId,
} from "./shared/processResultsWarnings.ts"
import { useProcessResultsWarnings } from "./shared/useProcessResultsWarnings.ts"

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
  const [acknowledgedIds, setAcknowledgedIds] = useState<ProcessResultsWarningId[]>([])
  const { warnings, isLoading } = useProcessResultsWarnings(rankingId, eventId, stageId)

  const toggleAcknowledged = (id: ProcessResultsWarningId) =>
    setAcknowledgedIds((current) =>
      current.includes(id) ? current.filter((each) => each !== id) : [...current, id],
    )

  const close = () => {
    setProcessing(false)
    setProgress(null)
    setAcknowledgedIds([])
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
      confirmDisabled={isLoading || !areWarningsAcknowledged(warnings, acknowledgedIds)}
      onConfirm={() => void confirm()}
      onClose={close}
    >
      {processing ? (
        <ComputeProgress progress={progress} />
      ) : (
        <div className="flex flex-col gap-4">
          <p className="m-0 text-sm text-neutral-600">{t("StageOrders.processResultsConfirm")}</p>
          {isLoading ? (
            <Spinner label={t("common:loading")} />
          ) : (
            <ProcessResultsWarningList
              warnings={warnings}
              acknowledgedIds={acknowledgedIds}
              onToggle={toggleAcknowledged}
            />
          )}
        </div>
      )}
    </ConfirmDialog>
  )
}
