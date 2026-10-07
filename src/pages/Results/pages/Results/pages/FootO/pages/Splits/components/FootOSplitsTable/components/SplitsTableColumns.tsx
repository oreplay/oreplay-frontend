import { Ref } from "react"
import { GUTTER_COLUMN_COUNT } from "../shared/splitsTableLayout.ts"

type SplitsTableColumnsProps = {
  columnCount: number
  columnsRef: Ref<HTMLTableColElement>
}

export default function SplitsTableColumns({ columnCount, columnsRef }: SplitsTableColumnsProps) {
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
