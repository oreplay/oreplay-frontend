import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import { useNotifyError } from "../../../../../../infrastructure/notifications/useNotifyError.ts"
import { useDeleteStageOrders } from "../../../../../../infrastructure/repositories/stage-orders/stage-orders.ts"
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog.tsx"

interface DeleteStageOrderDialogProps {
  eventId: string
  stageId: string
  stageOrderId: string
  onClose: () => void
  onDeleted: () => void
}

export default function DeleteStageOrderDialog({
  eventId,
  stageId,
  stageOrderId,
  onClose,
  onDeleted,
}: DeleteStageOrderDialogProps) {
  const { t } = useTranslationRanking()
  const notifyError = useNotifyError()
  const deleteStageOrder = useDeleteStageOrders()

  const confirmDelete = async () => {
    try {
      await deleteStageOrder.mutateAsync({
        eventID: eventId,
        stageID: stageId,
        stageOrderID: stageOrderId,
      })
      onDeleted()
    } catch (error) {
      onClose()
      notifyError(error)
    }
  }

  return (
    <ConfirmDialog
      open
      title={t("StageOrders.deleteStage")}
      confirmLabel={t("common:delete")}
      closeLabel={t("common:close")}
      isConfirming={deleteStageOrder.isLoading}
      destructive
      onConfirm={() => void confirmDelete()}
      onClose={onClose}
    >
      <p className="m-0 text-sm text-neutral-600">{t("common:deleteConfirm")}</p>
    </ConfirmDialog>
  )
}
