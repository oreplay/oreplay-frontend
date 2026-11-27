import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import IndividualResult from "../../../../../../components/ResultsList/IndividualResult/IndividualResult.tsx"
import RelayResultColumn from "./components/RelayResultColumn.tsx"
import RelayResultLegs from "./components/RelayResultLegs.tsx"

interface RelayResultItemProps {
  bestOnlineCumulativeSecondsByLeg: ReadonlyMap<number, ReadonlyArray<number | null>> | null
  runner: ProcessedRunnerModel
  handleRowClick: (runner: ProcessedRunnerModel, leg: number) => void
  isClass: boolean
}

/**
 * Result row of a relay team, laid out like every other results row, with one line per leg below
 * it. The legs, not the team, open the virtual ticket.
 *
 * @param props.bestOnlineCumulativeSecondsByLeg Best leg time at every online split, by leg
 * number, or `null` when there is nothing to compare with, as in club view.
 * @param props.runner The team, with its leg runners in `runners`.
 * @param props.handleRowClick Called with the team and the leg number when a leg is clicked.
 * @param props.isClass Whether the list is of a class, not of a club.
 */
export default function RelayResultItem({
  bestOnlineCumulativeSecondsByLeg,
  runner,
  handleRowClick,
  isClass,
}: RelayResultItemProps) {
  return (
    <IndividualResult
      runner={runner}
      isClass={isClass}
      ResultColumn={RelayResultColumn}
      details={
        <RelayResultLegs
          bestOnlineCumulativeSecondsByLeg={bestOnlineCumulativeSecondsByLeg}
          team={runner}
          onLegClick={handleRowClick}
        />
      }
    />
  )
}
