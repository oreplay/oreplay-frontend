import { ScrollTableColumnsProps } from "../shared/scrollTableProps.ts"
import ScrollTableHeaderCell from "./ScrollTableHeaderCell.tsx"

type ScrollTableHeaderCellsProps<Column> = ScrollTableColumnsProps<Column> & {
  isWidthSizer?: boolean
}

export default function ScrollTableHeaderCells<Column>({
  columns,
  getColumnKey,
  HeaderCellContent,
  isWidthSizer,
}: ScrollTableHeaderCellsProps<Column>) {
  return (
    <>
      {columns.map((column) => (
        <ScrollTableHeaderCell key={getColumnKey(column)} isWidthSizer={isWidthSizer}>
          <HeaderCellContent column={column} />
        </ScrollTableHeaderCell>
      ))}
    </>
  )
}
