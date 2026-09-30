import { ReactNode } from "react"
import { AutocompleteListLayout } from "../../../../../shared/classSelector.ts"
import ListSkeleton from "../../../../../../../../../../../../../components/ListSkeleton/ListSkeleton.tsx"
import AutocompleteListEmpty from "./AutocompleteListEmpty.tsx"
import AutocompleteListItems from "./AutocompleteListItems.tsx"
import AutocompleteListSkeletonItem from "./AutocompleteListSkeletonItem.tsx"

interface AutocompleteListContainerProps {
  children: ReactNode
  isEmpty: boolean
  isLoading?: boolean
  layout: AutocompleteListLayout
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
    <AutocompleteListItems
      layout={props.layout}
      className="autocomplete-list-container min-h-0 flex-auto overflow-y-auto pb-3"
    >
      {props.children}
    </AutocompleteListItems>
  )
}
