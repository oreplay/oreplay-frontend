import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { hasChipDownload as hasChipDownloadFunction } from "../../../shared/functions.ts"
import { getRunnerRacePosition } from "../../../shared/racePosition.ts"
import ResultListItem from "../ResultListItem.tsx"
import ResultListItemColumn from "../ResultListItemColumn.tsx"
import RacePosition from "../../RacePosition/RacePosition.tsx"
import ParticipantName from "../../ParticipantName.tsx"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { ResultItemProps } from "../shared/types.ts"

export interface ResultColumnProps {
  runner: ProcessedRunnerModel
}

export interface IndividualResultProps extends ResultItemProps {
  details?: ReactNode
}

export default function IndividualResult({
  runner,
  isClass,
  onClick,
  ResultColumn,
  details,
}: IndividualResultProps) {
  const { t } = useTranslation()

  return (
    <ResultListItem
      key={runner.id}
      details={details}
      onClick={onClick ? () => onClick(runner) : undefined}
    >
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
