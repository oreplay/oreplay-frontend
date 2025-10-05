import { ResultColumnProps } from "../IndividualResult/individualResult.tsx"
import { Box } from "@mui/material"
import RaceTime from "../../RaceTime.tsx"
import { parseResultStatus } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import RaceTimeBehind from "../../RaceTimeBehind.tsx"
import { hasChipDownload as hasChipDownloadFunction } from "../../../shared/functions.ts"

export default function IndividualResultColumnResultTimeAndDiff(props: ResultColumnProps) {
  const status = parseResultStatus(props.runner.stage.status_code as string)
  const statusOkOrNc = runnerService.isOK(props.runner) || runnerService.isNC(props.runner)
  const hasChipDownload = hasChipDownloadFunction(props.runner)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <RaceTime
        displayStatus
        isFinalTime={hasChipDownload}
        status={status}
        finish_time={props.runner.stage.finish_time}
        time_seconds={props.runner.stage.time_seconds}
        start_time={props.runner.stage.start_time}
      />
      <RaceTimeBehind
        display={statusOkOrNc && runnerService.hasFinished(props.runner) && hasChipDownload}
        time_behind={props.runner.stage.time_behind}
      />
    </Box>
  )
}
