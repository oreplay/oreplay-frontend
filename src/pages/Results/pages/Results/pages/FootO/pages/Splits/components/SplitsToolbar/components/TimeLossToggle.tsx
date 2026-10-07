import { useTranslation } from "react-i18next"
import { SPLITS_TOOLBAR_CONTROL_HEIGHT_CLASS } from "../../../shared/splitsToolbarLayout.ts"
import TimeLossIcon from "./icons/TimeLossIcon.tsx"

const ON_CLASS = "border-primary text-primary hover:bg-primary/10"
const OFF_CLASS = "border-neutral-300 text-neutral-500 hover:text-neutral-800"
const DISABLED_CLASS = "cursor-not-allowed border-neutral-200 text-neutral-300"

interface TimeLossToggleProps {
  isDisabled: boolean
  isOn: boolean
  onToggle: () => void
}

export default function TimeLossToggle({ isDisabled, isOn, onToggle }: TimeLossToggleProps) {
  const { t } = useTranslation()
  const label = t("Graphs.TimeLossAnalysis")
  const isPressed = isOn && !isDisabled
  const enabledClass = isPressed ? ON_CLASS : OFF_CLASS
  const colorClass = isDisabled ? DISABLED_CLASS : enabledClass

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isPressed}
      disabled={isDisabled}
      title={label}
      onClick={onToggle}
      className={`time-loss-toggle flex shrink-0 items-center justify-center gap-1.5 rounded-lg border bg-white px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${SPLITS_TOOLBAR_CONTROL_HEIGHT_CLASS} ${colorClass}`}
    >
      <TimeLossIcon />
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}
