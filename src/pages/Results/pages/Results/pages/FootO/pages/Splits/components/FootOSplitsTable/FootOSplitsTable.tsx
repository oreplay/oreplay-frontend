import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import RunnerRow from "./components/RunnerRow.tsx"
import {
  CourseControlModel,
  getCourseFromRunner,
  getOnlineControlsCourseFromClassSplits,
} from "./shared/footOSplitsTablefunctions.ts"
import CourseControlTableHeader from "./components/CourseControlTableHeader.tsx"
import NowProvider from "../../../../../../../../components/NowProvider.tsx"
import { OnlineControlModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "./components/NoRunnerWithSplitsMsg.tsx"
import { useMemo } from "react"
import { analyzeTimeLoss, TimeLossResults } from "../utils/timeLossAnalysis.ts"

type FootOSplitsTableProps = {
  runners: ProcessedRunnerModel[]
  onlyRadios?: boolean
  showCumulative?: boolean
  radiosList: OnlineControlModel[]
  timeLossEnabled?: boolean
  timeLossThreshold?: number
  graphsEnabled?: boolean
  selectedRunners?: string[]
  onRunnerSelectionChange?: (selectedRunners: string[]) => void
}

export default function FootOSplitsTable(props: FootOSplitsTableProps) {
  const { t } = useTranslation()
  const runnerList = props.onlyRadios ? props.runners : props.runners.filter(hasChipDownload)

  const onlineControlList = useMemo(
    () => getOnlineControlsCourseFromClassSplits(props.radiosList),
    [props.radiosList],
  )
  const courseControlList = useMemo(() => getCourseFromRunner(runnerList), [runnerList])

  const controlList = props.onlyRadios && props.radiosList ? onlineControlList : courseControlList

  // Calculate time loss analysis when enabled and not showing only radios
  const timeLossResults: TimeLossResults | null = useMemo(() => {
    if (!props.timeLossEnabled || props.onlyRadios || !props.timeLossThreshold) {
      return null
    }

    return analyzeTimeLoss(runnerList, props.timeLossThreshold, props.showCumulative)
  }, [
    props.timeLossEnabled,
    props.onlyRadios,
    props.timeLossThreshold,
    runnerList,
    props.showCumulative,
  ])

  // No runner hasDownloaded a chip
  if (runnerList.length === 0) {
    return <NoRunnerWithSplitsMsg />
  }

  const showTimeLossColumn = props.timeLossEnabled && !props.showCumulative

  // Handle selection
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allRunnerIds = runnerList.map((runner) => runner.id)
      props.onRunnerSelectionChange?.(allRunnerIds)
    } else {
      props.onRunnerSelectionChange?.([])
    }
  }

  const handleRunnerSelection = (runnerId: string, checked: boolean) => {
    const currentSelection = props.selectedRunners || []
    if (checked) {
      props.onRunnerSelectionChange?.([...currentSelection, runnerId])
    } else {
      props.onRunnerSelectionChange?.(currentSelection.filter((id) => id !== runnerId))
    }
  }

  const selectedRunners = props.selectedRunners || []
  const isAllSelected = selectedRunners.length === runnerList.length && runnerList.length > 0
  const isIndeterminate = selectedRunners.length > 0 && selectedRunners.length < runnerList.length

  return (
    <NowProvider>
      <TableContainer key={"TableContainer"} sx={{ height: "100%", flex: 1, overflowX: "auto" }}>
        <Table key={"SplitsTable"} stickyHeader>
          <TableHead key={"TableHead"}>
            <TableRow key={"tableHeadRow"}>
              {props.graphsEnabled && (
                <TableCell key="selection" padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                </TableCell>
              )}
              <TableCell key={`positionHead`}></TableCell>
              <TableCell key={`nameHead`} sx={{ fontWeight: "bold" }}>
                {t("ResultsStage.Name")}
              </TableCell>
              <TableCell key={"Time"}>{t("ResultsStage.Times")}</TableCell>
              {showTimeLossColumn && (
                <TableCell key={"CleanTime"} sx={{ fontWeight: "bold" }}>
                  Sin Errores
                </TableCell>
              )}
              {controlList.map((courseControl) => {
                if (props.onlyRadios) {
                  const radio = courseControl as OnlineControlModel
                  return (
                    <CourseControlTableHeader
                      key={`courseControlHeader${radio.id}`}
                      station={radio.station}
                      onlyRadios={props.onlyRadios}
                    />
                  )
                } else {
                  const course = courseControl as CourseControlModel
                  return (
                    <CourseControlTableHeader
                      key={`courseControlHeader${course.order_number}${course.control?.id ?? "unknown"}`}
                      station={course.control?.station}
                      order_number={course.order_number}
                      onlyRadios={props.onlyRadios}
                    />
                  )
                }
              })}
            </TableRow>
          </TableHead>
          <TableBody key={"TableBody"}>
            {runnerList.map((runner) => (
              <RunnerRow
                key={`runnerRow${runner.id}`}
                runner={runner}
                showCumulative={props.showCumulative}
                onlyRadios={props.onlyRadios}
                radiosList={props.radiosList}
                timeLossResults={timeLossResults}
                timeLossEnabled={props.timeLossEnabled}
                graphsEnabled={props.graphsEnabled}
                selected={selectedRunners.includes(runner.id)}
                onSelectionChange={handleRunnerSelection}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </NowProvider>
  )
}
