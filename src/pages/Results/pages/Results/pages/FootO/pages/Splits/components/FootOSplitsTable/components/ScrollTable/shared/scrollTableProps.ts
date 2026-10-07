import { ComponentType } from "react"

export type ScrollTableCellContentProps<Column, Row> = {
  column: Column
  row: Row
}

export type ScrollTableHeaderCellContentProps<Column> = {
  column: Column
}

export type ScrollTableRowHeadingProps<Row> = {
  row: Row
}

export type ScrollTableColumnsProps<Column> = {
  columns: readonly Column[]
  getColumnKey: (column: Column) => string
  HeaderCellContent: ComponentType<ScrollTableHeaderCellContentProps<Column>>
}

export type ScrollTableRowContentProps<Column, Row> = {
  CellContent: ComponentType<ScrollTableCellContentProps<Column, Row>>
  columns: readonly Column[]
  getColumnKey: (column: Column) => string
  RowHeading: ComponentType<ScrollTableRowHeadingProps<Row>>
}

export type ScrollTableProps<Column, Row> = ScrollTableColumnsProps<Column> &
  ScrollTableRowContentProps<Column, Row> & {
    getRowKey: (row: Row) => string
    rows: readonly Row[]
  }
