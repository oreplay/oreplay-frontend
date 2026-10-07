import "../../../../../../../../../../styles/tokens.css"
import "../../../../../../../../../../styles/tailwind.css"
import { SPLITS_TOOLBAR_HEIGHT_PX } from "../../shared/splitsToolbarLayout.ts"
import { SplitsView } from "../../shared/splitsViews.ts"
import SplitsViewSelector from "./components/SplitsViewSelector.tsx"
import TimeLossToggle from "./components/TimeLossToggle.tsx"

interface SplitsToolbarProps {
  isTimeLossAvailable: boolean
  isTimeLossOn: boolean
  onTimeLossToggle: () => void
  onViewChange: (view: SplitsView) => void
  selectedView: SplitsView
  stickyTopPx: number
  views: readonly SplitsView[]
}

/**
 * Bar above the splits table that picks what the table shows. It sticks to the top of the page so
 * it stays reachable while the table is scrolled, with the table header sticking right below it.
 *
 * @param props.isTimeLossAvailable Whether the selected view can show the time loss analysis.
 * @param props.isTimeLossOn Whether the user switched the time loss analysis on.
 * @param props.onTimeLossToggle Called when the user flips the time loss analysis.
 * @param props.onViewChange Called with the view the user picked.
 * @param props.selectedView The view currently shown.
 * @param props.stickyTopPx Distance from the top of the page at which the bar sticks, in pixels.
 * @param props.views The views on offer, in display order.
 */
export default function SplitsToolbar({
  isTimeLossAvailable,
  isTimeLossOn,
  onTimeLossToggle,
  onViewChange,
  selectedView,
  stickyTopPx,
  views,
}: SplitsToolbarProps) {
  const toolbarStyle = { height: SPLITS_TOOLBAR_HEIGHT_PX, top: stickyTopPx }

  return (
    <div
      style={toolbarStyle}
      className="splits-toolbar tw-root sticky z-[2] box-border flex items-center gap-2 border-b border-neutral-200 bg-white px-4 font-sans"
    >
      <SplitsViewSelector onViewChange={onViewChange} selectedView={selectedView} views={views} />
      <TimeLossToggle
        isDisabled={!isTimeLossAvailable}
        isOn={isTimeLossOn}
        onToggle={onTimeLossToggle}
      />
    </div>
  )
}
