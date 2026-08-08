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
import ExportResultsDialog from "../../../../components/ExportResults/ExportResultsDialog.tsx"
import StageOrderFormDialog from "./StageOrderFormDialog.tsx"
import StageOrderList from "./StageOrderList.tsx"
import ProcessResultsDialog from "./ProcessResultsDialog.tsx"
import { StageOrderDialogMode } from "./shared/stageOrderForm.ts"

interface StageOrdersCardProps {
  eventId: string
  stageId: string
}

interface DialogState {
  mode: StageOrderDialogMode
  stageOrder?: StageOrderManagement
}

export default function StageOrdersCard({ eventId, stageId }: StageOrdersCardProps) {
  const { t } = useTranslationRanking()
  const navigate = useNavigate()
  const { rankingId } = useParams()
  const queryClient = useQueryClient()
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [processStageOrder, setProcessStageOrder] = useState<StageOrderManagement | null>(null)
  const [exportStageOrder, setExportStageOrder] = useState<StageOrderManagement | null>(null)
  const { data, isLoading, isError } = useGetListStageOrders(eventId, stageId)

  const stageOrders = data?.data ?? []

  const manageOrganizers = (stageOrder: StageOrderManagement) =>
    void navigate(rankingOrganizersPath(rankingId ?? "", eventId, stageId, stageOrder.id))

  const closeDialog = () => setDialog(null)
  const handleSaved = () => {
    void queryClient.invalidateQueries(getGetListStageOrdersQueryKey(eventId, stageId))
    closeDialog()
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
        onEdit={(stageOrder) => setDialog({ mode: "edit", stageOrder })}
        onManageOrganizers={manageOrganizers}
        onProcessResults={setProcessStageOrder}
        onExport={setExportStageOrder}
      />
      {dialog && (
        <StageOrderFormDialog
          open
          mode={dialog.mode}
          stageOrder={dialog.stageOrder}
          defaultStageOrder={stageOrders.length + 1}
          eventId={eventId}
          stageId={stageId}
          onClose={closeDialog}
          onSaved={handleSaved}
        />
      )}
      {processStageOrder && (
        <ProcessResultsDialog
          open
          rankingId={rankingId ?? ""}
          eventId={processStageOrder.original_event_id}
          stageId={processStageOrder.original_stage_id}
          onClose={() => setProcessStageOrder(null)}
        />
      )}
      {exportStageOrder && (
        <ExportResultsDialog
          open
          eventId={exportStageOrder.original_event_id}
          stageId={exportStageOrder.original_stage_id}
          onClose={() => setExportStageOrder(null)}
        />
      )}
    </div>
  )
}
