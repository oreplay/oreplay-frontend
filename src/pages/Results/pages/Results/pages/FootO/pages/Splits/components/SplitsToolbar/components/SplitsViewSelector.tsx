import { useTranslation } from "react-i18next"
import SegmentedControl from "../../../../../../../../../../../components/SegmentedControl/SegmentedControl.tsx"
import { SegmentedControlOption } from "../../../../../../../../../../../components/SegmentedControl/shared/segmentedControl.ts"
import { SPLITS_TOOLBAR_CONTROL_HEIGHT_CLASS } from "../../../shared/splitsToolbarLayout.ts"
import { SPLITS_VIEW, SplitsView } from "../../../shared/splitsViews.ts"
import AccumulatedIcon from "./icons/AccumulatedIcon.tsx"
import RadiosIcon from "./icons/RadiosIcon.tsx"
import SplitsIcon from "./icons/SplitsIcon.tsx"

interface SplitsViewSelectorProps {
  onViewChange: (view: SplitsView) => void
  selectedView: SplitsView
  views: readonly SplitsView[]
}

const VIEW_OPTIONS: Record<SplitsView, SegmentedControlOption<SplitsView>> = {
  [SPLITS_VIEW.Accumulated]: {
    icon: <AccumulatedIcon />,
    key: SPLITS_VIEW.Accumulated,
    labelKey: "view.accumulated",
  },
  [SPLITS_VIEW.Radios]: { icon: <RadiosIcon />, key: SPLITS_VIEW.Radios, labelKey: "view.radios" },
  [SPLITS_VIEW.Splits]: { icon: <SplitsIcon />, key: SPLITS_VIEW.Splits, labelKey: "view.splits" },
}

/**
 * Switch between the views of the splits table.
 *
 * @param props.onViewChange Called with the view the user picked.
 * @param props.selectedView The view currently shown.
 * @param props.views The views on offer, in display order.
 */
export default function SplitsViewSelector({
  onViewChange,
  selectedView,
  views,
}: SplitsViewSelectorProps) {
  const { t } = useTranslation()
  const options = views.map((view) => VIEW_OPTIONS[view])

  return (
    <SegmentedControl
      ariaLabel={t("StageHeader.Splits")}
      onChange={onViewChange}
      options={options}
      selectedKey={selectedView}
      className={`max-w-md ${SPLITS_TOOLBAR_CONTROL_HEIGHT_CLASS}`}
    />
  )
}
