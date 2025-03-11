import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { TableCell, TableRow, Typography } from "@mui/material"
import { getPositionOrNc, parseResultStatus } from "../../../../../../../../../shared/functions.ts"
import { useTranslation } from "react-i18next"
import { runnerService } from "../../../../../../../../../../../domain/services/RunnerService.ts"
import ParticipantName from "../../../../../../../../../components/ParticipantName.tsx"
import RaceTime from "../../../../../../../../../components/RaceTime.tsx"
import { RESULT_STATUS_TEXT } from "../../../../../../../../../shared/constants.ts"
import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"
import RunnerSplit from "./RunnerSplit.tsx"

type RunnerRowProps = {
  runner: ProcessedRunnerModel
  showDiffs?: boolean
}

const extractRunnerResult = (runner: ProcessedRunnerModel) => runner.overall

export default function RunnerRow(props: RunnerRowProps) {
  const { t } = useTranslation()
  const result = extractRunnerResult(props.runner)

  const status = parseResultStatus(result.status_code as string)
  const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc

  return (
    <TableRow key={props.runner.id} sx={{ padding: "none" }}>
      <TableCell key={`pos${props.runner.id}`} sx={{ width: "10px", align: "right" }}>
        <Typography sx={{ color: "primary.main" }}>{getPositionOrNc(props.runner, t)}</Typography>
      </TableCell>
      <TableCell key={`name${props.runner.id}`}>
        <ParticipantName
          name={props.runner.full_name}
          subtitle={runnerService.getClubName(props.runner, t)}
        />
      </TableCell>
      <TableCell key={`time${props.runner.id}`}>
        <RaceTime
          key={`raceTime${props.runner.id}`}
          displayStatus
          status={status}
          finish_time={result.finish_time}
          time_seconds={result.time_seconds}
          start_time={result.start_time}
        />
        <Typography key={`diff${props.runner.id}`} sx={{ color: "primary.main", fontSize: 14 }}>
          {statusOkOrNc && result.finish_time != null
            ? `+${parseSecondsToMMSS(result.time_behind.toString())}`
            : ""}
        </Typography>
      </TableCell>
      {result.splits.map((split) => (
        <TableCell key={`split${props.runner.id}${split.id}`}>
          <RunnerSplit
            displayDiffs={props.showDiffs}
            key={`runnerSplit${props.runner.id}${split.id}}`}
            split={split}
          />
        </TableCell>
      ))}
    </TableRow>
  )
}
