import { Ref } from "react"
import { Box, Table, TableBody, TableContainer } from "@mui/material"
import { HEADING_COLUMN_TABLE_SX } from "../shared/scrollTableLayout.ts"
import { ScrollTableHeadingColumnProps, ScrollTableProps } from "../shared/scrollTableProps.ts"
import ScrollTableRow from "./ScrollTableRow.tsx"
import ScrollTableWidthSizerRow from "./ScrollTableWidthSizerRow.tsx"

type ScrollTableBodyProps<Column, Row> = ScrollTableProps<Column, Row> &
  ScrollTableHeadingColumnProps & {
    scrollerRef: Ref<HTMLDivElement>
    widthSizerRowRef: Ref<HTMLTableRowElement>
  }

export default function ScrollTableBody<Column, Row>({
  CellContent,
  columns,
  getColumnKey,
  getRowKey,
  HeaderCellContent,
  headingColumnHeader,
  isHeadingColumn,
  RowHeading,
  rows,
  scrollerRef,
  widthSizerRowRef,
}: ScrollTableBodyProps<Column, Row>) {
  const tableSx = isHeadingColumn ? HEADING_COLUMN_TABLE_SX : undefined

  return (
    <TableContainer
      component={Box}
      ref={scrollerRef}
      sx={{ scrollbarWidth: "none", paddingBottom: "16px" }}
    >
      <Table size="small" sx={tableSx}>
        <TableBody>
          <ScrollTableWidthSizerRow
            columns={columns}
            getColumnKey={getColumnKey}
            HeaderCellContent={HeaderCellContent}
            headingColumnHeader={headingColumnHeader}
            isHeadingColumn={isHeadingColumn}
            rowRef={widthSizerRowRef}
          />
          {rows.map((row) => (
            <ScrollTableRow
              key={getRowKey(row)}
              CellContent={CellContent}
              columns={columns}
              getColumnKey={getColumnKey}
              isHeadingColumn={isHeadingColumn}
              row={row}
              RowHeading={RowHeading}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
