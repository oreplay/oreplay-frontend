import { Ref } from "react"
import { GUTTER_COLUMN_COUNT } from "../shared/scrollTableLayout.ts"

type ScrollTableColumnsProps = {
  columnCount: number
  columnsRef: Ref<HTMLTableColElement>
}

export default function ScrollTableColumns({ columnCount, columnsRef }: ScrollTableColumnsProps) {
  const columnIndexes = Array.from(
    { length: columnCount + GUTTER_COLUMN_COUNT },
    (_, index) => index,
  )

  return (
    <colgroup ref={columnsRef}>
      {columnIndexes.map((columnIndex) => (
        <col key={columnIndex} />
      ))}
    </colgroup>
  )
}
