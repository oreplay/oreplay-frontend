import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import { StageOrderManagement } from "../../../../../../domain/types/v1api"
import Spinner from "../../../../components/Spinner/Spinner.tsx"
import StageOrderListItem from "./StageOrderListItem.tsx"

interface StageOrderListProps {
  isLoading: boolean
  isError: boolean
  stageOrders: StageOrderManagement[]
  onEdit: (stageOrder: StageOrderManagement) => void
  onManageOrganizers: (stageOrder: StageOrderManagement) => void
}

export default function StageOrderList({
  isLoading,
  isError,
  stageOrders,
  onEdit,
  onManageOrganizers,
}: StageOrderListProps) {
  const { t } = useTranslationRanking()

  if (isLoading) {
    return <Spinner label={t("common:loading")} />
  }

  if (isError) {
    return <p className="rk-stage-order-list text-red-600">{t("StageOrders.loadError")}</p>
  }

  if (stageOrders.length === 0) {
    return <p className="rk-stage-order-list text-neutral-500">{t("StageOrders.empty")}</p>
  }

  return (
    <ul className="rk-stage-order-list m-0 flex list-none flex-col gap-3 p-0">
      {stageOrders.map((stageOrder) => (
        <StageOrderListItem
          key={stageOrder.id}
          stageOrder={stageOrder}
          onEdit={onEdit}
          onManageOrganizers={onManageOrganizers}
        />
      ))}
    </ul>
  )
}
