import ResultListItemColumn from "../../../../../../../../components/ResultsList/ResultListItemColumn.tsx"
import RacePosition from "../../../../../../../../components/RacePosition..tsx"
import { RESULT_STATUS_TEXT } from "../../../../../../../../shared/constants.ts"
import { Box } from "@mui/material"
import ParticipantName from "../../../../../../../../components/ParticipantName.tsx"
import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"
import RaceTime from "../../../../../../../../components/RaceTime.tsx"
import RaceTimeBehind from "../../../../../../../../components/RaceTimeBehind.tsx"
import ResultListItem from "../../../../../../../../components/ResultsList/ResultListItem.tsx"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { hasChipDownload as hasChipDownloadFunction } from "../../../../../../shared/functions.ts"
import { useTranslation } from "react-i18next"

export interface FootOResultRowProps {
  runner: ProcessedRunnerModel
  onClick: (runner: ProcessedRunnerModel) => void
  isClass: boolean
}
export default function FootOResultRow({ runner, onClick, isClass }: FootOResultRowProps) {
  const { t } = useTranslation()

  const status = parseResultStatus(runner.stage.status_code as string)
  const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
  const hasChipDownload = hasChipDownloadFunction(runner)

  return (
    <ResultListItem key={runner.id} onClick={() => onClick(runner)}>
      <ResultListItemColumn
        slotProps={{
          box: {
            alignItems: "flex-start",
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            height: "100%",
          },
        }}
      >
        <RacePosition
          position={runner.stage.position}
          hasDownload={hasChipDownload}
          isNC={runner.is_nc || status === RESULT_STATUS_TEXT.nc}
          slotProps={{ text: { marginRight: 1 } }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <ParticipantName
            name={runner.full_name}
            subtitle={
              isClass ? runnerService.getClubName(runner, t) : runnerService.getClassName(runner)
            }
          />
        </Box>
      </ResultListItemColumn>
      <ResultListItemColumn>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <RaceTime
            displayStatus
            isFinalTime={hasChipDownload}
            status={status}
            finish_time={runner.stage.finish_time}
            time_seconds={runner.stage.time_seconds}
            start_time={runner.stage.start_time}
          />
          <RaceTimeBehind
            display={statusOkOrNc && runner.stage.finish_time != null && hasChipDownload}
            time_behind={runner.stage.time_behind}
          />
        </Box>
      </ResultListItemColumn>
    </ResultListItem>
  )
}
