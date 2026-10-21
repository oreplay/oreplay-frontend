import { ReactNode } from "react"
import { Box, TableCell } from "@mui/material"
import { HEADING_COLUMN_CELL_SX } from "../shared/scrollTableLayout.ts"

const CELL_SX = { border: "none", px: "8px", "&:first-of-type": { px: "16px" } }
const VISIBLE_CELL_SX = { ...CELL_SX, py: "10px" }
const HEADING_COLUMN_VISIBLE_CELL_SX = {
  ...VISIBLE_CELL_SX,
  ...HEADING_COLUMN_CELL_SX,
  backgroundColor: "white",
}
const WIDTH_SIZER_CELL_SX = { ...CELL_SX, height: 0, lineHeight: 0, py: 0 }
const WIDTH_SIZER_CONTENT_SX = { height: 0, overflow: "hidden" }

type ScrollTableHeaderCellProps = {
  children: ReactNode
  isHeadingColumn?: boolean
  isWidthSizer?: boolean
}

export default function ScrollTableHeaderCell({
  children,
  isHeadingColumn = false,
  isWidthSizer = false,
}: ScrollTableHeaderCellProps) {
  if (isWidthSizer) {
    return (
      <TableCell variant="head" sx={WIDTH_SIZER_CELL_SX}>
        <Box sx={WIDTH_SIZER_CONTENT_SX}>{children}</Box>
      </TableCell>
    )
  }

  const cellSx = isHeadingColumn ? HEADING_COLUMN_VISIBLE_CELL_SX : VISIBLE_CELL_SX

  return (
    <TableCell variant="head" sx={cellSx}>
      {children}
    </TableCell>
  )
}
