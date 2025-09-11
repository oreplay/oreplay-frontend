import ResultListContainer from "../../../../../../components/ResultsList/ResultListContainer.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import ResultsListSkeleton from "../../../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import EnhancedTotalsResultItem from "./components/EnhancedTotalsResultItem.tsx"
import NotImplementedAlertBox from "../../../../../../../../components/NotImplementedAlertBox.tsx"
import { calculateStageLeaders } from "./utils/stageLeaderCalculator.ts"
import { useMemo } from "react"

export default function TotalsResults(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const runnersList = props.runnersQuery.data

  // Calculate stage leaders for difference calculations
  const stageLeaders = useMemo(() => {
    if (!runnersList) return []
    const leaders = calculateStageLeaders(runnersList)
    console.log("Stage Leaders calculated:", leaders)
    return leaders
  }, [runnersList])

  // Calculate overall leader time (position 1 runner's time)
  const overallLeaderTime = useMemo(() => {
    if (!runnersList) return undefined
    const leader = runnersList.find((runner) => runner.overalls?.overall?.position === 1)
    return leader?.overalls?.overall?.time_seconds || undefined
  }, [runnersList])

  // Calculate overall leader points (position 1 runner's points)
  const overallLeaderPoints = useMemo(() => {
    if (!runnersList) return undefined
    const leader = runnersList.find((runner) => runner.overalls?.overall?.position === 1)
    return leader?.overalls?.overall?.points_final || undefined
  }, [runnersList])

  // Determine if this is a points-based event
  const isPointsBasedEvent = useMemo(() => {
    if (!runnersList) return false
    // Check if any runner has points_final > 0
    return runnersList.some(
      (runner) =>
        runner.overalls?.overall?.points_final !== null &&
        runner.overalls?.overall?.points_final !== undefined &&
        runner.overalls?.overall?.points_final > 0,
    )
  }, [runnersList])

  // @ts-expect-error TS6133: variable is declared but never used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRowClick = (runner: RunnerModel) => {}

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
        <NotImplementedAlertBox />
        {runnersList?.map((runner: ProcessedRunnerModel) => (
          <EnhancedTotalsResultItem
            key={runner.id}
            runner={runner}
            handleRowClick={handleRowClick}
            stageLeaders={stageLeaders}
            overallLeaderTime={overallLeaderTime}
            overallLeaderPoints={overallLeaderPoints}
            isPointsBasedEvent={isPointsBasedEvent}
          />
        ))}
      </ResultListContainer>
    )
  }
}
