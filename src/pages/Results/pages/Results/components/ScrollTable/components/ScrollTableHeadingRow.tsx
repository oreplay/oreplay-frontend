import { ReactNode } from "react"
import { Box, TableCell, TableRow } from "@mui/material"
import { HEADING_ROW_CELL_SX, HEADING_ROW_CONTENT_SX } from "../shared/scrollTableRowStyles.ts"

type ScrollTableHeadingRowProps = {
  children: ReactNode
  columnCount: number
}

export default function ScrollTableHeadingRow({
  children,
  columnCount,
}: ScrollTableHeadingRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={columnCount} sx={HEADING_ROW_CELL_SX}>
        <Box sx={HEADING_ROW_CONTENT_SX}>{children}</Box>
      </TableCell>
    </TableRow>
  )
}
