import { useEffect, useRef } from "react"
import { AutocompleteListLayout } from "../../../../../shared/classSelector.ts"

interface AutocompleteListItemProps {
  name: string
  isSelected: boolean
  layout: AutocompleteListLayout
  onClick: () => void
}

const SCROLL_TO_CENTER: ScrollIntoViewOptions = { block: "center" }

const LAYOUT_CLASSES: Record<AutocompleteListLayout, string> = {
  grid: "justify-center px-2 text-center",
  list: "justify-between px-3 text-left",
}

const SELECTED_CLASSES = "bg-primary/[0.06] font-medium text-primary hover:bg-primary/10"

const UNSELECTED_CLASSES = "text-neutral-800 hover:bg-neutral-100"

export default function AutocompleteListItem(props: AutocompleteListItemProps) {
  const itemRef = useRef<HTMLLIElement>(null)
  const colorClass = props.isSelected ? SELECTED_CLASSES : UNSELECTED_CLASSES

  useEffect(() => {
    if (props.isSelected) itemRef.current?.scrollIntoView?.(SCROLL_TO_CENTER)
  }, [props.isSelected])

  return (
    <li ref={itemRef} className="autocomplete-list-item min-w-0">
      <button
        type="button"
        aria-current={props.isSelected}
        onClick={props.onClick}
        className={`flex w-full items-center gap-2 rounded py-2.5 text-[0.9375rem] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${LAYOUT_CLASSES[props.layout]} ${colorClass}`}
      >
        <span className="truncate">{props.name}</span>
      </button>
    </li>
  )
}
