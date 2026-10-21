import { Ref, RefObject } from "react"
import { Box, Table, TableContainer, TableHead, TableRow } from "@mui/material"
import { ROW_WITH_GUTTERS_SX } from "../shared/scrollTableLayout.ts"
import {
  ScrollTableColumnsProps,
  ScrollTableHeadingColumnProps,
} from "../shared/scrollTableProps.ts"
import ScrollTableColumns from "./ScrollTableColumns.tsx"
import ScrollTableHeaderCells from "./ScrollTableHeaderCells.tsx"
import ScrollTableScrollbar from "./ScrollTableScrollbar.tsx"

type ScrollTableHeaderProps<Column> = ScrollTableColumnsProps<Column> &
  ScrollTableHeadingColumnProps & {
    bodyScrollerRef: RefObject<HTMLElement | null>
    columnsRef: Ref<HTMLTableColElement>
    scrollerRef: Ref<HTMLDivElement>
    stickyTopPx: number
  }

export default function ScrollTableHeader<Column>({
  bodyScrollerRef,
  columns,
  columnsRef,
  getColumnKey,
  HeaderCellContent,
  headingColumnHeader,
  isHeadingColumn,
  scrollerRef,
  stickyTopPx,
}: ScrollTableHeaderProps<Column>) {
  const columnCount = isHeadingColumn ? columns.length + 1 : columns.length

  return (
    <Box sx={{ position: "sticky", top: `${stickyTopPx}px`, zIndex: 1 }}>
      <TableContainer component={Box} ref={scrollerRef} sx={{ scrollbarWidth: "none" }}>
        <Table size="small" sx={{ backgroundColor: "white", tableLayout: "fixed" }}>
          <ScrollTableColumns columnCount={columnCount} columnsRef={columnsRef} />
          <TableHead>
            <TableRow sx={ROW_WITH_GUTTERS_SX}>
              <ScrollTableHeaderCells
                columns={columns}
                getColumnKey={getColumnKey}
                HeaderCellContent={HeaderCellContent}
                headingColumnHeader={headingColumnHeader}
                isHeadingColumn={isHeadingColumn}
              />
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <ScrollTableScrollbar scrollerRef={bodyScrollerRef} />
    </Box>
  )
}
