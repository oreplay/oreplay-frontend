import { Ref, RefObject } from "react"
import { Box, Table, TableContainer, TableHead, TableRow } from "@mui/material"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { CourseControlModel } from "../shared/footOSplitsTableFunctions.ts"
import { ROW_WITH_GUTTERS_SX } from "../shared/splitsTableLayout.ts"
import SplitsTableColumns from "./SplitsTableColumns.tsx"
import SplitsTableHeaderCells from "./SplitsTableHeaderCells.tsx"
import SplitsTableScrollbar from "./SplitsTableScrollbar.tsx"

type SplitsTableHeaderProps = {
  bodyScrollerRef: RefObject<HTMLElement | null>
  columnCount: number
  columnsRef: Ref<HTMLTableColElement>
  controlList: ReadonlyArray<CourseControlModel | OnlineControlModel>
  onlyRadios?: boolean
  scrollerRef: Ref<HTMLDivElement>
  showCleanTime: boolean
}

export default function SplitsTableHeader({
  bodyScrollerRef,
  columnCount,
  columnsRef,
  controlList,
  onlyRadios,
  scrollerRef,
  showCleanTime,
}: SplitsTableHeaderProps) {
  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 1 }}>
      <TableContainer component={Box} ref={scrollerRef} sx={{ scrollbarWidth: "none" }}>
        <Table size="small" sx={{ backgroundColor: "white", tableLayout: "fixed" }}>
          <SplitsTableColumns columnCount={columnCount} columnsRef={columnsRef} />
          <TableHead>
            <TableRow sx={ROW_WITH_GUTTERS_SX}>
              <SplitsTableHeaderCells
                controlList={controlList}
                onlyRadios={onlyRadios}
                showCleanTime={showCleanTime}
              />
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <SplitsTableScrollbar scrollerRef={bodyScrollerRef} />
    </Box>
  )
}
