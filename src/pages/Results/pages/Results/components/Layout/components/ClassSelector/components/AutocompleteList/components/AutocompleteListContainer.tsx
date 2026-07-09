import { ReactNode } from "react"
import { List } from "@mui/material"
import AutocompleteListSkeletonItem from "./AutocompleteListSkeletonItem.tsx"
import ListSkeleton from "../../../../../../../../../../../components/ListSkeleton/ListSkeleton.tsx"

export default function AutocompleteListContainer({
  children,
  isLoading,
}: {
  children: ReactNode
  isLoading?: boolean
}) {
  if (isLoading) {
    return <ListSkeleton SkeletonItem={AutocompleteListSkeletonItem} gap={"8px"} />
  } else {
    return <List sx={{ padding: 0, flexGrow: 1 }}>{children}</List>
  }
}
