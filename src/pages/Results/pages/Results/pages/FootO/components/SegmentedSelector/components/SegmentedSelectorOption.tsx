import { KeyboardEvent, ReactElement } from "react"
import { useTranslation } from "react-i18next"

interface SegmentedSelectorOptionProps {
  icon: ReactElement
  id: string
  isSelected: boolean
  labelKey: string
  onKeyDown: (event: KeyboardEvent) => void
  onSelect: () => void
  shortLabelKey?: string
}

/**
 * One choice of a segmented selector: an icon and a label that look raised while selected. Its
 * accessible name is always the full label, whichever one is on screen.
 *
 * @param props.icon Decorative icon shown before the label.
 * @param props.id Element id, so the selector can move the keyboard focus here.
 * @param props.isSelected Whether this is the choice currently picked.
 * @param props.labelKey Translation key of the label.
 * @param props.onKeyDown Called on a key press, so the selector can handle the arrow keys.
 * @param props.onSelect Called when the user picks this choice.
 * @param props.shortLabelKey Translation key of a shorter label shown on small screens instead of
 * the full one. Without it the full label is shown at every size.
 */
export default function SegmentedSelectorOption({
  icon,
  id,
  isSelected,
  labelKey,
  onKeyDown,
  onSelect,
  shortLabelKey,
}: SegmentedSelectorOptionProps) {
  const { t } = useTranslation()
  const colorClass = isSelected
    ? "bg-white text-primary shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
    : "text-neutral-500 hover:text-neutral-800"
  const focusableIndex = isSelected ? 0 : -1
  const label = t(labelKey)
  const labelClass = shortLabelKey ? "hidden truncate sm:inline" : "truncate"

  return (
    <button
      type="button"
      role="radio"
      id={id}
      aria-checked={isSelected}
      aria-label={label}
      tabIndex={focusableIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={`segmented-selector-option flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${colorClass}`}
    >
      {icon}
      {shortLabelKey && <span className="truncate sm:hidden">{t(shortLabelKey)}</span>}
      <span className={labelClass}>{label}</span>
    </button>
  )
}
