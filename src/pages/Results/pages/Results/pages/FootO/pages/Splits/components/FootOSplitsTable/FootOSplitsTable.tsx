import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material"
import RunnerRow from "./components/RunnerRow.tsx"
import {
  getCourseFromRunner,
  getOnlineControlsCourseFromClassSplits,
} from "./shared/footOSplitsTableFunctions.ts"
import SplitsTableColumns from "./components/SplitsTableColumns.tsx"
import SplitsTableHeaderCells from "./components/SplitsTableHeaderCells.tsx"
import SplitsTableScrollbar from "./components/SplitsTableScrollbar.tsx"
import { countSplitsTableColumns, ROW_WITH_GUTTERS_SX } from "./shared/splitsTableLayout.ts"
import useColumnWidthSync from "./shared/useColumnWidthSync.ts"
import useSyncedHorizontalScroll from "./shared/useSyncedHorizontalScroll.ts"
import NowProvider from "../../../../../../components/NowProvider.tsx"
import { OnlineControlModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "../../../../components/NoRunnerWithSplitsMsg.tsx"
import { useMemo } from "react"
import { analyzeTimeLoss, TimeLossResults } from "../../../../shared/timeLossAnalysis.ts"
import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"

type FootOSplitsTableProps = {
  runners: ProcessedRunnerModel[]
  onlyRadios?: boolean
  showCumulative?: boolean
  radiosList: OnlineControlModel[]
  timeLossEnabled?: boolean
  timeLossThreshold?: number
}

export default function FootOSplitsTable(props: FootOSplitsTableProps) {
  const runnerList = props.onlyRadios
    ? props.runners.filter((runner) => !runnerService.isDNS(runner))
    : props.runners.filter((runner) => hasChipDownload(runner) && !runnerService.isDNS(runner))

  const onlineControlList = useMemo(
    () => getOnlineControlsCourseFromClassSplits(props.radiosList),
    [props.radiosList],
  )

  const courseControlList = useMemo(() => {
    return getCourseFromRunner(runnerList)
  }, [runnerList])

  const controlList = props.onlyRadios && props.radiosList ? onlineControlList : courseControlList

  const timeLossResults: TimeLossResults | null = useMemo(() => {
    if (!props.timeLossEnabled || props.onlyRadios || !props.timeLossThreshold) {
      return null
    }
    return analyzeTimeLoss(runnerList, props.timeLossThreshold)
  }, [props.timeLossEnabled, props.onlyRadios, props.timeLossThreshold, runnerList])

  const { firstScrollerRef: headerRef, secondScrollerRef: bodyRef } = useSyncedHorizontalScroll<
    HTMLDivElement,
    HTMLDivElement
  >()

  const showTimeLossColumn = Boolean(props.timeLossEnabled && !props.showCumulative)
  const columnCount = countSplitsTableColumns(controlList.length, showTimeLossColumn)
  const { sourceRowRef: widthSizerRowRef, targetColumnsRef: headerColumnsRef } = useColumnWidthSync<
    HTMLTableRowElement,
    HTMLTableColElement
  >(columnCount)

  if (runnerList.length === 0) {
    return <NoRunnerWithSplitsMsg />
  }

  return (
    <NowProvider>
      {/* Header for the splits table */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 1 }}>
        <TableContainer
          component={Box}
          ref={headerRef}
          key="SplitsTableHeaderContainer"
          sx={{
            scrollbarWidth: "none",
          }}
        >
          <Table
            size="small"
            key="SplitsTableHeader"
            sx={{ backgroundColor: "white", tableLayout: "fixed" }}
          >
            <SplitsTableColumns columnCount={columnCount} columnsRef={headerColumnsRef} />
            <TableHead key="TableHead">
              <TableRow key="tableHeadRow" sx={ROW_WITH_GUTTERS_SX}>
                <SplitsTableHeaderCells
                  controlList={controlList}
                  onlyRadios={props.onlyRadios}
                  showCleanTime={showTimeLossColumn}
                />
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>

        <SplitsTableScrollbar scrollerRef={bodyRef} />
      </Box>

      {/* Table body */}
      <TableContainer
        component={Box}
        ref={bodyRef}
        key="SplitsTableBodyContainer"
        sx={{ scrollbarWidth: "none", paddingBottom: "16px" }}
      >
        <Table size="small" key="SplitsTableBody">
          <TableBody key="TableBody">
            <TableRow
              aria-hidden
              ref={widthSizerRowRef}
              sx={{ ...ROW_WITH_GUTTERS_SX, visibility: "hidden" }}
            >
              <SplitsTableHeaderCells
                controlList={controlList}
                isWidthSizer
                onlyRadios={props.onlyRadios}
                showCleanTime={showTimeLossColumn}
              />
            </TableRow>
            {runnerList.map((runner) => (
              <RunnerRow
                key={`runnerRow${runner.id}`}
                runner={runner}
                showCumulative={props.showCumulative}
                onlyRadios={props.onlyRadios}
                radiosList={props.radiosList}
                timeLossResults={timeLossResults}
                timeLossEnabled={props.timeLossEnabled}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </NowProvider>
  )
}
