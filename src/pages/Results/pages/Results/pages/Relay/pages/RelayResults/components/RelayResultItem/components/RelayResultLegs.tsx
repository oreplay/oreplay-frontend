import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import RelayResultLegItem from "./RelayResultLegItem.tsx"

interface RelayResultLegsProps {
  bestOnlineCumulativeSecondsByLeg: ReadonlyMap<number, ReadonlyArray<number | null>> | null
  team: ProcessedRunnerModel
  onLegClick: (team: ProcessedRunnerModel, leg: number) => void
}

/**
 * Lists the legs of a relay team under its result row. The list cancels the row's horizontal
 * padding, so each leg, padded as a row itself, lines up with the team's position, name and time
 * and highlights across the whole row width.
 *
 * @param props.bestOnlineCumulativeSecondsByLeg Best leg time at every online split, by leg
 * number, or `null` when there is nothing to compare with, as in club view.
 * @param props.team The team, with its leg runners in `runners`; no lines when it has none.
 * @param props.onLegClick Called with the team and the leg number when a leg is clicked.
 */
export default function RelayResultLegs({
  bestOnlineCumulativeSecondsByLeg,
  team,
  onLegClick,
}: RelayResultLegsProps) {
  return (
    <div className="-mx-2 flex flex-col">
      {team.runners?.map((legRunner) => (
        <RelayResultLegItem
          bestOnlineCumulativeSeconds={
            bestOnlineCumulativeSecondsByLeg?.get(legRunner.leg_number) ?? null
          }
          key={legRunner.id}
          team={team}
          legParticipant={legRunner}
          onClick={onLegClick}
        />
      ))}
    </div>
  )
}
