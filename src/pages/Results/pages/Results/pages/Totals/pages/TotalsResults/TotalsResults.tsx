import RunnerSorter from "../../../../components/RunnerSorter/RunnerSorter.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import LoadingStateManager from "../../../../components/LoadingStateManager/LoadingStateManager.tsx"
import TotalsResultItem from "./components/TotalResultItem/TotalResultItem.tsx"
import NonTotalsDataMsg from "./components/NonTotalsDataMsg.tsx"
import { isNonTotalsData } from "./shared/isNonTotalsData.ts"

/**
 * Results of a totals class or club: one row per runner, in the order the backend ranked them,
 * each expanding to its stage results. When the uploaded results do not come from a totals stage,
 * a message asking for totals results is shown instead.
 *
 * @param props.runnersQuery Query with the runners to list.
 * @param props.activeItem Class or club being shown, `null` until one is chosen.
 * @param props.isClass Whether the list is of a class, not of a club.
 */
export default function TotalsResults(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const runnersList = props.runnersQuery.data || []

  const content = isNonTotalsData(runnersList) ? (
    <NonTotalsDataMsg />
  ) : (
    <RunnerSorter
      runnerList={runnersList}
      RunnerRow={TotalsResultItem}
      runnerRowProps={{ isClass: props.isClass }}
      sortingFunction={(runnerList) => runnerList}
    />
  )

  return (
    <LoadingStateManager
      query={props.runnersQuery}
      skeleton={<ResultsListSkeleton />}
      isActiveItem={props.activeItem !== null}
    >
      {content}
    </LoadingStateManager>
  )
}
