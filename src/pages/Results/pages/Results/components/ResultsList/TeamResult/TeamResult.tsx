import { ResultItemProps } from "../shared/types.ts"
import ResultListItemColumn from "../ResultListItemColumn.tsx"
import RacePosition from "../../RacePosition/RacePosition.tsx"
import { hasChipDownload as hasChipDownloadFunction } from "../../../shared/functions.ts"
import { getRunnerRacePosition } from "../../../shared/racePosition.ts"
import ParticipantName from "../../ParticipantName.tsx"
import ResultListItem from "../ResultListItem.tsx"
import { Typography } from "@mui/material"

/**
 * One team of a results list: its position, its name with its members' names below, and the result
 * column of the result type.
 *
 * @param props.runner The team, with its members in `runners`.
 * @param props.onClick Called with the team when the row is clicked; the row is not clickable
 * without it.
 * @param props.ResultColumn Renders the team's result on the right of the row.
 */
export default function TeamResult({ runner, onClick, ResultColumn }: ResultItemProps) {
  return (
    <ResultListItem key={runner.id} onClick={onClick ? () => onClick(runner) : undefined}>
      <ResultListItemColumn
        slotProps={{
          className: "flex h-full flex-grow flex-row items-start",
        }}
      >
        <RacePosition
          {...getRunnerRacePosition(runner)}
          hasDownload={runner.overalls ? true : hasChipDownloadFunction(runner)}
          slotProps={{ text: { marginRight: 1 } }}
        />
        <div className="min-w-0 flex-grow">
          <ParticipantName name={runner.full_name} />
          {runner.runners?.map((teamMember) => (
            <Typography key={teamMember.id} sx={{ color: "text.secondary", fontSize: "small" }}>
              {teamMember.full_name}
            </Typography>
          ))}
        </div>
      </ResultListItemColumn>
      <ResultListItemColumn>
        <ResultColumn runner={runner} />
      </ResultListItemColumn>
    </ResultListItem>
  )
}
