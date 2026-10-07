import { ReactNode } from "react"
import { Box, TableCell } from "@mui/material"

const CELL_SX = { border: "none", px: "8px", "&:first-of-type": { px: "16px" } }
const VISIBLE_CELL_SX = { ...CELL_SX, py: "10px" }
const WIDTH_SIZER_CELL_SX = { ...CELL_SX, height: 0, lineHeight: 0, py: 0 }
const WIDTH_SIZER_CONTENT_SX = { height: 0, overflow: "hidden" }

type ScrollTableHeaderCellProps = {
  children: ReactNode
  isWidthSizer?: boolean
}

export default function ScrollTableHeaderCell({
  children,
  isWidthSizer = false,
}: ScrollTableHeaderCellProps) {
  if (isWidthSizer) {
    return (
      <TableCell variant="head" sx={WIDTH_SIZER_CELL_SX}>
        <Box sx={WIDTH_SIZER_CONTENT_SX}>{children}</Box>
      </TableCell>
    )
  }

  return (
    <TableCell variant="head" sx={VISIBLE_CELL_SX}>
      {children}
    </TableCell>
  )
}
