import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import RelayResultItem from "./components/RelayResultItem/RelayResultItem.tsx"
import RelayVirtualTicket from "./components/RelayVirtualTicket/RelayVirtualTicket.tsx"
import { useVirtualTicket } from "../../../../../../components/VirtualTicket/shared/hooks.ts"
import RunnerSorter from "../../../../components/RunnerSorter/RunnerSorter.tsx"
import { memo, useMemo } from "react"
import { sortRelayRunners } from "../../shared/sortRelayRunners.ts"
import LoadingStateManager from "../../../../components/LoadingStateManager/LoadingStateManager.tsx"

interface RelayResultProps
  extends ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>> {
  setClassClubId: (classOrClubId: string, isClass: boolean) => void
}

const RelayResultItemMemo = memo(RelayResultItem)

/**
 * Results of a relay class or club: one row per team, laid out like every other results list, and
 * the virtual ticket of the leg the user clicks.
 *
 * @param props.runnersQuery Query with the teams to list.
 * @param props.activeItem Class or club being shown, `null` until one is chosen.
 * @param props.isClass Whether the list is of a class, not of a club.
 * @param props.setClassClubId Switches the view to another class or club from the ticket.
 */
export default function RelayResults(props: RelayResultProps) {
  const runnersList = props.runnersQuery.data || []

  const [isTicketOpen, selectedRunner, handleRowClick, handleCloseTicket, leg] = useVirtualTicket()

  const runnerRowProps = useMemo(
    () => ({
      isClass: props.isClass,
      handleRowClick: handleRowClick,
    }),
    [props.isClass, handleRowClick],
  )

  return (
    <LoadingStateManager
      query={props.runnersQuery}
      skeleton={<ResultsListSkeleton />}
      isActiveItem={props.activeItem !== null}
    >
      <RunnerSorter
        runnerList={runnersList}
        RunnerRow={RelayResultItemMemo}
        runnerRowProps={runnerRowProps}
        sortingFunction={sortRelayRunners}
      />
      <RelayVirtualTicket
        isTicketOpen={isTicketOpen}
        runner={selectedRunner}
        handleCloseTicket={handleCloseTicket}
        isClass={props.isClass}
        setClassClubId={props.setClassClubId}
        leg={leg}
      />
    </LoadingStateManager>
  )
}
