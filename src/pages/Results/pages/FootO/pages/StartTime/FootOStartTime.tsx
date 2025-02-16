import { useContext, useEffect, useState } from "react"
import { RunnersContext } from "../../../../shared/context.ts"
import { orderRunnersByStartTime } from "./shared/functions.ts"
import { useTranslation } from "react-i18next"
import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx"
import ResultListItem from "../../../../components/ResultsList/ResultListItem.tsx"
import StartTime from "../../../../components/StartTime.tsx"
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../shared/functions.ts"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import ParticipantName from '../../../../components/ParticipantName.tsx'
import FlexCol from '../../../../components/FlexCol.tsx'
import RunnerSicard from '../../../../components/RunnerSicard.tsx'
import FlexRow from '../../../../components/FlexRow.tsx'
import TeamRunnerRow from '../../../../components/TeamRunnerRow.tsx'

export default function FootOStartTime() {
  const { t } = useTranslation()

  // Get runners and order by start time
  const [rawRunnersList, isLoading] = useContext(RunnersContext)
  const [runnersByStartTime, setRunnersByStartTime] =
    useState<ProcessedRunnerModel[]>(rawRunnersList)

  useEffect(() => {
    setRunnersByStartTime(orderRunnersByStartTime(rawRunnersList))
  }, [rawRunnersList])

  if (isLoading) {
    return <ResultsListSkeleton />
  } else {
    return (
      <ResultListContainer>
        {runnersByStartTime.map((runner) => (
          <ResultListItem key={runner.id}>
            <FlexCol width="100%">
              <FlexRow>
                <ParticipantName
                  name={runner.full_name}
                  subtitle={(runner.club ? runner.club.short_name : t("ResultsStage.NoClubMsg"))}
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
              {(runner.runners || []).map((teamRunner) => (
                <TeamRunnerRow key={teamRunner.id} runner={teamRunner}></TeamRunnerRow>
              ))}
            </FlexCol>
          </ResultListItem>
        ))}
      </ResultListContainer>
    )
  }
}
