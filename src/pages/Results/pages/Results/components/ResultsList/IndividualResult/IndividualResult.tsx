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
  subtitle?: string
}

/**
 * Result row of one runner: position, name with its club or class below, the result column at the
 * right, and optional details under the row.
 *
 * @param props.runner Runner of the row.
 * @param props.isClass Whether the list is of a class, so the subtitle is the club; the class
 * otherwise.
 * @param props.onClick Called with the runner when the row is clicked; the row is not clickable
 * without it.
 * @param props.ResultColumn Component drawing the result column.
 * @param props.details Content shown under the row, such as the legs of a team.
 * @param props.subtitle Text under the name in place of the club or class, such as the team of a
 * relay leg.
 */
export default function IndividualResult({
  runner,
  isClass,
  onClick,
  ResultColumn,
  details,
  subtitle,
}: IndividualResultProps) {
  const { t } = useTranslation()
  const clubOrClassName = isClass
    ? runnerService.getClubName(runner, t)
    : runnerService.getClassName(runner)

  return (
    <ResultListItem
      key={runner.id}
      details={details}
      onClick={onClick ? () => onClick(runner) : undefined}
    >
      <ResultListItemColumn
        slotProps={{
          className: "flex h-full grow flex-row items-start",
        }}
      >
        <RacePosition
          {...getRunnerRacePosition(runner)}
          hasDownload={runner.overalls ? true : hasChipDownloadFunction(runner)}
          slotProps={{ text: { marginRight: 1 } }}
        />
        <div className="min-w-0 grow">
          <ParticipantName name={runner.full_name} subtitle={subtitle ?? clubOrClassName} />
        </div>
      </ResultListItemColumn>
      <ResultListItemColumn>
        <ResultColumn runner={runner} />
      </ResultListItemColumn>
    </ResultListItem>
  )
}
