import { memo } from "react"
import { Box, TableCell, TableRow } from "@mui/material"
import { ROW_WITH_GUTTERS_SX } from "../shared/scrollTableLayout.ts"
import { ScrollTableRowContentProps } from "../shared/scrollTableProps.ts"

const CELL_BACKGROUND_COLOR = "#F6F6F6"
const TOP_SHADE = "linear-gradient(180deg, #00000008 0%, #F6F6F6FF 10%)"
const LEFT_SHADE = "linear-gradient(90deg, #00000008 0%, #F6F6F6FF 10%)"

const HEADING_CELL_SX = {
  border: "none",
  backgroundColor: "white",
  fontWeight: "bold",
  padding: "16px 16px calc(16px + 2rem) 16px",
}
const HEADING_CONTENT_SX = { display: "inline-flex", position: "absolute", pointerEvents: "none" }
const CELL_SX = {
  py: "12px",
  px: "8px",
  background: TOP_SHADE,
  backgroundColor: CELL_BACKGROUND_COLOR,
  border: "none",
  "&:first-of-type": {
    px: "16px",
    background: `${TOP_SHADE}, ${LEFT_SHADE}`,
    backgroundBlendMode: "darken",
    backgroundColor: CELL_BACKGROUND_COLOR,
    borderRadius: "6px 0 0 6px",
  },
  "&:last-of-type": { borderRadius: "0 6px 6px 0" },
  "&:first-of-type:last-of-type": { borderRadius: "6px" },
}

type ScrollTableRowProps<Column, Row> = ScrollTableRowContentProps<Column, Row> & {
  row: Row
}

function ScrollTableRow<Column, Row>({
  CellContent,
  columns,
  getColumnKey,
  row,
  RowHeading,
}: ScrollTableRowProps<Column, Row>) {
  return (
    <>
      <TableRow>
        <TableCell colSpan={columns.length} sx={HEADING_CELL_SX}>
          <Box sx={HEADING_CONTENT_SX}>
            <RowHeading row={row} />
          </Box>
        </TableCell>
      </TableRow>
      <TableRow sx={ROW_WITH_GUTTERS_SX}>
        {columns.map((column) => (
          <TableCell key={getColumnKey(column)} sx={CELL_SX}>
            <CellContent column={column} row={row} />
          </TableCell>
        ))}
      </TableRow>
    </>
  )
}

export default memo(ScrollTableRow) as typeof ScrollTableRow
