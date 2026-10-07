import { Ref } from "react"
import { TableRow } from "@mui/material"
import { ROW_WITH_GUTTERS_SX } from "../shared/scrollTableLayout.ts"
import { ScrollTableColumnsProps } from "../shared/scrollTableProps.ts"
import ScrollTableHeaderCells from "./ScrollTableHeaderCells.tsx"

const WIDTH_SIZER_ROW_SX = { ...ROW_WITH_GUTTERS_SX, visibility: "hidden" }

type ScrollTableWidthSizerRowProps<Column> = ScrollTableColumnsProps<Column> & {
  rowRef: Ref<HTMLTableRowElement>
}

export default function ScrollTableWidthSizerRow<Column>({
  columns,
  getColumnKey,
  HeaderCellContent,
  rowRef,
}: ScrollTableWidthSizerRowProps<Column>) {
  return (
    <TableRow aria-hidden ref={rowRef} sx={WIDTH_SIZER_ROW_SX}>
      <ScrollTableHeaderCells
        columns={columns}
        getColumnKey={getColumnKey}
        HeaderCellContent={HeaderCellContent}
        isWidthSizer
      />
    </TableRow>
  )
}
