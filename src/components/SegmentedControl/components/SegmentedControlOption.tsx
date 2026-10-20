import { KeyboardEvent, ReactElement } from "react"
import { useTranslation } from "react-i18next"
import { SegmentedControlMode, segmentedControlOptionAria } from "../shared/segmentedControl.ts"

interface SegmentedControlOptionProps {
  icon?: ReactElement
  id: string
  isSelected: boolean
  labelKey: string
  mode: SegmentedControlMode
  onKeyDown: (event: KeyboardEvent) => void
  onSelect: () => void
  panelId?: string
  shortLabelKey?: string
}

/**
 * One choice of a segmented control: an optional icon and a label that look raised while
 * selected. Its accessible name is always the full label, whichever one is on screen.
 *
 * @param props.icon Decorative icon shown before the label; none when left out.
 * @param props.id Element id, so the control can move the keyboard focus here.
 * @param props.isSelected Whether this is the choice currently picked.
 * @param props.labelKey Translation key of the label.
 * @param props.mode Whether the control picks a value or switches tab panels, which sets the role.
 * @param props.onKeyDown Called on a key press, so the control can handle the arrow keys.
 * @param props.onSelect Called when the user picks this choice.
 * @param props.panelId Id of the panel this choice shows; only used in `tabs` mode.
 * @param props.shortLabelKey Translation key of a shorter label shown on small screens instead of
 * the full one. Without it the full label is shown at every size.
 */
export default function SegmentedControlOption({
  icon,
  id,
  isSelected,
  labelKey,
  mode,
  onKeyDown,
  onSelect,
  panelId,
  shortLabelKey,
}: SegmentedControlOptionProps) {
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
      {...segmentedControlOptionAria(mode, isSelected, panelId)}
      id={id}
      aria-label={label}
      tabIndex={focusableIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={`segmented-control-option flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${colorClass}`}
    >
      {icon}
      {shortLabelKey && <span className="truncate sm:hidden">{t(shortLabelKey)}</span>}
      <span className={labelClass}>{label}</span>
    </button>
  )
}
