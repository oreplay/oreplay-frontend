import { ReactNode } from "react"
import { AutocompleteListLayout } from "../../../../../shared/classSelector.ts"

interface AutocompleteListItemsProps {
  children: ReactNode
  layout: AutocompleteListLayout
  className?: string
}

const LAYOUT_CLASSES: Record<AutocompleteListLayout, string> = {
  list: "flex-col gap-0.5 px-2",
  wrap: "flex-wrap content-start justify-between gap-1.5 px-4 after:flex-auto after:content-['']",
}

export default function AutocompleteListItems(props: AutocompleteListItemsProps) {
  return (
    <ul
      className={`autocomplete-list-items m-0 flex list-none py-0 ${LAYOUT_CLASSES[props.layout]} ${props.className ?? ""}`}
    >
      {props.children}
    </ul>
  )
}
