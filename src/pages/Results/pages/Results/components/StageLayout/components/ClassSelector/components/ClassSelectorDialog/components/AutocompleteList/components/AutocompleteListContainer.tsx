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
  grid: "grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] content-start gap-1.5 px-4",
  list: "flex flex-col gap-0.5 px-2",
}

export default function AutocompleteListContainer(props: AutocompleteListContainerProps) {
  if (props.isLoading) {
    return <ListSkeleton SkeletonItem={AutocompleteListSkeletonItem} gap="4px" className="px-2" />
  }

  if (props.isEmpty) {
    return <AutocompleteListEmpty />
  }

  return (
    <ul
      className={`autocomplete-list-container m-0 min-h-0 flex-1 list-none overflow-y-auto pb-3 pt-0 ${LAYOUT_CLASSES[props.layout]}`}
    >
      {props.children}
    </ul>
  )
}
