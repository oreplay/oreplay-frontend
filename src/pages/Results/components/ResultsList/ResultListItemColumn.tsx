import { Box, SxProps, Theme } from "@mui/material"
import { ReactNode } from "react"

interface ResultListItemSlotProps {
  box: SxProps<Theme>
}

interface ResultListItemProps {
  children?: ReactNode
  slotProps?: ResultListItemSlotProps
}

export default function ResultListItemColumn({ children, slotProps }: ResultListItemProps) {
  return <Box sx={{ padding: "12px 2px", ...slotProps?.box }}>{children}</Box>
}
