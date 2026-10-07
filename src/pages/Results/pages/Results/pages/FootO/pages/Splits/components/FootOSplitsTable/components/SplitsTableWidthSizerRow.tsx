import { Ref } from "react"
import { TableRow } from "@mui/material"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { CourseControlModel } from "../shared/footOSplitsTableFunctions.ts"
import { ROW_WITH_GUTTERS_SX } from "../shared/splitsTableLayout.ts"
import SplitsTableHeaderCells from "./SplitsTableHeaderCells.tsx"

const WIDTH_SIZER_ROW_SX = { ...ROW_WITH_GUTTERS_SX, visibility: "hidden" }

type SplitsTableWidthSizerRowProps = {
  controlList: ReadonlyArray<CourseControlModel | OnlineControlModel>
  onlyRadios?: boolean
  rowRef: Ref<HTMLTableRowElement>
  showCleanTime: boolean
}

export default function SplitsTableWidthSizerRow({
  controlList,
  onlyRadios,
  rowRef,
  showCleanTime,
}: SplitsTableWidthSizerRowProps) {
  return (
    <TableRow aria-hidden ref={rowRef} sx={WIDTH_SIZER_ROW_SX}>
      <SplitsTableHeaderCells
        controlList={controlList}
        isWidthSizer
        onlyRadios={onlyRadios}
        showCleanTime={showCleanTime}
      />
    </TableRow>
  )
}
