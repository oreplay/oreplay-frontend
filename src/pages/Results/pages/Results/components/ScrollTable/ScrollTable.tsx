import { memo } from "react"
import { ScrollTableProps } from "./shared/scrollTableProps.ts"
import useColumnWidthSync from "./shared/useColumnWidthSync.ts"
import useIsHeadingColumn from "./shared/useIsHeadingColumn.ts"
import useSyncedHorizontalScroll from "../../shared/horizontalScroll/useSyncedHorizontalScroll.ts"
import ScrollTableBody from "./components/ScrollTableBody.tsx"
import ScrollTableHeader from "./components/ScrollTableHeader.tsx"

function ScrollTable<Column, Row>({
  CellContent,
  columns,
  getColumnKey,
  getRowKey,
  HeaderCellContent,
  headerStickyTopPx = 0,
  headingColumnHeader,
  RowHeading,
  rows,
}: ScrollTableProps<Column, Row>) {
  const isHeadingColumn = useIsHeadingColumn(headingColumnHeader)
  const scrollers = useSyncedHorizontalScroll<HTMLDivElement, HTMLDivElement>()
  const columnWidths = useColumnWidthSync<HTMLTableRowElement, HTMLTableColElement>(
    columns,
    isHeadingColumn,
  )

  return (
    <>
      <ScrollTableHeader
        bodyScrollerRef={scrollers.secondScrollerRef}
        columns={columns}
        columnsRef={columnWidths.targetColumnsRef}
        getColumnKey={getColumnKey}
        HeaderCellContent={HeaderCellContent}
        headingColumnHeader={headingColumnHeader}
        isHeadingColumn={isHeadingColumn}
        scrollerRef={scrollers.firstScrollerRef}
        stickyTopPx={headerStickyTopPx}
      />
      <ScrollTableBody
        CellContent={CellContent}
        columns={columns}
        getColumnKey={getColumnKey}
        getRowKey={getRowKey}
        HeaderCellContent={HeaderCellContent}
        headingColumnHeader={headingColumnHeader}
        isHeadingColumn={isHeadingColumn}
        RowHeading={RowHeading}
        rows={rows}
        scrollerRef={scrollers.secondScrollerRef}
        widthSizerRowRef={columnWidths.sourceRowRef}
      />
    </>
  )
}

export default memo(ScrollTable) as typeof ScrollTable
