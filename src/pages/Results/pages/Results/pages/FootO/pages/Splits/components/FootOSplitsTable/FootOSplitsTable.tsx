import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
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
  }, [props.timeLossEnabled, props.onlyRadios, props.timeLossThreshold, runnerList, props.showCumulative])

  // No runner hasDownloaded a chip
  if (runnerList.length === 0) {
    return <NoRunnerWithSplitsMsg />
  }

  // Runners have full splits that we may want to see
  return (
    <>
      <NowProvider>
        <TableContainer key={"TableContainer"} sx={{ height: "100%", flex: 1 }}>
          <Table key={"SplitsTable"}>
            <TableHead key={"TableHead"}>
              <TableRow key={"tableHeadRow"}>
                <TableCell key={`positionHead`}></TableCell>
                <TableCell key={`nameHead`} sx={{ fontWeight: "bold" }}>
                  {t("ResultsStage.Name")}
                </TableCell>
                <TableCell key={"Time"}>{t("ResultsStage.Times")}</TableCell>
                {controlList.map((courseControl) => {
                  if (props.onlyRadios) {
                    courseControl = courseControl as OnlineControlModel
                    return (
                      <CourseControlTableHeader
                        key={`courseControlHeader${courseControl.id}`}
                        station={courseControl.station}
                        onlyRadios={props.onlyRadios}
                      />
                    )
                  } else {
                    courseControl = courseControl as CourseControlModel
                    return (
                      <CourseControlTableHeader
                        key={`courseControlHeader${courseControl.order_number}${courseControl.control?.id}`}
                        station={courseControl.control?.station}
                        order_number={courseControl.order_number}
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
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </NowProvider>
    </>
  )
}
