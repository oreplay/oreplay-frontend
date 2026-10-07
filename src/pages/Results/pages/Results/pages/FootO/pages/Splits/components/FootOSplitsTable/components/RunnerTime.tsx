import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import RaceTimeBehind from "../../../../../../../components/RaceTimeBehind.tsx"
import { hasChipDownload } from "../../../../../../../shared/functions.ts"
import { getRunnerStatus, showsRunnerTimeBehind } from "../shared/splitsTableRunner.ts"

type RunnerTimeProps = {
  runner: ProcessedRunnerModel
}

export default function RunnerTime({ runner }: RunnerTimeProps) {
  const result = runner.stage

  return (
    <>
      <RaceTime
        displayStatus
        isFinalTime={hasChipDownload(runner)}
        status={getRunnerStatus(runner)}
        finish_time={result.finish_time}
        time_seconds={result.time_seconds}
        start_time={result.start_time}
      />
      {showsRunnerTimeBehind(runner) && <RaceTimeBehind time_behind={result.time_behind} display />}
    </>
  )
}
