import { memo, useMemo } from "react"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { useVirtualTicket } from "../../../../../../../components/VirtualTicket/shared/hooks.ts"
import RunnerSorter from "../../../../../components/RunnerSorter/RunnerSorter.tsx"
import { sortRelayRunners } from "../../../shared/sortRelayRunners.ts"
import RelayResultItem from "./RelayResultItem/RelayResultItem.tsx"
import RelayVirtualTicket from "./RelayVirtualTicket/RelayVirtualTicket.tsx"

interface RelayResultsListProps {
  teams: ProcessedRunnerModel[]
  isClass: boolean
  setClassClubId: (classOrClubId: string, isClass: boolean) => void
}

const RelayResultItemMemo = memo(RelayResultItem)

/**
 * Sorted list of relay teams, one row per team, and the virtual ticket of the leg the user clicks.
 *
 * @param props.teams The teams of the class or club, in any order.
 * @param props.isClass Whether the list is of a class, not of a club.
 * @param props.setClassClubId Switches the view to another class or club from the ticket.
 */
export default function RelayResultsList({
  teams,
  isClass,
  setClassClubId,
}: RelayResultsListProps) {
  const [isTicketOpen, selectedRunner, handleRowClick, handleCloseTicket, leg] = useVirtualTicket()

  const runnerRowProps = useMemo(
    () => ({
      isClass: isClass,
      handleRowClick: handleRowClick,
    }),
    [isClass, handleRowClick],
  )

  return (
    <>
      <RunnerSorter
        runnerList={teams}
        RunnerRow={RelayResultItemMemo}
        runnerRowProps={runnerRowProps}
        sortingFunction={sortRelayRunners}
      />
      <RelayVirtualTicket
        isTicketOpen={isTicketOpen}
        runner={selectedRunner}
        handleCloseTicket={handleCloseTicket}
        isClass={isClass}
        setClassClubId={setClassClubId}
        leg={leg}
      />
    </>
  )
}
