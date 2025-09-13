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

  // Calculate category leaders (for club view - category-relative differences)
  const categoryLeaders = useMemo(() => {
    if (!runnersList || props.isClass) return new Map() // Only needed for club view

    const categoryMap = new Map<string, { time?: number; points?: number }>()

    runnersList.forEach((runner) => {
      const className = runner.class?.short_name
      if (!className) return

      const result = runner.overalls?.overall
      if (!result || result.position !== 1) return // Only position 1 runners

      const existing = categoryMap.get(className) || {}

      // Update category leader time and points
      if (result.time_seconds && (!existing.time || result.time_seconds < existing.time)) {
        existing.time = result.time_seconds
      }

      if (
        result.points_final !== null &&
        result.points_final !== undefined &&
        (!existing.points || result.points_final > existing.points)
      ) {
        existing.points = result.points_final
      }

      categoryMap.set(className, existing)
    })

    return categoryMap
  }, [runnersList, props.isClass])

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
    return (
      <>
        <NotImplementedAlertBox />
        <ChooseClassMsg />
      </>
    )
  }
  if (props.runnersQuery.isFetching) {
    return (
      <>
        <NotImplementedAlertBox />
        <ResultsListSkeleton />
      </>
    )
  } else if (props.runnersQuery.isError) {
    return (
      <>
        <NotImplementedAlertBox />
        <GeneralErrorFallback />
      </>
    )
  } else {
    return (
      <ResultListContainer>
        <NotImplementedAlertBox />
        {runnersList?.map((runner: ProcessedRunnerModel) => {
          // Get category leader for this runner (only for club view)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const categoryLeader =
            !props.isClass && runner.class?.short_name
              ? categoryLeaders.get(runner.class.short_name)
              : undefined

          return (
            <EnhancedTotalsResultItem
              key={runner.id}
              runner={runner}
              handleRowClick={handleRowClick}
              stageLeaders={stageLeaders}
              overallLeaderTime={overallLeaderTime}
              overallLeaderPoints={overallLeaderPoints}
              isPointsBasedEvent={isPointsBasedEvent}
              isClass={props.isClass}
              /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
              categoryLeaderTime={categoryLeader?.time}
              /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
              categoryLeaderPoints={categoryLeader?.points}
            />
          )
        })}
      </ResultListContainer>
    )
  }
}
