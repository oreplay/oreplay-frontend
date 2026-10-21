import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import { hasChipDownload } from "../../../../../../../shared/functions.ts"

type RunnerRaceTimeProps = {
  runner: ProcessedRunnerModel
}

/**
 * Race time of a rogaine runner, or their status when the result is not valid.
 *
 * @param props.runner The runner whose time is shown.
 */
export default function RunnerRaceTime({ runner }: RunnerRaceTimeProps) {
  const result = runner.stage

  return (
    <RaceTime
      displayStatus
      isFinalTime={hasChipDownload(runner)}
      status={parseResultStatus(result.status_code ?? "")}
      finish_time={result.finish_time}
      time_seconds={result.time_seconds}
      start_time={result.start_time}
    />
  )
}
