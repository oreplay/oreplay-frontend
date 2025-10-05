import { ResultColumnProps } from "../../../../../../../components/ResultsList/IndividualResult/individualResult.tsx"
import { formatScoreAsInteger } from "../../../../../../../../../../../shared/Functions.tsx"
import { Box, Typography } from "@mui/material"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import { hasChipDownload } from "../../../../../../../shared/functions.ts"
import { parseResultStatus } from "../../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { runnerService } from "../../../../../../../../../../../domain/services/RunnerService.ts"

export default function RogaineResultItemRowColumnResult(props: ResultColumnProps) {
  const runnerResult = props.runner.stage
  const statusOkOrNc = runnerService.isOK(props.runner) || runnerService.isNC(props.runner)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <Typography component={"span"}>
        {statusOkOrNc
          ? runnerResult.points_final || runnerResult.finish_time
            ? `${formatScoreAsInteger(runnerResult.points_final)}`
            : ""
          : ""}
      </Typography>
      <RaceTime
        displayStatus
        status={parseResultStatus(props.runner.stage.status_code as string)}
        isFinalTime={hasChipDownload(runnerResult)}
        start_time={runnerResult.start_time}
        finish_time={runnerResult.finish_time}
        time_seconds={runnerResult.time_seconds}
      />
    </Box>
  )
}
