import {
  ScrollTableColumnsProps,
  ScrollTableHeadingColumnProps,
} from "../shared/scrollTableProps.ts"
import ScrollTableHeaderCell from "./ScrollTableHeaderCell.tsx"

type ScrollTableHeaderCellsProps<Column> = ScrollTableColumnsProps<Column> &
  ScrollTableHeadingColumnProps & {
    isWidthSizer?: boolean
  }

export default function ScrollTableHeaderCells<Column>({
  columns,
  getColumnKey,
  HeaderCellContent,
  headingColumnHeader,
  isHeadingColumn,
  isWidthSizer,
}: ScrollTableHeaderCellsProps<Column>) {
  return (
    <>
      {isHeadingColumn && (
        <ScrollTableHeaderCell isHeadingColumn isWidthSizer={isWidthSizer}>
          {headingColumnHeader}
        </ScrollTableHeaderCell>
      )}
      {columns.map((column) => (
        <ScrollTableHeaderCell key={getColumnKey(column)} isWidthSizer={isWidthSizer}>
          <HeaderCellContent column={column} />
        </ScrollTableHeaderCell>
      ))}
    </>
  )
}
