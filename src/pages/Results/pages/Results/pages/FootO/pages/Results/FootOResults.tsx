import { useTranslation } from "react-i18next"
import ResultListContainer from "../../../../../../components/ResultsList/ResultListContainer.tsx"
import ResultListItem from "../../../../../../components/ResultsList/ResultListItem.tsx"
import { Box, Typography } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../shared/Functions.tsx"
import { getPositionOrNc, parseResultStatus } from "../../../../../../shared/functions.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../shared/constants.ts"
import { useVirtualTicket } from "../../../../../../components/VirtualTicket/shared/hooks.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import FootOVirtualTicket from "../../components/FootOVirtualTicket/FootOVirtualTicket.tsx"
import RaceTime from "../../../../../../components/RaceTime.tsx"
import ResultsListSkeleton from "../../../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import { AxiosError } from "axios"

export default function FootOResults(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const { t } = useTranslation()

  const runnersList = props.runnersQuery.data
  const [isVirtualTicketOpen, selectedRunner, handleRowClick, handleCloseVirtualTicket] =
    useVirtualTicket()

  if (!props.activeClass) {
    return <ChooseClassMsg />
  }
  if (props.runnersQuery.isFetching) {
    return <ResultsListSkeleton />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return (
      <ResultListContainer>
        {runnersList?.map((runner: ProcessedRunnerModel) => {
          const status = parseResultStatus(runner.runner_results[0].status_code as string)
          const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc

          return (
            <ResultListItem key={runner.id} onClick={() => handleRowClick(runner)}>
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex", // Enables flex properties
                  flexDirection: "column", // Stack content vertically
                  justifyContent: "flex-start", // Align content to the top
                  alignItems: "flex-end",
                  flexGrow: 0,
                  width: "10px",
                }}
              >
                <Typography sx={{ color: "primary.main" }}>{getPositionOrNc(runner, t)}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "calc(100% -20px)",
                  marginLeft: ".3em",
                }}
              >
                <Typography>{`${runner.full_name}`}</Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "small",
                  }}
                >
                  {runner.club ? `${runner.club.short_name}` : t("ResultsStage.NoClubMsg")}
                </Typography>
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex", // Enables flex properties
                  flexDirection: "column", // Stack content vertically
                  justifyContent: "flex-start", // Align content to the top
                  alignItems: "flex-end",
                  flexGrow: 1,
                }}
              >
                <RaceTime
                  displayStatus
                  status={status}
                  finish_time={runner.runner_results[0].finish_time}
                  time_seconds={runner.runner_results[0].time_seconds}
                  start_time={runner.runner_results[0].start_time}
                />
                <Typography sx={{ color: "primary.main", fontSize: 14 }}>
                  {statusOkOrNc && runner.runner_results[0].finish_time != null
                    ? `+${parseSecondsToMMSS(runner.runner_results[0].time_behind.toString())}`
                    : ""}
                </Typography>
              </Box>
            </ResultListItem>
          )
        })}
        <FootOVirtualTicket
          isTicketOpen={isVirtualTicketOpen}
          runner={selectedRunner}
          handleCloseTicket={handleCloseVirtualTicket}
        />
      </ResultListContainer>
    )
  }
}
