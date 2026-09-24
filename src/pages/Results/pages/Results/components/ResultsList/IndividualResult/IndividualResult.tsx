import { useTranslation } from "react-i18next"
import { hasChipDownload as hasChipDownloadFunction } from "../../../shared/functions.ts"
import ResultListItem from "../ResultListItem.tsx"
import ResultListItemColumn from "../ResultListItemColumn.tsx"
import RacePosition from "../../RacePosition.tsx"
import ParticipantName from "../../ParticipantName.tsx"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { ResultItemProps } from "../shared/types.ts"

export interface ResultColumnProps {
  runner: ProcessedRunnerModel
}

export default function IndividualResult({
  runner,
  isClass,
  onClick,
  ResultColumn,
}: ResultItemProps) {
  const { t } = useTranslation()

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
          <ParticipantName
            name={runner.full_name}
            subtitle={
              isClass ? runnerService.getClubName(runner, t) : runnerService.getClassName(runner)
            }
          />
        </div>
      </ResultListItemColumn>
      <ResultListItemColumn>
        <ResultColumn runner={runner} />
      </ResultListItemColumn>
    </ResultListItem>
  )
}
