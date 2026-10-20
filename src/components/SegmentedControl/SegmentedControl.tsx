import "../../styles/tokens.css"
import "../../styles/tailwind.css"
import { KeyboardEvent, useId } from "react"
import { tabIndexForKey } from "../../shared/tabIndexForKey.ts"
import SegmentedControlOptionButton from "./components/SegmentedControlOption.tsx"
import {
  SEGMENTED_CONTROL_MODE,
  SegmentedControlMode,
  SegmentedControlOption,
  segmentedControlOptionId,
  segmentedControlRole,
} from "./shared/segmentedControl.ts"

interface SegmentedControlProps<Key extends string> {
  ariaLabel: string
  onChange: (key: Key) => void
  options: readonly SegmentedControlOption<Key>[]
  selectedKey: Key
  mode?: SegmentedControlMode
  optionId?: (key: Key) => string
  panelId?: (key: Key) => string
  className?: string
}

/**
 * Switch between a few mutually exclusive choices, shown side by side in a single pill with the
 * selected one raised. In `radio` mode it picks a value; in `tabs` mode every choice shows its own
 * panel. Either way the arrow, Home and End keys move the selection. It has to be rendered inside
 * a `.tw-root` element.
 *
 * @param props.ariaLabel Already translated name of the group for assistive technology.
 * @param props.onChange Called with the key of the choice the user picked.
 * @param props.options The choices on offer, in display order.
 * @param props.selectedKey Key of the choice currently picked.
 * @param props.mode `radio` (default) to pick a value, `tabs` to switch panels.
 * @param props.optionId Element id of a choice, for a panel to point back at its tab. Without it
 * the control makes up ids of its own.
 * @param props.panelId Element id of the panel a choice shows; only used in `tabs` mode.
 * @param props.className Extra classes for the group, such as a fixed height.
 */
export default function SegmentedControl<Key extends string>({
  ariaLabel,
  onChange,
  options,
  selectedKey,
  mode = SEGMENTED_CONTROL_MODE.Radio,
  optionId,
  panelId,
  className = "",
}: SegmentedControlProps<Key>) {
  const controlId = useId()
  const selectedIndex = options.findIndex((option) => option.key === selectedKey)
  const idOf = (key: Key) => optionId?.(key) ?? segmentedControlOptionId(controlId, key)

  const selectFromKeyboard = (event: KeyboardEvent) => {
    const newIndex = tabIndexForKey(event.key, selectedIndex, options.length)
    if (newIndex === null) return

    event.preventDefault()
    const newKey = options[newIndex].key
    onChange(newKey)
    document.getElementById(idOf(newKey))?.focus()
  }

  return (
    <div
      role={segmentedControlRole(mode)}
      aria-label={ariaLabel}
      className={`segmented-control flex min-w-0 flex-1 gap-1 rounded-lg bg-neutral-100 p-1 ${className}`}
    >
      {options.map((option) => (
        <SegmentedControlOptionButton
          key={option.key}
          icon={option.icon}
          id={idOf(option.key)}
          isSelected={option.key === selectedKey}
          labelKey={option.labelKey}
          mode={mode}
          onKeyDown={selectFromKeyboard}
          onSelect={() => onChange(option.key)}
          panelId={panelId?.(option.key)}
          shortLabelKey={option.shortLabelKey}
        />
      ))}
    </div>
  )
}
