import { ReactNode } from "react"
import { List } from "@mui/material"

export default function AutocompleteListContainer({ children }: { children: ReactNode }) {
  return <List sx={{ padding: 0 }}>{children}</List>
}
