import { ReactNode } from "react"
import { AutocompleteListLayout } from "../../../../../shared/classSelector.ts"

interface AutocompleteListItemsProps {
  children: ReactNode
  layout: AutocompleteListLayout
  className?: string
}

const LAYOUT_CLASSES: Record<AutocompleteListLayout, string> = {
  list: "flex-col gap-0.5 px-2",
  wrap: "flex-wrap content-start gap-1.5 px-4",
}

/**
 * Lays out the selector items either as a vertical list or as rows of boxes that wrap; items that
 * grow fill every row, the last one included, edge to edge.
 * @param props.children The items to lay out.
 * @param props.layout `list` for one item per row, `wrap` for several items per row.
 * @param props.className Extra classes for the list element, such as scrolling or padding.
 */
export default function AutocompleteListItems(props: AutocompleteListItemsProps) {
  return (
    <ul
      className={`autocomplete-list-items m-0 flex list-none py-0 ${LAYOUT_CLASSES[props.layout]} ${props.className ?? ""}`}
    >
      {props.children}
    </ul>
  )
}
