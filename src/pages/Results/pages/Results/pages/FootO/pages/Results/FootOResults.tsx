import { useTranslation } from "react-i18next"
import ResultListContainer from "../../../../../../components/ResultsList/ResultListContainer.tsx"
import ResultListItem from "../../../../../../components/ResultsList/ResultListItem.tsx"
import { parseResultStatus } from "../../../../../../shared/functions.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../shared/constants.ts"
import { useVirtualTicket } from "../../../../../../components/VirtualTicket/shared/hooks.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import FootOVirtualTicket from "../../components/FootOVirtualTicket/FootOVirtualTicket.tsx"
import RaceTime from "../../../../../../components/RaceTime.tsx"
import ResultsListSkeleton from "../../../../../../components/ResultsList/ResultListSkeleton.tsx"
import ParticipantName from "../../../../../../components/ParticipantName.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import { AxiosError } from "axios"
import FlexCol from "../../../../../../components/FlexCol.tsx"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"
import RaceTimeBehind from "../../../../../../components/RaceTimeBehind.tsx"
import { hasChipDownload as hasChipDownloadFunction } from "../../../../shared/functions.ts"
import RacePosition from "../../../../../../components/RacePosition..tsx"

export default function FootOResults(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
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
      <ResultListContainer>
        {runnersList?.map((runner: ProcessedRunnerModel) => {
          const status = parseResultStatus(runner.overall.status_code as string)
          const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
          const hasChipDownload = hasChipDownloadFunction(runner)

          return (
            <ResultListItem key={runner.id} onClick={() => handleRowClick(runner)}>
              <FlexCol width="10px">
                <RacePosition
                  position={runner.overall.position}
                  hasDownload={hasChipDownload}
                  isNC={runner.is_nc || status === RESULT_STATUS_TEXT.nc}
                />
              </FlexCol>
              <ParticipantName
                name={runner.full_name}
                subtitle={
                  props.isClass
                    ? runnerService.getClubName(runner, t)
                    : runnerService.getClassName(runner)
                }
              />
              <FlexCol flexGrow={1}>
                <RaceTime
                  displayStatus
                  isFinalTime={hasChipDownload}
                  status={status}
                  finish_time={runner.overall.finish_time}
                  time_seconds={runner.overall.time_seconds}
                  start_time={runner.overall.start_time}
                />
                <RaceTimeBehind
                  display={statusOkOrNc && runner.overall.finish_time != null && hasChipDownload}
                  time_behind={runner.overall.time_behind}
                />
              </FlexCol>
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
