import {
  ProcessedRunnerModel,
  ProcessedSplitModel,
} from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useTranslation } from "react-i18next"
import RunnerRow from "./components/RunnerRow.tsx"
import {
  getCourseFromRunner,
  getOnlineControlsCourseFromClassSplits,
} from "./shared/footOSplitsTablefunctions.ts"
import CourseControlTableHeader from "./components/CourseControlTableHeader.tsx"
import NowProvider from "../../../../../../../../components/NowProvider.tsx"
import { SplitModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "./components/NoRunnerWithSplitsMsg.tsx"

type FootOSplitsTableProps = {
  runners: ProcessedRunnerModel[]
  onlyRadios?: boolean
  showCumulative?: boolean
  radiosList?: SplitModel[] | ProcessedSplitModel[]
}

export default function FootOSplitsTable(props: FootOSplitsTableProps) {
  const { t } = useTranslation()
  const runnerList = props.onlyRadios ? props.runners : props.runners.filter(hasChipDownload)

  const controlList =
    props.onlyRadios && props.radiosList
      ? getOnlineControlsCourseFromClassSplits(props.radiosList)
      : getCourseFromRunner(runnerList)

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
                  if (!courseControl.order_number) {
                    return <></>
                  }

                  return (
                    <CourseControlTableHeader
                      key={`courseControlHeader${courseControl.control?.id}`}
                      control={courseControl.control}
                      order_number={courseControl.order_number}
                      onlyRadios={props.onlyRadios}
                    />
                  )
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
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </NowProvider>
    </>
  )
}
