import { ListItemButton, ListItemText } from "@mui/material"

interface AutocompleteListItemProps {
  name: string
  onClick?: () => void
}

export default function AutocompleteListItem({ name, onClick }: AutocompleteListItemProps) {
  return (
    <ListItemButton onClick={onClick}>
      <ListItemText>{name}</ListItemText>
    </ListItemButton>
  )
}
