import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import LoadingStateManager from "../../../../components/LoadingStateManager/LoadingStateManager.tsx"
import RelayResultsList from "./components/RelayResultsList.tsx"
import NonRelayDataMsg from "./components/NonRelayDataMsg.tsx"
import { isNonRelayData } from "./shared/isNonRelayData.ts"

interface RelayResultProps
  extends ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>> {
  setClassClubId: (classOrClubId: string, isClass: boolean) => void
}

/**
 * Results of a relay class or club: one row per team, laid out like every other results list, and
 * the virtual ticket of the leg the user clicks. When the uploaded results do not come from a
 * relay, a message asking for relay results is shown instead.
 *
 * @param props.runnersQuery Query with the teams to list.
 * @param props.activeItem Class or club being shown, `null` until one is chosen.
 * @param props.isClass Whether the list is of a class, not of a club.
 * @param props.setClassClubId Switches the view to another class or club from the ticket.
 */
export default function RelayResults(props: RelayResultProps) {
  const runnersList = props.runnersQuery.data || []

  const content = isNonRelayData(runnersList) ? (
    <NonRelayDataMsg />
  ) : (
    <RelayResultsList
      teams={runnersList}
      isClass={props.isClass}
      setClassClubId={props.setClassClubId}
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
