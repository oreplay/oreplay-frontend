import { KeyboardEvent, useId } from "react"
import { tabIndexForKey } from "../../../../shared/resultTabs.ts"
import { segmentedSelectorOptionId } from "../../shared/segmentedSelector.ts"
import { ViewOption } from "../../shared/viewOption.ts"
import SegmentedSelectorOption from "./components/SegmentedSelectorOption.tsx"

interface SegmentedSelectorProps<Key extends string> {
  ariaLabel: string
  onChange: (key: Key) => void
  options: readonly ViewOption<Key>[]
  selectedKey: Key
  className?: string
}

/**
 * Switch between a few mutually exclusive choices, shown side by side in a single pill with the
 * selected one raised. It behaves as a radio group: the arrow, Home and End keys move the
 * selection. It has to be rendered inside a `.tw-root` element.
 *
 * @param props.ariaLabel Already translated name of the group for assistive technology.
 * @param props.onChange Called with the key of the choice the user picked.
 * @param props.options The choices on offer, in display order.
 * @param props.selectedKey Key of the choice currently picked.
 * @param props.className Extra classes for the group, such as a fixed height.
 */
export default function SegmentedSelector<Key extends string>({
  ariaLabel,
  onChange,
  options,
  selectedKey,
  className = "",
}: SegmentedSelectorProps<Key>) {
  const selectorId = useId()
  const selectedIndex = options.findIndex((option) => option.key === selectedKey)

  const selectFromKeyboard = (event: KeyboardEvent) => {
    const newIndex = tabIndexForKey(event.key, selectedIndex, options.length)
    if (newIndex === null) return

    event.preventDefault()
    const newKey = options[newIndex].key
    onChange(newKey)
    document.getElementById(segmentedSelectorOptionId(selectorId, newKey))?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`segmented-selector flex min-w-0 max-w-md flex-1 gap-1 rounded-lg bg-neutral-100 p-1 ${className}`}
    >
      {options.map((option) => (
        <SegmentedSelectorOption
          key={option.key}
          icon={option.icon}
          id={segmentedSelectorOptionId(selectorId, option.key)}
          isSelected={option.key === selectedKey}
          labelKey={option.labelKey}
          onKeyDown={selectFromKeyboard}
          onSelect={() => onChange(option.key)}
          shortLabelKey={option.shortLabelKey}
        />
      ))}
    </div>
  )
}
