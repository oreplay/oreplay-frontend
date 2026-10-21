import { useTranslation } from "react-i18next"
import { runnerService } from "../../../../../domain/services/RunnerService.ts"
import { ProcessedRunnerModel } from "../../../components/VirtualTicket/shared/EntityTypes.ts"
import { hasChipDownload, isRunnerNC } from "../shared/functions.ts"
import ParticipantName from "./ParticipantName.tsx"
import RacePosition from "./RacePosition/RacePosition.tsx"
import { ScrollTableRowHeadingProps } from "./ScrollTable/shared/scrollTableProps.ts"

/**
 * Heading of a runner's row in a scroll table: race position, name and club.
 *
 * @param props.row Table row holding the runner it describes.
 */
export default function RunnerHeading({
  row,
}: ScrollTableRowHeadingProps<{ runner: ProcessedRunnerModel }>) {
  const { t } = useTranslation()
  const { runner } = row

  return (
    <>
      <RacePosition
        position={runner.stage.position}
        statusCode={runner.stage.status_code}
        isNC={isRunnerNC(runner)}
        hasDownload={hasChipDownload(runner)}
        slotProps={{ text: { marginRight: 1 } }}
      />
      <ParticipantName name={runner.full_name} subtitle={runnerService.getClubName(runner, t)} />
    </>
  )
}
