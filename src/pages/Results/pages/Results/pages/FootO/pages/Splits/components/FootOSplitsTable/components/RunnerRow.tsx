import {
  ProcessedRunnerModel,
  RadioSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { TableCell, TableRow } from "@mui/material"
import { parseResultStatus } from "../../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { useTranslation } from "react-i18next"
import { runnerService } from "../../../../../../../../../../../domain/services/RunnerService.ts"
import ParticipantName from "../../../../../../../../../components/ParticipantName.tsx"
import RaceTime from "../../../../../../../../../components/RaceTime.tsx"
import { RESULT_STATUS_TEXT } from "../../../../../../../../../shared/constants.ts"
import RunnerSplit from "./RunnerSplit.tsx"
import RunnerOnlineSplit from "./RunnerOnlineSplit.tsx"
import { getOnlineSplits } from "../shared/footOSplitsTablefunctions.ts"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import RaceTimeBehind from "../../../../../../../../../components/RaceTimeBehind.tsx"
import { hasChipDownload as hasChipDownloadFunction } from "../../../../../../../shared/functions.ts"
import RacePosition from "../../../../../../../../../components/RacePosition..tsx"

type RunnerRowProps = {
  runner: ProcessedRunnerModel
  showCumulative?: boolean
  onlyRadios?: boolean
  radiosList: OnlineControlModel[]
}

const extractRunnerResult = (runner: ProcessedRunnerModel) => runner.stage

export default function RunnerRow(props: RunnerRowProps) {
  const { t } = useTranslation()
  const result = extractRunnerResult(props.runner)

  const status = parseResultStatus(result.status_code as string)
  const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
  const hasChipDownload = hasChipDownloadFunction(props.runner)

  const splits = props.onlyRadios
    ? getOnlineSplits(result.splits, props.radiosList, result.start_time)
    : result.splits

  return (
    <TableRow key={props.runner.id} sx={{ padding: "none" }}>
      <TableCell key={`pos${props.runner.id}`} sx={{ width: "10px", align: "right" }}>
        <RacePosition
          position={props.runner.stage.position}
          isNC={props.runner.is_nc || status === RESULT_STATUS_TEXT.nc}
          hasDownload={hasChipDownload}
        />
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
          isFinalTime={hasChipDownload}
          status={status}
          finish_time={result.finish_time}
          time_seconds={result.time_seconds}
          start_time={result.start_time}
        />
        <RaceTimeBehind
          display={statusOkOrNc && result.finish_time != null && hasChipDownload}
          time_behind={result.time_behind}
        />
      </TableCell>
      {splits.map((split) => (
        <TableCell key={`split${props.runner.id}${split.id}`}>
          {props.onlyRadios ? (
            <RunnerOnlineSplit
              split={split as RadioSplitModel}
              startTimeTimestamp={props.runner.stage.start_time}
            />
          ) : (
            <RunnerSplit
              showCumulative={props.showCumulative}
              key={`runnerSplit${props.runner.id}${split.id}}`}
              split={split}
            />
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}
