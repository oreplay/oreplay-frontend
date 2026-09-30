import { ReactNode } from "react"
import { AutocompleteListLayout } from "../../../../../shared/classSelector.ts"
import ListSkeleton from "../../../../../../../../../../../../../components/ListSkeleton/ListSkeleton.tsx"
import AutocompleteListEmpty from "./AutocompleteListEmpty.tsx"
import AutocompleteListSkeletonItem from "./AutocompleteListSkeletonItem.tsx"

interface AutocompleteListContainerProps {
  children: ReactNode
  isEmpty: boolean
  isLoading?: boolean
  layout: AutocompleteListLayout
}

const LAYOUT_CLASSES: Record<AutocompleteListLayout, string> = {
  list: "flex-col gap-0.5 px-2",
  wrap: "flex-wrap content-start justify-between gap-1.5 px-4 after:flex-auto after:content-['']",
}

const SKELETON_MIN_ITEMS = 8

export default function AutocompleteListContainer(props: AutocompleteListContainerProps) {
  if (props.isLoading) {
    return (
      <ListSkeleton
        SkeletonItem={AutocompleteListSkeletonItem}
        gap="4px"
        minItems={SKELETON_MIN_ITEMS}
        className="px-2"
      />
    )
  }

  if (props.isEmpty) {
    return <AutocompleteListEmpty />
  }

  return (
    <ul
      className={`autocomplete-list-container m-0 flex min-h-0 flex-auto list-none overflow-y-auto pb-3 pt-0 ${LAYOUT_CLASSES[props.layout]}`}
    >
      {props.children}
    </ul>
  )
}
