import { ResultItemProps } from "../shared/types.ts"
import ResultListItemColumn from "../ResultListItemColumn.tsx"
import RacePosition from "../../RacePosition.tsx"
import { hasChipDownload as hasChipDownloadFunction } from "../../../shared/functions.ts"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import ParticipantName from "../../ParticipantName.tsx"
import ResultListItem from "../ResultListItem.tsx"

export default function TeamResult({ runner, onClick, ResultColumn }: ResultItemProps) {
  return (
    <ResultListItem key={runner.id} onClick={onClick ? () => onClick(runner) : undefined}>
      <ResultListItemColumn
        slotProps={{
          className: "flex h-full flex-grow flex-row items-start",
        }}
      >
        <RacePosition
          position={runner.overalls ? runner.overalls.overall.position : runner.stage.position}
          hasDownload={runner.overalls ? true : hasChipDownloadFunction(runner)}
          isNC={runnerService.isNC(runner)}
          slotProps={{ text: { marginRight: 1 } }}
        />
        <div className="min-w-0 flex-grow">
          <ParticipantName name={runner.full_name} />
          {runner.runners?.map((teamMember) => (
            <p key={teamMember.id} className="text-sm text-gray-600">
              {teamMember.full_name}
            </p>
          ))}
        </div>
      </ResultListItemColumn>
      <ResultListItemColumn>
        <ResultColumn runner={runner} />
      </ResultListItemColumn>
    </ResultListItem>
  )
}
