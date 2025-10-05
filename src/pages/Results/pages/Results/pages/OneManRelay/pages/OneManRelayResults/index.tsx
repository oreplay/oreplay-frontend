import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import { useTranslation } from "react-i18next"
import { useVirtualTicket } from "../../../../../../components/VirtualTicket/shared/hooks.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import RadiosExperimentalAlert from "../../../FootO/components/RadiosExperimentalAlert.tsx"
import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx"
import { parseResultStatus } from "../../../../../../shared/sortingFunctions/sortRunners.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../shared/constants.ts"
import { hasChipDownload as hasChipDownloadFunction } from "../../../../shared/functions.ts"
import ResultListItem from "../../../../components/ResultsList/ResultListItem.tsx"
import RacePosition from "../../../../components/RacePosition..tsx"
import ParticipantName from "../../../../components/ParticipantName.tsx"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"
import RaceTime from "../../../../components/RaceTime.tsx"
import RaceTimeBehind from "../../../../components/RaceTimeBehind.tsx"
import OneManRelayVirtualTicket from "../../components/OneManRelayVirtualTicket"
import ResultListItemColumn from "../../../../components/ResultsList/ResultListItemColumn.tsx"
import { Box } from "@mui/material"

interface OneManRelayResultProps
  extends ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>> {
  setClassClubId: (newClassClubId: string, isClass: boolean) => void
}

export default function OneManRelayResults(props: OneManRelayResultProps) {
  const { t } = useTranslation()

  const runnersList = props.runnersQuery.data
  const [isVirtualTicketOpen, selectedRunner, handleRowClick, handleCloseVirtualTicket] =
    useVirtualTicket()

  if (!props.activeItem) {
    return <ChooseClassMsg />
  }
  if (props.runnersQuery.isFetching) {
    return <ResultsListSkeleton />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return (
      <>
        {
          // @ts-expect-error TS2339 If props.isClass is True, props.activeItem is StageClassModel
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          props.isClass && props.activeItem.splits.length > 0 ? <RadiosExperimentalAlert /> : <></>
        }
        <ResultListContainer>
          {runnersList?.map((runner: ProcessedRunnerModel) => {
            const status = parseResultStatus(runner.stage.status_code as string)
            const statusOkOrNc =
              status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
            const hasChipDownload = hasChipDownloadFunction(runner)

            return (
              <ResultListItem key={runner.id} onClick={() => handleRowClick(runner)}>
                <ResultListItemColumn
                  slotProps={{
                    box: {
                      alignItems: "flex-start",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "row",
                      height: "100%",
                    },
                  }}
                >
                  <RacePosition
                    position={runner.stage.position}
                    hasDownload={hasChipDownload}
                    isNC={runner.is_nc || status === RESULT_STATUS_TEXT.nc}
                    slotProps={{ text: { marginRight: 1 } }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <ParticipantName
                      name={runner.full_name}
                      subtitle={
                        props.isClass
                          ? runnerService.getClubName(runner, t)
                          : runnerService.getClassName(runner)
                      }
                    />
                  </Box>
                </ResultListItemColumn>
                <ResultListItemColumn>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <RaceTime
                      displayStatus
                      isFinalTime={hasChipDownload}
                      status={status}
                      finish_time={runner.stage.finish_time}
                      time_seconds={runner.stage.time_seconds}
                      start_time={runner.stage.start_time}
                    />
                    <RaceTimeBehind
                      display={statusOkOrNc && runner.stage.finish_time != null && hasChipDownload}
                      time_behind={runner.stage.time_behind}
                    />
                  </Box>
                </ResultListItemColumn>
              </ResultListItem>
            )
          })}
          <OneManRelayVirtualTicket
            isTicketOpen={isVirtualTicketOpen}
            runner={selectedRunner}
            handleCloseTicket={handleCloseVirtualTicket}
            setClassClubId={props.setClassClubId}
          />
        </ResultListContainer>
      </>
    )
  }
}
