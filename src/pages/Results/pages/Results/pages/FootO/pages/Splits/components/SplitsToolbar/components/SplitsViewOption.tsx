import { KeyboardEvent, ReactElement } from "react"
import { useTranslation } from "react-i18next"
import { SplitsView, splitsViewOptionId } from "../../../shared/splitsViews.ts"

interface SplitsViewOptionProps {
  icon: ReactElement
  isSelected: boolean
  labelKey: string
  onKeyDown: (event: KeyboardEvent) => void
  onSelect: () => void
  view: SplitsView
}

export default function SplitsViewOption({
  icon,
  isSelected,
  labelKey,
  onKeyDown,
  onSelect,
  view,
}: SplitsViewOptionProps) {
  const { t } = useTranslation()
  const colorClass = isSelected
    ? "bg-white text-primary shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
    : "text-neutral-500 hover:text-neutral-800"
  const focusableIndex = isSelected ? 0 : -1

  return (
    <button
      type="button"
      role="radio"
      id={splitsViewOptionId(view)}
      aria-checked={isSelected}
      tabIndex={focusableIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={`splits-view-option flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${colorClass}`}
    >
      {icon}
      <span className="truncate">{t(labelKey)}</span>
    </button>
  )
}
