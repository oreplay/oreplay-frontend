import "../../../../../../../../../../styles/tokens.css"
import "../../../../../../../../../../styles/tailwind.css"
import { SplitsView } from "../../shared/splitsViews.ts"
import SplitsViewSelector from "./components/SplitsViewSelector.tsx"
import TimeLossToggle from "./components/TimeLossToggle.tsx"

interface SplitsToolbarProps {
  isTimeLossAvailable: boolean
  isTimeLossOn: boolean
  onTimeLossToggle: () => void
  onViewChange: (view: SplitsView) => void
  selectedView: SplitsView
  views: readonly SplitsView[]
}

export default function SplitsToolbar({
  isTimeLossAvailable,
  isTimeLossOn,
  onTimeLossToggle,
  onViewChange,
  selectedView,
  views,
}: SplitsToolbarProps) {
  return (
    <div className="splits-toolbar tw-root flex items-center gap-2 border-b border-neutral-200 bg-white px-4 pb-4 font-sans">
      <SplitsViewSelector onViewChange={onViewChange} selectedView={selectedView} views={views} />
      <TimeLossToggle
        isDisabled={!isTimeLossAvailable}
        isOn={isTimeLossOn}
        onToggle={onTimeLossToggle}
      />
    </div>
  )
}
