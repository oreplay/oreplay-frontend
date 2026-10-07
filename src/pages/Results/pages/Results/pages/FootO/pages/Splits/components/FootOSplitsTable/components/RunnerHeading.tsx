import { useTranslation } from "react-i18next"
import { runnerService } from "../../../../../../../../../../../domain/services/RunnerService.ts"
import ParticipantName from "../../../../../../../components/ParticipantName.tsx"
import RacePosition from "../../../../../../../components/RacePosition.tsx"
import { hasChipDownload } from "../../../../../../../shared/functions.ts"
import { isRunnerNotCompeting } from "../shared/splitsTableRunner.ts"
import { SplitsTableRow } from "../shared/splitsTableRows.ts"
import { ScrollTableRowHeadingProps } from "./ScrollTable/shared/scrollTableProps.ts"

export default function RunnerHeading({ row }: ScrollTableRowHeadingProps<SplitsTableRow>) {
  const { t } = useTranslation()
  const { runner } = row

  return (
    <>
      <RacePosition
        position={runner.stage.position}
        isNC={isRunnerNotCompeting(runner)}
        hasDownload={hasChipDownload(runner)}
        slotProps={{ text: { marginRight: 1 } }}
      />
      <ParticipantName name={runner.full_name} subtitle={runnerService.getClubName(runner, t)} />
    </>
  )
}
