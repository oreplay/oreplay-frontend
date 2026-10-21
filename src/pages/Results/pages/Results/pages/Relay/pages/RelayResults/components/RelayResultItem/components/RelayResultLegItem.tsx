import { Typography } from "@mui/material"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import ResultListItem from "../../../../../../../components/ResultsList/ResultListItem.tsx"
import { parseResultStatus } from "../../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import {
  ProcessedRunnerModel,
  ProcessedTeamRunnerModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import RelayRaceTime from "../../RelayRaceTime/RelayRaceTime.tsx"
import RelayResultLegNumber from "./RelayResultLegNumber.tsx"
import RelayResultLegTime from "./RelayResultLegTime.tsx"

const LEG_TEXT_STYLE = { fontSize: "small" }

interface RelayResultLegItemProps {
  legParticipant: ProcessedTeamRunnerModel
  team: ProcessedRunnerModel
  onClick: (team: ProcessedRunnerModel, leg: number) => void
}

/**
 * One leg of a relay team: its number under the team's position, the runner's name under the
 * team's name, and two fixed-width time columns at the right, the leg time and the team's time at
 * the end of the leg, so they line up across every team of the list.
 *
 * @param props.legParticipant Runner of the leg, with their leg result in `stage`.
 * @param props.team The team the leg belongs to.
 * @param props.onClick Called with the team and the leg number when the leg is clicked.
 */
export default function RelayResultLegItem({
  legParticipant,
  team,
  onClick,
}: RelayResultLegItemProps) {
  const status = parseResultStatus(legParticipant.stage.status_code as string)
  const hasChipDownload = true //hasChipDownloadFunction(runner) // TODO: Uncomment after backend bug fix

  return (
    <ResultListItem onClick={() => onClick(team, legParticipant.leg_number)}>
      <div className="flex min-w-0 grow items-baseline px-0.5">
        <RelayResultLegNumber legNumber={legParticipant.leg_number} />
        <Typography noWrap sx={LEG_TEXT_STYLE}>
          {legParticipant.full_name}
        </Typography>
      </div>
      <div className="flex shrink-0 gap-1 px-0.5">
        <RelayResultLegTime>
          <RaceTime
            displayStatus
            isFinalTime={hasChipDownload}
            status={status}
            finish_time={legParticipant.stage.finish_time}
            time_seconds={legParticipant.stage.time_seconds}
            start_time={legParticipant.stage.start_time}
            style={LEG_TEXT_STYLE}
          />
        </RelayResultLegTime>
        <RelayResultLegTime>
          <RelayRaceTime
            displayStatus
            isFinalTime={hasChipDownload}
            runner={team}
            style={LEG_TEXT_STYLE}
            overallLeg={legParticipant.leg_number}
          />
        </RelayResultLegTime>
      </div>
    </ResultListItem>
  )
}
