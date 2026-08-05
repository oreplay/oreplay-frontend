import { useState } from "react"
import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog.tsx"
import EventStageSelect from "../../../components/EventStageSelect/EventStageSelect.tsx"
import { calculateRankingBatches } from "../shared/calculateRankingBatches.ts"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"

interface ProcessEventDialogProps {
  open: boolean
  onClose: () => void
  rankingId: string
}

export default function ProcessEventDialog({ open, onClose, rankingId }: ProcessEventDialogProps) {
  const { t } = useTranslationRanking()
  const notifyError = useNotifyError()
  const [eventId, setEventId] = useState<string | null>(null)
  const [stageId, setStageId] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const close = () => {
    setEventId(null)
    setStageId(null)
    setProcessing(false)
    onClose()
  }

  const confirm = async () => {
    if (eventId === null || stageId === null) return
    setProcessing(true)
    try {
      await calculateRankingBatches(rankingId, eventId, stageId)
      close()
    } catch (error) {
      setProcessing(false)
      notifyError(error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title={t("ProcessEvent.title")}
      confirmLabel={t("common:confirm")}
      closeLabel={t("common:close")}
      onConfirm={() => void confirm()}
      isConfirming={processing}
      onClose={close}
    >
      <EventStageSelect
        eventLabel={t("translation:Event")}
        stageLabel={t("ProcessEvent.stage")}
        eventId={eventId}
        stageId={stageId}
        onEventChange={setEventId}
        onStageChange={setStageId}
      />
    </ConfirmDialog>
  )
}
