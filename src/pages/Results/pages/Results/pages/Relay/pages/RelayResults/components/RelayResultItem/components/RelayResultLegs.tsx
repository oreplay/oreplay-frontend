import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import RelayResultLegItem from "./RelayResultLegItem.tsx"

interface RelayResultLegsProps {
  team: ProcessedRunnerModel
  onLegClick: (team: ProcessedRunnerModel, leg: number) => void
}

/**
 * Lists the legs of a relay team under its result row. The list cancels the row's horizontal
 * padding, so each leg, padded as a row itself, lines up with the team's position, name and time
 * and highlights across the whole row width.
 *
 * @param props.team The team, with its leg runners in `runners`; no lines when it has none.
 * @param props.onLegClick Called with the team and the leg number when a leg is clicked.
 */
export default function RelayResultLegs({ team, onLegClick }: RelayResultLegsProps) {
  return (
    <div className="-mx-2 flex flex-col">
      {team.runners?.map((legRunner) => (
        <RelayResultLegItem
          key={legRunner.id}
          team={team}
          legParticipant={legRunner}
          onClick={onLegClick}
        />
      ))}
    </div>
  )
}
