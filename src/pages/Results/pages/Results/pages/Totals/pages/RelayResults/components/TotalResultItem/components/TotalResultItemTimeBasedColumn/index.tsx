import { ResultColumnProps } from "../../../../../../../../components/ResultsList/IndividualResult/individualResult.tsx"
import { Box } from "@mui/material"
import RaceTime from "../../../../../../../../components/RaceTime.tsx"
import RaceTimeBehind from "../../../../../../../../components/RaceTimeBehind.tsx"
import { runnerService } from "../../../../../../../../../../../../domain/services/RunnerService.ts"
import { parseResultStatus } from "../../../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { ProcessedOverallModel } from "../../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

export default function TotalResultItemTimeBasedColumn(props: ResultColumnProps) {
  // @ts-expect-error total runners always have non-null overall
  const result: ProcessedOverallModel = props.runner.overalls?.overall

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <RaceTime
        displayStatus
        isFinalTime={true}
        status={parseResultStatus(result.status_code)}
        time_seconds={result.time_seconds}
        finish_time={null}
      />
      <RaceTimeBehind display={runnerService.isOK(props.runner)} time_behind={result.time_behind} />
    </Box>
  )
}
