import { memo } from "react"
import { TableCell, TableRow } from "@mui/material"
import { ROW_WITH_GUTTERS_SX } from "../shared/scrollTableLayout.ts"
import { ScrollTableRowContentProps } from "../shared/scrollTableProps.ts"
import { CELL_SX } from "../shared/scrollTableRowStyles.ts"
import ScrollTableHeadingCell from "./ScrollTableHeadingCell.tsx"
import ScrollTableHeadingRow from "./ScrollTableHeadingRow.tsx"

type ScrollTableRowProps<Column, Row> = ScrollTableRowContentProps<Column, Row> & {
  isHeadingColumn: boolean
  row: Row
}

function ScrollTableRow<Column, Row>({
  CellContent,
  columns,
  getColumnKey,
  isHeadingColumn,
  row,
  RowHeading,
}: ScrollTableRowProps<Column, Row>) {
  const heading = <RowHeading row={row} />

  return (
    <>
      {!isHeadingColumn && (
        <ScrollTableHeadingRow columnCount={columns.length}>{heading}</ScrollTableHeadingRow>
      )}
      <TableRow sx={ROW_WITH_GUTTERS_SX}>
        {isHeadingColumn && <ScrollTableHeadingCell>{heading}</ScrollTableHeadingCell>}
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
