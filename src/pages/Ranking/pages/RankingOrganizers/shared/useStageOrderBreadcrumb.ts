import { useGetRankingSettings } from "../../../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import { useGetListStageOrders } from "../../../../../infrastructure/repositories/stage-orders/stage-orders.ts"
import { rankingSettingsPath } from "../../../../../shared/routes.ts"
import { BreadcrumbItem } from "../../../shared/breadcrumbs.ts"
import { RankingOrganizersParams } from "./useRankingOrganizers.ts"

export function useStageOrderBreadcrumb(params: RankingOrganizersParams) {
  const settings = useGetRankingSettings(params.rankingId ?? "")
  const stageOrders = useGetListStageOrders(params.eventId ?? "", params.stageId ?? "")

  const stageOrder = (stageOrders.data?.data ?? []).find((o) => o.id === params.stageOrderId)

  const rankingCrumb: BreadcrumbItem = {
    label: settings.data?.data?.title ?? params.rankingId ?? "",
    to: rankingSettingsPath(params.rankingId ?? ""),
  }

  return { rankingCrumb, stageOrderLabel: stageOrder?.description ?? "" }
}
