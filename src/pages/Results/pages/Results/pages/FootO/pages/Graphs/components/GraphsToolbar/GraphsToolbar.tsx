import "../../../../../../../../../../styles/tokens.css"
import "../../../../../../../../../../styles/tailwind.css"
import { ReactElement } from "react"
import { useTranslation } from "react-i18next"
import SegmentedSelector from "../../../../components/SegmentedSelector/SegmentedSelector.tsx"
import { ViewOption } from "../../../../shared/viewOption.ts"
import {
  GRAPH_VIEW,
  GRAPH_VIEW_LABEL_KEY,
  GRAPH_VIEW_ORDER,
  GRAPH_VIEW_SHORT_LABEL_KEY,
  GraphView,
} from "../../shared/graphViews.ts"
import GraphsToolbarCaption from "./components/GraphsToolbarCaption.tsx"
import BehindLeaderIcon from "./components/icons/BehindLeaderIcon.tsx"
import BehindPerfectRunnerIcon from "./components/icons/BehindPerfectRunnerIcon.tsx"
import PositionIcon from "./components/icons/PositionIcon.tsx"

interface GraphsToolbarProps {
  onViewChange: (view: GraphView) => void
  selectedView: GraphView
  stickyTopPx: number
}

const GRAPH_VIEW_ICONS: Record<GraphView, ReactElement> = {
  [GRAPH_VIEW.LineChart]: <BehindLeaderIcon />,
  [GRAPH_VIEW.PerfectRunnerChart]: <BehindPerfectRunnerIcon />,
  [GRAPH_VIEW.PositionChart]: <PositionIcon />,
}

const GRAPH_VIEW_OPTIONS: readonly ViewOption<GraphView>[] = GRAPH_VIEW_ORDER.map((view) => ({
  icon: GRAPH_VIEW_ICONS[view],
  key: view,
  labelKey: GRAPH_VIEW_LABEL_KEY[view],
  shortLabelKey: GRAPH_VIEW_SHORT_LABEL_KEY[view],
}))

/**
 * Bar above the graphs that picks which graph is shown. It sticks to the top of the page so it
 * stays reachable while the graph and the runner list are scrolled. On small screens the selector
 * uses one-word labels, so the full name of the graph shown is written right below it. An info icon
 * explains the graph at every size.
 *
 * @param props.onViewChange Called with the graph the user picked.
 * @param props.selectedView The graph currently shown.
 * @param props.stickyTopPx Distance from the top of the page at which the bar sticks, in pixels.
 */
export default function GraphsToolbar({
  onViewChange,
  selectedView,
  stickyTopPx,
}: GraphsToolbarProps) {
  const { t } = useTranslation()
  const toolbarStyle = { top: stickyTopPx }

  return (
    <div
      style={toolbarStyle}
      className="graphs-toolbar tw-root sticky z-[2] flex flex-col gap-2 bg-white px-4 py-2 font-sans sm:flex-row sm:items-center"
    >
      <SegmentedSelector
        ariaLabel={t("StageHeader.Graphs")}
        onChange={onViewChange}
        options={GRAPH_VIEW_OPTIONS}
        selectedKey={selectedView}
      />
      <GraphsToolbarCaption view={selectedView} />
    </div>
  )
}
