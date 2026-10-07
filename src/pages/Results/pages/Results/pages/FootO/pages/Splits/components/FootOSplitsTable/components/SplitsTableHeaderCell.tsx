import { ReactNode } from "react"
import { Box, TableCell } from "@mui/material"

const VISIBLE_CELL_SX = { py: "10px" }
const WIDTH_SIZER_CELL_SX = { height: 0, lineHeight: 0, py: 0 }
const WIDTH_SIZER_CONTENT_SX = { height: 0, overflow: "hidden" }

type SplitsTableHeaderCellProps = {
  children: ReactNode
  horizontalPadding: string
  isBold?: boolean
  isWidthSizer?: boolean
  noWrap?: boolean
}

export default function SplitsTableHeaderCell({
  children,
  horizontalPadding,
  isBold = false,
  isWidthSizer = false,
  noWrap = false,
}: SplitsTableHeaderCellProps) {
  const cellSx = {
    border: "none",
    fontWeight: isBold ? "bold" : undefined,
    px: horizontalPadding,
    whiteSpace: noWrap ? "nowrap" : undefined,
    ...(isWidthSizer ? WIDTH_SIZER_CELL_SX : VISIBLE_CELL_SX),
  }

  return (
    <TableCell variant="head" sx={cellSx}>
      {isWidthSizer ? <Box sx={WIDTH_SIZER_CONTENT_SX}>{children}</Box> : children}
    </TableCell>
  )
}
