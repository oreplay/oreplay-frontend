import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQueryClient } from "react-query"
import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import { rankingOrganizersPath } from "../../../../../../shared/routes.ts"
import AddButton from "../../../../components/AddButton.tsx"
import {
  getGetListStageOrdersQueryKey,
  useGetListStageOrders,
} from "../../../../../../infrastructure/repositories/stage-orders/stage-orders.ts"
import { StageOrderManagement } from "../../../../../../domain/types/v1api"
import StageOrderFormDialog from "./StageOrderFormDialog.tsx"
import StageOrderList from "./StageOrderList.tsx"
import SourceStageActionDialog from "./SourceStageActionDialog.tsx"
import DeleteStageOrderDialog from "./DeleteStageOrderDialog.tsx"
import { nextStageOrderNumber, StageOrderDialogMode } from "./shared/stageOrderForm.ts"
import {
  isSourceStageAction,
  SourceStageAction,
  StageOrderAction,
} from "./shared/stageOrderActions.ts"

interface StageOrdersCardProps {
  eventId: string
  stageId: string
}

interface DialogState {
  mode: StageOrderDialogMode
  stageOrder?: StageOrderManagement
}

interface SourceStageActionTarget {
  action: SourceStageAction
  stageOrder: StageOrderManagement
}

export default function StageOrdersCard({ eventId, stageId }: StageOrdersCardProps) {
  const { t } = useTranslationRanking()
  const navigate = useNavigate()
  const { rankingId } = useParams()
  const queryClient = useQueryClient()
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [actionTarget, setActionTarget] = useState<SourceStageActionTarget | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StageOrderManagement | null>(null)
  const { data, isLoading, isError } = useGetListStageOrders(eventId, stageId)

  const stageOrders = data?.data ?? []

  const handleAction = (action: StageOrderAction, stageOrder: StageOrderManagement) => {
    if (action === "edit") {
      setDialog({ mode: "edit", stageOrder })
    } else if (action === "organizers") {
      void navigate(rankingOrganizersPath(rankingId ?? "", eventId, stageId, stageOrder.id))
    } else if (action === "delete") {
      setDeleteTarget(stageOrder)
    } else if (isSourceStageAction(action)) {
      setActionTarget({ action, stageOrder })
    }
  }

  const closeDialog = () => setDialog(null)
  const refreshStageOrders = () =>
    void queryClient.invalidateQueries(getGetListStageOrdersQueryKey(eventId, stageId))
  const handleSaved = () => {
    refreshStageOrders()
    closeDialog()
  }
  const closeDeleteDialog = () => setDeleteTarget(null)
  const handleDeleted = () => {
    refreshStageOrders()
    closeDeleteDialog()
  }

  return (
    <div className="rk-stage-orders-card rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="m-0 text-lg font-semibold text-neutral-900">{t("StageOrders.title")}</h2>
        <AddButton onClick={() => setDialog({ mode: "create" })} />
      </div>
      <StageOrderList
        isLoading={isLoading}
        isError={isError}
        stageOrders={stageOrders}
        onAction={handleAction}
      />
      {dialog && (
        <StageOrderFormDialog
          open
          mode={dialog.mode}
          stageOrder={dialog.stageOrder}
          defaultStageOrder={nextStageOrderNumber(stageOrders)}
          eventId={eventId}
          stageId={stageId}
          onClose={closeDialog}
          onSaved={handleSaved}
        />
      )}
      {actionTarget && (
        <SourceStageActionDialog
          action={actionTarget.action}
          rankingId={rankingId ?? ""}
          eventId={actionTarget.stageOrder.original_event_id}
          stageId={actionTarget.stageOrder.original_stage_id}
          onClose={() => setActionTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteStageOrderDialog
          eventId={eventId}
          stageId={stageId}
          stageOrderId={deleteTarget.id}
          onClose={closeDeleteDialog}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
}
