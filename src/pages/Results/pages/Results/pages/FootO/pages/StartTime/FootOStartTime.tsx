import { useEffect, useState } from "react"
import { orderRunnersByStartTime } from "./shared/functions.ts"
import { useTranslation } from "react-i18next"
import ResultListContainer from "../../../../../../components/ResultsList/ResultListContainer.tsx"
import ResultListItem from "../../../../../../components/ResultsList/ResultListItem.tsx"
import StartTime from "../../../../../../components/StartTime.tsx"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../../../shared/functions.ts"
import ResultsListSkeleton from "../../../../../../components/ResultsList/ResultListSkeleton.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ParticipantName from "../../../../../../components/ParticipantName.tsx"
import FlexCol from "../../../../../../components/FlexCol.tsx"
import RunnerSicard from "../../../../../../components/RunnerSicard.tsx"
import FlexRow from "../../../../../../components/FlexRow.tsx"
import TeamRunnerRow from "../../../../../../components/TeamRunnerRow.tsx"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"

export default function FootOStartTime(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const { t } = useTranslation()

  // Get runners and order by start time
  const rawRunnersList = props.runnersQuery.data
  const [runnersByStartTime, setRunnersByStartTime] = useState<ProcessedRunnerModel[]>([])

  useEffect(() => {
    setRunnersByStartTime(orderRunnersByStartTime(rawRunnersList ? rawRunnersList : []))
  }, [rawRunnersList])

  // Component
  if (!props.activeClass) {
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
            <FlexCol width="100%">
              <FlexRow>
                <ParticipantName
                  name={runner.full_name}
                  subtitle={runnerService.getClubName(runner, t)}
                />
                <FlexCol>
                  <StartTime
                    displayStatus
                    startTime={runner.overall.start_time}
                    status={parseResultStatus(runner.overall?.status_code as string)}
                  ></StartTime>
                  <RunnerSicard runner={runner}></RunnerSicard>
                </FlexCol>
              </FlexRow>
              {(runner.runners || [])
                .slice() // Create a shallow copy to avoid mutating the original array
                .sort((a, b) => (a?.overall?.leg_number || 0) - (b?.overall?.leg_number || 0))
                .map((teamRunner) => (
                  <TeamRunnerRow key={teamRunner.id} runner={teamRunner}></TeamRunnerRow>
                ))}
            </FlexCol>
          </ResultListItem>
        ))}
      </ResultListContainer>
    )
  }
}
