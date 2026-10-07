import { memo } from "react"
import { ScrollTableProps } from "./shared/scrollTableProps.ts"
import useColumnWidthSync from "./shared/useColumnWidthSync.ts"
import useSyncedHorizontalScroll from "../../../../../../shared/horizontalScroll/useSyncedHorizontalScroll.ts"
import ScrollTableBody from "./components/ScrollTableBody.tsx"
import ScrollTableHeader from "./components/ScrollTableHeader.tsx"

function ScrollTable<Column, Row>({
  CellContent,
  columns,
  getColumnKey,
  getRowKey,
  HeaderCellContent,
  RowHeading,
  rows,
}: ScrollTableProps<Column, Row>) {
  const scrollers = useSyncedHorizontalScroll<HTMLDivElement, HTMLDivElement>()
  const columnWidths = useColumnWidthSync<HTMLTableRowElement, HTMLTableColElement>(columns)

  return (
    <>
      <ScrollTableHeader
        bodyScrollerRef={scrollers.secondScrollerRef}
        columns={columns}
        columnsRef={columnWidths.targetColumnsRef}
        getColumnKey={getColumnKey}
        HeaderCellContent={HeaderCellContent}
        scrollerRef={scrollers.firstScrollerRef}
      />
      <ScrollTableBody
        CellContent={CellContent}
        columns={columns}
        getColumnKey={getColumnKey}
        getRowKey={getRowKey}
        HeaderCellContent={HeaderCellContent}
        RowHeading={RowHeading}
        rows={rows}
        scrollerRef={scrollers.secondScrollerRef}
        widthSizerRowRef={columnWidths.sourceRowRef}
      />
    </>
  )
}

export default memo(ScrollTable) as typeof ScrollTable
