import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useTranslation } from "react-i18next"
import RunnerRow from "./components/RunnerRow.tsx"
import ExperimentalFeatureAlert from "../../../../../../../../../../components/ExperimentalFeatureAlert.tsx"
import { getCourseFromRunner } from "./shared/footOSplitsTablefunctions.ts"
import CourseControlTableHeader from "./components/CourseControlTableHeader.tsx"
import NowProvider from "../../../../../../../../components/NowProvider.tsx"

type FootOSplitsTableProps = {
  runners: ProcessedRunnerModel[]
}

export default function FootOSplitsTable(props: FootOSplitsTableProps) {
  const { t } = useTranslation()
  const controlList = getCourseFromRunner(props.runners)

  return (
    <>
      <ExperimentalFeatureAlert />
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
                    />
                  )
                })}
              </TableRow>
            </TableHead>
            <TableBody key={"TableBody"}>
              {props.runners.map((runner) => (
                <RunnerRow key={`runnerRow${runner.id}`} runner={runner} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </NowProvider>
    </>
  )
}
