import { useTranslation } from "react-i18next"
import ResultListContainer from "../../../../../../components/ResultsList/ResultListContainer.tsx"
import ResultListItem from "../../../../../../components/ResultsList/ResultListItem.tsx"
import { Box, Typography } from "@mui/material"
import { parseResultStatus } from "../../../../../../shared/sortingFunctions/sortRunners.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../shared/constants.ts"
import { useVirtualTicket } from "../../../../../../components/VirtualTicket/shared/hooks.ts"
import RogaineVirtualTicket from "../../components/RogaineVirtualTicket/RogaineVirtualTicket.tsx"
import RaceTime from "../../../../../../components/RaceTime.tsx"
import ResultsListSkeleton from "../../../../../../components/ResultsList/ResultListSkeleton.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ParticipantName from "../../../../../../components/ParticipantName.tsx"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"
import { hasChipDownload as hasChipDownloadFunction } from "../../../../shared/functions.ts"
import RacePosition from "../../../../../../components/RacePosition..tsx"

interface RogainePointsProps
  extends ResultsPageProps<[ProcessedRunnerModel[], bigint[]], AxiosError<RunnerModel[]>> {
  setClassClubId: (newClassOrClubId: string, isClass: boolean) => void
}

export default function RogainePoints(props: RogainePointsProps) {
  const { t } = useTranslation()

  const [isVirtualTicketOpen, selectedRunner, handleRowClick, handleCloseVirtualTicket] =
    useVirtualTicket()

  // Gather runners data
  const runnersList = props.runnersQuery.data ? props.runnersQuery.data[0] : null

  // Render component
  if (!props.activeItem) {
    return <ChooseClassMsg />
  } else if (props.runnersQuery.isFetching || props.runnersQuery.isLoading) {
    return <ResultsListSkeleton />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return (
      <ResultListContainer>
        {runnersList?.map((runner) => {
          const runnerResult = runner.stage
          const status = parseResultStatus(runnerResult?.status_code as string)
          const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
          const hasDownload = hasChipDownloadFunction(runner)

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
                <RacePosition
                  position={runner.stage.position}
                  isNC={runner.is_nc || status === RESULT_STATUS_TEXT.nc}
                  hasDownload={hasDownload}
                />
              </Box>
              <ParticipantName
                name={runner.full_name}
                subtitle={
                  props.isClass
                    ? runnerService.getClubName(runner, t)
                    : runnerService.getClassName(runner)
                }
              />
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
                <Typography>
                  {statusOkOrNc
                    ? runnerResult.points_final || runnerResult.finish_time
                      ? `${runnerResult.points_final}`
                      : ""
                    : ""}
                </Typography>
                <RaceTime
                  displayStatus
                  status={status}
                  isFinalTime={hasDownload}
                  start_time={runnerResult.start_time}
                  finish_time={runnerResult.finish_time}
                  time_seconds={runnerResult.time_seconds}
                />
              </Box>
            </ResultListItem>
          )
        })}
        <RogaineVirtualTicket
          isTicketOpen={isVirtualTicketOpen}
          runner={selectedRunner}
          handleCloseTicket={handleCloseVirtualTicket}
          setClassClubId={props.setClassClubId}
        />
      </ResultListContainer>
    )
  }
}
