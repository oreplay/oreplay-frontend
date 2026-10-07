import { KeyboardEvent, ReactElement } from "react"
import { useTranslation } from "react-i18next"
import { tabIndexForKey } from "../../../../../../../shared/resultTabs.ts"
import { SPLITS_TOOLBAR_CONTROL_HEIGHT_CLASS } from "../../../shared/splitsToolbarLayout.ts"
import { SplitsView, splitsViewOptionId } from "../../../shared/splitsViews.ts"
import AccumulatedIcon from "./icons/AccumulatedIcon.tsx"
import RadiosIcon from "./icons/RadiosIcon.tsx"
import SplitsIcon from "./icons/SplitsIcon.tsx"
import SplitsViewOption from "./SplitsViewOption.tsx"

interface SplitsViewSelectorProps {
  onViewChange: (view: SplitsView) => void
  selectedView: SplitsView
  views: readonly SplitsView[]
}

const VIEW_ICONS: Record<SplitsView, ReactElement> = {
  accumulated: <AccumulatedIcon />,
  radios: <RadiosIcon />,
  splits: <SplitsIcon />,
}

const VIEW_LABEL_KEYS: Record<SplitsView, string> = {
  accumulated: "view.accumulated",
  radios: "view.radios",
  splits: "view.splits",
}

export default function SplitsViewSelector({
  onViewChange,
  selectedView,
  views,
}: SplitsViewSelectorProps) {
  const { t } = useTranslation()

  const selectViewFromKeyboard = (event: KeyboardEvent) => {
    const newIndex = tabIndexForKey(event.key, views.indexOf(selectedView), views.length)
    if (newIndex === null) return

    event.preventDefault()
    const newView = views[newIndex]
    onViewChange(newView)
    document.getElementById(splitsViewOptionId(newView))?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={t("StageHeader.Splits")}
      className={`splits-view-selector flex min-w-0 max-w-md flex-1 gap-1 rounded-lg bg-neutral-100 p-1 ${SPLITS_TOOLBAR_CONTROL_HEIGHT_CLASS}`}
    >
      {views.map((view) => (
        <SplitsViewOption
          key={view}
          icon={VIEW_ICONS[view]}
          isSelected={view === selectedView}
          labelKey={VIEW_LABEL_KEYS[view]}
          onKeyDown={selectViewFromKeyboard}
          onSelect={() => onViewChange(view)}
          view={view}
        />
      ))}
    </div>
  )
}
