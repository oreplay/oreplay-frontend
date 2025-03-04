import { useTranslation } from "react-i18next"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { getUniqueStationNumbers } from "../../shared/Functions.ts"
import { getPositionOrNc, parseResultStatus } from "../../../../../../shared/functions.ts"
import { parseSecondsToMMSS } from "../../../../../../../../shared/Functions.tsx"
import ControlBadge from "./components/ControlBadge.tsx"
import { RESULT_STATUS_TEXT } from "../../../../../../shared/constants.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import ResultsListSkeleton from "../../../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"

export default function RogainePoints(
  props: ResultsPageProps<[ProcessedRunnerModel[], bigint[]], AxiosError<RunnerModel[]>>,
) {
  const { t } = useTranslation()
  const runnersList = props.runnersQuery.data ? props.runnersQuery.data[0] : null

  const controlNumbers = props.runnersQuery.data ? props.runnersQuery.data[1] : null

  // Component
  if (!props.activeClass) {
    return <ChooseClassMsg />
  } else if (props.runnersQuery.isFetching || props.runnersQuery.isLoading) {
    return <ResultsListSkeleton />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return (
      <TableContainer sx={{ height: "100%", flex: 1 }}>
        <Table>
          <TableHead>
            <TableRow key={"table Head"}>
              <TableCell></TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("ResultsStage.Name")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("ResultsStage.BonusPoints")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("ResultsStage.PenaltyPoints")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("ResultsStage.Points")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("ResultsStage.RaceTime")}</TableCell>
              {// add as many columns as controls
              controlNumbers?.map((controlNumber) => <TableCell key={controlNumber}></TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {runnersList?.map((runner) => {
              const runnerResult = runner.overall
              const status = parseResultStatus(runnerResult?.status_code as string)
              const statusOkOrNc =
                status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
              const runnerPunchedControls = getUniqueStationNumbers([runner])

              return (
                <TableRow sx={{ width: { md: "100%", sx: "200px" } }} key={`runner${runner.id}`}>
                  <TableCell key={`runner${runner.id}pos`}>{getPositionOrNc(runner, t)}</TableCell>
                  <TableCell sx={{ minWidth: "200px" }} key={`runner${runner.id}name`}>
                    <Typography>{`${runner.full_name}`}</Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "small" }}>
                      {runner.club ? `${runner.club.short_name}` : t("ResultsStage.NoClubMsg")}
                    </Typography>
                  </TableCell>
                  <TableCell key={`runner${runner.id}bonus`}>
                    {runnerResult.points_final || runnerResult.finish_time
                      ? `+${runnerResult.points_bonus}`
                      : ""}
                  </TableCell>
                  <TableCell key={`runner${runner.id}penalty`}>
                    {runnerResult.points_final || runnerResult.finish_time
                      ? `${runnerResult.points_penalty}`
                      : ""}
                  </TableCell>
                  <TableCell key={`runner${runner.id}points`}>
                    {runnerResult.points_final || runnerResult.finish_time
                      ? `${runnerResult.points_final}`
                      : ""}
                  </TableCell>
                  <TableCell key={`runner${runner.id}time`}>
                    {statusOkOrNc
                      ? runner.overall.finish_time != null
                        ? parseSecondsToMMSS(runner.overall.time_seconds)
                        : "-"
                      : t(`ResultsStage.statusCodes.${status}`)}
                  </TableCell>
                  {controlNumbers?.map((control) => {
                    return (
                      <TableCell key={`runner${runner.id}control${control}`}>
                        {runner.overall.points_final ||
                        runner.overall.finish_time ? (
                          <ControlBadge
                            number={control}
                            punched={runnerPunchedControls.includes(control)}
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}
