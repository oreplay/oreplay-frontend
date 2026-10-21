import { ReactNode } from "react"
import { Box, TableCell } from "@mui/material"
import {
  HEADING_COLUMN_BODY_CELL_SX,
  HEADING_COLUMN_CONTENT_SX,
} from "../shared/scrollTableRowStyles.ts"

type ScrollTableHeadingCellProps = {
  children: ReactNode
}

export default function ScrollTableHeadingCell({ children }: ScrollTableHeadingCellProps) {
  return (
    <TableCell sx={HEADING_COLUMN_BODY_CELL_SX}>
      <Box sx={HEADING_COLUMN_CONTENT_SX}>{children}</Box>
    </TableCell>
  )
}
