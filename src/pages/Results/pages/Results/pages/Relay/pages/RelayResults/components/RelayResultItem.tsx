import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../../../../shared/functions.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../../shared/constants.ts"
import FlexCol from "../../../../../../../components/FlexCol.tsx"
import RacePosition from "../../../../../../../components/RacePosition..tsx"
import { runnerService } from "../../../../../../../../../domain/services/RunnerService.ts"
import { useTranslation } from "react-i18next"
import ParticipantName from "../../../../../../../components/ParticipantName.tsx"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import RaceTimeBehind from "../../../../../../../components/RaceTimeBehind.tsx"
import RelayResultLegItem from "./RelayResultLegItem.tsx"
import { Box } from "@mui/material"
import ResultListItem from "../../../../../../../components/ResultsList/ResultListItem.tsx"
import { RunnerModel } from "../../../../../../../../../shared/EntityTypes.ts"
import { hasChipDownload as hasChipDownloadFunction } from '../../../../../shared/functions.ts'

export default function RelayResultItem({
  runner,
  handleRowClick,
}: {
  runner: ProcessedRunnerModel
  handleRowClick: (runner: RunnerModel) => void
}) {
  const { t } = useTranslation()

  const status = parseResultStatus(runner.overall.status_code as string)
  const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
  const hasChipDownload = hasChipDownloadFunction(runner)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResultListItem key={runner.id}>
        <FlexCol width="10px">
          <RacePosition
            position={runner.overall.position}
            hasDownload={hasChipDownload}
            isNC={status === RESULT_STATUS_TEXT.nc}
          />
        </FlexCol>
        <ParticipantName name={runner.full_name} subtitle={runnerService.getClubName(runner, t)} />
        <FlexCol flexGrow={1}>
          <RaceTime
            displayStatus
            isFinalTime={hasChipDownload}
            status={status}
            finish_time={runner.overall.finish_time}
            time_seconds={runner.overall.time_seconds}
            start_time={runner.overall.start_time}
          />
          <RaceTimeBehind
            display={statusOkOrNc && runner.overall.finish_time != null && hasChipDownload}
            time_behind={runner.overall.time_behind}
          />
        </FlexCol>
      </ResultListItem>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {runner.runners?.map((runner, index) => (
          <RelayResultLegItem key={runner.id} runner={runner} handleRowClick={handleRowClick} legNumber={runner.leg_number} />
        ))}
      </Box>
    </Box>
  )
}
