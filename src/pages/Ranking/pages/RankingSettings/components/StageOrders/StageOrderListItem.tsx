import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import { StageOrderManagement } from "../../../../../../domain/types/v1api"
import DropdownMenu, {
  DropdownMenuItem,
} from "../../../../components/DropdownMenu/DropdownMenu.tsx"
import SettingsIcon from "../../../../pages/RankingList/components/icons/SettingsIcon.tsx"
import { formatStageOrderTitle } from "./shared/formatStageOrderTitle.ts"
import { formatStartDateTime } from "./shared/formatStartDateTime.ts"

interface StageOrderListItemProps {
  stageOrder: StageOrderManagement
  onEdit: (stageOrder: StageOrderManagement) => void
  onManageOrganizers: (stageOrder: StageOrderManagement) => void
  onProcessResults: (stageOrder: StageOrderManagement) => void
  onExport: (stageOrder: StageOrderManagement) => void
  onStats: (stageOrder: StageOrderManagement) => void
}

export default function StageOrderListItem({
  stageOrder,
  onEdit,
  onManageOrganizers,
  onProcessResults,
  onExport,
  onStats,
}: StageOrderListItemProps) {
  const { t, i18n } = useTranslationRanking()

  const hasSourceStage = Boolean(stageOrder.original_event_id && stageOrder.original_stage_id)

  const officialLabel = stageOrder.is_official
    ? t("StageOrders.official")
    : t("StageOrders.notOfficial")
  const title = formatStageOrderTitle(stageOrder.stage_order, stageOrder.description)
  const details = `${formatStartDateTime(stageOrder.start, i18n.language)} ${t(
    "StageOrders.isOfficial",
  )}: ${officialLabel}`

  const menuItems: DropdownMenuItem[] = [
    {
      label: t("common:edit"),
      onSelect: () => onEdit(stageOrder),
    },
    {
      label: t("StageOrders.manageOrganizers"),
      onSelect: () => onManageOrganizers(stageOrder),
    },
    {
      label: t("StageOrders.processResults"),
      onSelect: () => onProcessResults(stageOrder),
      disabled: !hasSourceStage,
    },
    {
      label: t("StageOrders.export"),
      onSelect: () => onExport(stageOrder),
      disabled: !hasSourceStage,
    },
    {
      label: t("StageOrders.stats"),
      onSelect: () => onStats(stageOrder),
      disabled: !hasSourceStage,
    },
  ]

  return (
    <li
      onClick={() => onManageOrganizers(stageOrder)}
      className="rk-stage-order-list-item flex cursor-pointer items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm transition-colors hover:bg-neutral-50"
    >
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-neutral-500">{details}</p>
      </div>
      <DropdownMenu
        triggerLabel={t("StageOrders.menuLabel")}
        trigger={<SettingsIcon />}
        items={menuItems}
      />
    </li>
  )
}
