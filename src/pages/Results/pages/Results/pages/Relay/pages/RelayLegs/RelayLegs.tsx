import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import LoadingStateManager from "../../../../components/LoadingStateManager/LoadingStateManager.tsx"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import RelayLegsList from "./components/RelayLegsList.tsx"

/**
 * Legs of a relay class or club: the runners of the leg the user picks, ranked like individual
 * results, each with their team and the online course of the leg.
 *
 * @param props.runnersQuery Query with the teams of the relay.
 * @param props.activeItem Class or club being shown, `null` until one is chosen.
 * @param props.isClass Whether the list is of a class, not of a club.
 */
export default function RelayLegs(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  return (
    <LoadingStateManager
      query={props.runnersQuery}
      skeleton={<ResultsListSkeleton />}
      isActiveItem={props.activeItem !== null}
    >
      <RelayLegsList isClass={props.isClass} teams={props.runnersQuery.data ?? []} />
    </LoadingStateManager>
  )
}
