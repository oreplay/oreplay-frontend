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
import { TimeLossResults, getRunnerTimeLossInfo } from "../../utils/timeLossAnalysis.ts"
import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"

type RunnerRowProps = {
  runner: ProcessedRunnerModel
  showCumulative?: boolean
  onlyRadios?: boolean
  radiosList: OnlineControlModel[]
  timeLossResults?: TimeLossResults | null
  timeLossEnabled?: boolean
}

const extractRunnerResult = (runner: ProcessedRunnerModel) => runner.stage

const calculateTotalLossTime = (
  runner: ProcessedRunnerModel,
  timeLossResults: TimeLossResults | null,
): number => {
  if (!timeLossResults) {
    return 0
  }

  let totalLoss = 0

  runner.stage.splits.forEach((split) => {
    if (split.control?.id) {
      const timeLossInfo = getRunnerTimeLossInfo(timeLossResults, runner.id, split.control.id)
      if (timeLossInfo && timeLossInfo.hasTimeLoss) {
        const controlAnalysis = timeLossResults.analysisPerControl.get(split.control.id)
        if (controlAnalysis) {
          const lossTime = timeLossInfo.splitTime - controlAnalysis.estimatedTimeWithoutError
          if (lossTime > 0) {
            totalLoss += lossTime
          }
        }
      }
    }
  })

  return totalLoss
}

export default function RunnerRow(props: RunnerRowProps) {
  const { t } = useTranslation()
  const result = extractRunnerResult(props.runner)

  const status = parseResultStatus(result.status_code as string)
  const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
  const hasChipDownload = hasChipDownloadFunction(props.runner)

  const splits = props.onlyRadios
    ? getOnlineSplits(result.splits, props.radiosList, result.start_time)
    : result.splits

  const excludedStatuses = [
    RESULT_STATUS_TEXT.mp,
    RESULT_STATUS_TEXT.dnf,
    RESULT_STATUS_TEXT.dsq,
    RESULT_STATUS_TEXT.dns,
  ]

  const showTimeBehind = statusOkOrNc && result.finish_time != null && hasChipDownload

  const shouldCalculateCleanTime =
    !excludedStatuses.includes(status) && !props.showCumulative

  const totalLossTime =
    shouldCalculateCleanTime && props.timeLossEnabled
      ? calculateTotalLossTime(props.runner, props.timeLossResults || null)
      : 0

  const cleanTime = result.time_seconds > 0 ? result.time_seconds - totalLossTime : 0

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
        {showTimeBehind && <RaceTimeBehind time_behind={result.time_behind} display={true} />}
      </TableCell>
      {props.timeLossEnabled && !props.showCumulative && (
        <TableCell key={`cleanTime${props.runner.id}`}>
          {result.time_seconds > 0 && cleanTime > 0 && shouldCalculateCleanTime
            ? parseSecondsToMMSS(cleanTime)
            : result.time_seconds > 0
              ? "--"
              : ""}
        </TableCell>
      )}
      {splits.map((split) => {
        const timeLossInfo =
          props.timeLossEnabled &&
          !props.showCumulative &&
          props.timeLossResults &&
          split.control?.id
            ? getRunnerTimeLossInfo(props.timeLossResults, props.runner.id, split.control.id)
            : null

        return (
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
                timeLossInfo={timeLossInfo}
                timeLossEnabled={props.timeLossEnabled && !props.showCumulative}
                timeLossResults={props.timeLossResults}
              />
            )}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
