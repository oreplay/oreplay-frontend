import { useEffect, useRef } from "react"
import { AutocompleteListLayout } from "../../../../../shared/classSelector.ts"

interface AutocompleteListItemProps {
  name: string
  isSelected: boolean
  layout: AutocompleteListLayout
  onClick: () => void
  scrollIntoViewWhenSelected: boolean
}

const SCROLL_TO_CENTER: ScrollIntoViewOptions = { block: "center" }

const ITEM_LAYOUT_CLASSES: Record<AutocompleteListLayout, string> = {
  list: "w-full",
  wrap: "min-w-0 max-w-full",
}

const BUTTON_LAYOUT_CLASSES: Record<AutocompleteListLayout, string> = {
  list: "w-full justify-start text-left",
  wrap: "min-w-[3.5rem] max-w-full justify-center text-center",
}

const SELECTED_CLASSES = "bg-primary/[0.06] font-medium text-primary hover:bg-primary/10"

const UNSELECTED_CLASSES = "text-neutral-800 hover:bg-neutral-100"

export default function AutocompleteListItem(props: AutocompleteListItemProps) {
  const itemRef = useRef<HTMLLIElement>(null)
  const colorClass = props.isSelected ? SELECTED_CLASSES : UNSELECTED_CLASSES

  const shouldScrollIntoView = props.isSelected && props.scrollIntoViewWhenSelected

  useEffect(() => {
    if (shouldScrollIntoView) itemRef.current?.scrollIntoView?.(SCROLL_TO_CENTER)
  }, [shouldScrollIntoView])

  return (
    <li ref={itemRef} className={`autocomplete-list-item ${ITEM_LAYOUT_CLASSES[props.layout]}`}>
      <button
        type="button"
        aria-current={props.isSelected}
        onClick={props.onClick}
        className={`flex items-center rounded px-3 py-2.5 text-[0.9375rem] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${BUTTON_LAYOUT_CLASSES[props.layout]} ${colorClass}`}
      >
        <span className="truncate">{props.name}</span>
      </button>
    </li>
  )
}
