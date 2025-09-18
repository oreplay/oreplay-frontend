import { useMemo } from "react"
import { sortRunnersByStartTime } from "./shared/functions.ts"
import { useTranslation } from "react-i18next"
import ResultListContainer from "../../../../../../components/ResultsList/ResultListContainer.tsx"
import ResultListItem from "../../../../../../components/ResultsList/ResultListItem.tsx"
import StartTime from "../../../../../../components/StartTime.tsx"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../../../shared/sortingFunctions/sortRunners.ts"
import ResultsListSkeleton from "../../../../../../components/ResultsList/ResultListSkeleton.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ParticipantName from "../../../../../../components/ParticipantName.tsx"
import RunnerSicard from "../../../../../../components/RunnerSicard.tsx"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"
import ResultListItemColumn from "../../../../../../components/ResultsList/ResultListItemColumn.tsx"

export default function FootOStartTime(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const { t } = useTranslation()

  // Get runners and order by start time
  const rawRunnersList = props.runnersQuery.data?.slice() //shallow copy to avoid mutation

  const runnersByStartTime = useMemo(() => {
    return sortRunnersByStartTime(rawRunnersList ?? [])
  }, [rawRunnersList])

  // Component
  if (!props.activeItem) {
    return <ChooseClassMsg />
  } else if (props.runnersQuery.isFetching || props.runnersQuery.isLoading) {
    return <ResultsListSkeleton />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return (
      <ResultListContainer>
        {runnersByStartTime.map((runner) => (
          <ResultListItem key={runner.id}>
            <ResultListItemColumn>
              <ParticipantName
                name={runner.full_name}
                subtitle={
                  props.isClass
                    ? runnerService.getClubName(runner, t)
                    : runnerService.getClassName(runner)
                }
              />
            </ResultListItemColumn>
            <ResultListItemColumn
              slotProps={{
                box: { display: "flex", flexDirection: "column", alignItems: "center" },
              }}
            >
              <StartTime
                displayStatus
                startTime={runner.stage.start_time}
                status={parseResultStatus(runner.stage?.status_code as string)}
              ></StartTime>
              <RunnerSicard sicard={runner.sicard}></RunnerSicard>
            </ResultListItemColumn>
          </ResultListItem>
        ))}
      </ResultListContainer>
    )
  }
}
