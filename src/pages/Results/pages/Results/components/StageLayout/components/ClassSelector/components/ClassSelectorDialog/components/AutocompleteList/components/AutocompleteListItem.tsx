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
  wrap: "min-w-0 max-w-full flex-auto",
}

const BUTTON_LAYOUT_CLASSES: Record<AutocompleteListLayout, string> = {
  list: "w-full justify-start rounded-sm text-left",
  wrap: "w-full min-w-[3.5rem] justify-center rounded-lg border text-center",
}

const SELECTED_CLASSES =
  "border-primary/40 bg-primary/[0.06] font-medium text-primary hover:bg-primary/10"

const UNSELECTED_CLASSES = "border-neutral-200 text-neutral-800 hover:bg-neutral-100"

/**
 * Renders one selectable class or club in the selector list. In the wrap layout the item grows to
 * fill its row and is drawn as a bordered box, so the whole box is a visible tap target.
 * @param props.name Label shown for the item.
 * @param props.isSelected Whether the item is the current selection; it is highlighted when true.
 * @param props.layout `list` for full-width rows, `wrap` for bordered boxes flowing in rows.
 * @param props.onClick Called when the item is pressed.
 * @param props.scrollIntoViewWhenSelected Whether a selected item scrolls itself to the centre.
 */
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
        className={`flex items-center px-3 py-2.5 text-[0.9375rem] transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 ${BUTTON_LAYOUT_CLASSES[props.layout]} ${colorClass}`}
      >
        <span className="truncate py-1 [text-box:trim-both_cap_alphabetic]">{props.name}</span>
      </button>
    </li>
  )
}
