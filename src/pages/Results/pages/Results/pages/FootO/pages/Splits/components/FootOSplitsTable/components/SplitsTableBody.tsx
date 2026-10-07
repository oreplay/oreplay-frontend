import { Ref } from "react"
import { Box, Table, TableBody, TableContainer } from "@mui/material"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { TimeLossResults } from "../../../../../shared/timeLossAnalysis.ts"
import { CourseControlModel } from "../shared/footOSplitsTableFunctions.ts"
import RunnerRow from "./RunnerRow.tsx"
import SplitsTableWidthSizerRow from "./SplitsTableWidthSizerRow.tsx"

type SplitsTableBodyProps = {
  controlList: ReadonlyArray<CourseControlModel | OnlineControlModel>
  onlyRadios?: boolean
  radiosList: OnlineControlModel[]
  runnerList: ProcessedRunnerModel[]
  scrollerRef: Ref<HTMLDivElement>
  showCleanTime: boolean
  showCumulative?: boolean
  timeLossEnabled?: boolean
  timeLossResults: TimeLossResults | null
  widthSizerRowRef: Ref<HTMLTableRowElement>
}

export default function SplitsTableBody({
  controlList,
  onlyRadios,
  radiosList,
  runnerList,
  scrollerRef,
  showCleanTime,
  showCumulative,
  timeLossEnabled,
  timeLossResults,
  widthSizerRowRef,
}: SplitsTableBodyProps) {
  return (
    <TableContainer
      component={Box}
      ref={scrollerRef}
      sx={{ scrollbarWidth: "none", paddingBottom: "16px" }}
    >
      <Table size="small">
        <TableBody>
          <SplitsTableWidthSizerRow
            controlList={controlList}
            onlyRadios={onlyRadios}
            rowRef={widthSizerRowRef}
            showCleanTime={showCleanTime}
          />
          {runnerList.map((runner) => (
            <RunnerRow
              key={`runnerRow${runner.id}`}
              runner={runner}
              showCumulative={showCumulative}
              onlyRadios={onlyRadios}
              radiosList={radiosList}
              timeLossResults={timeLossResults}
              timeLossEnabled={timeLossEnabled}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
