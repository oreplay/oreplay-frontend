import { Ref } from "react"
import { Box, Table, TableBody, TableContainer } from "@mui/material"
import { ScrollTableProps } from "../shared/scrollTableProps.ts"
import ScrollTableRow from "./ScrollTableRow.tsx"
import ScrollTableWidthSizerRow from "./ScrollTableWidthSizerRow.tsx"

type ScrollTableBodyProps<Column, Row> = ScrollTableProps<Column, Row> & {
  scrollerRef: Ref<HTMLDivElement>
  widthSizerRowRef: Ref<HTMLTableRowElement>
}

export default function ScrollTableBody<Column, Row>({
  CellContent,
  columns,
  getColumnKey,
  getRowKey,
  HeaderCellContent,
  RowHeading,
  rows,
  scrollerRef,
  widthSizerRowRef,
}: ScrollTableBodyProps<Column, Row>) {
  return (
    <TableContainer
      component={Box}
      ref={scrollerRef}
      sx={{ scrollbarWidth: "none", paddingBottom: "16px" }}
    >
      <Table size="small">
        <TableBody>
          <ScrollTableWidthSizerRow
            columns={columns}
            getColumnKey={getColumnKey}
            HeaderCellContent={HeaderCellContent}
            rowRef={widthSizerRowRef}
          />
          {rows.map((row) => (
            <ScrollTableRow
              key={getRowKey(row)}
              CellContent={CellContent}
              columns={columns}
              getColumnKey={getColumnKey}
              row={row}
              RowHeading={RowHeading}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
