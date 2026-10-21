import { ResultColumnProps } from "../../../../../../../components/ResultsList/IndividualResult/IndividualResult.tsx"
import RaceTimeBehind from "../../../../../../../components/RaceTimeBehind.tsx"
import { runnerService } from "../../../../../../../../../../../domain/services/RunnerService.ts"
import { hasChipDownload as hasChipDownloadFunction } from "../../../../../../../shared/functions.ts"
import RelayRaceTime from "../../RelayRaceTime/RelayRaceTime.tsx"

/**
 * Result column of a relay team: its time, live while the team is racing, with the time behind the
 * winner below it, as the FootO result column does for a runner.
 *
 * @param props.runner The team whose result is shown.
 */
export default function RelayResultColumn({ runner }: ResultColumnProps) {
  const statusOkOrNc = runnerService.isOK(runner) || runnerService.isNC(runner)
  const hasChipDownload = hasChipDownloadFunction(runner)

  return (
    <div className="flex flex-col items-end">
      <RelayRaceTime displayStatus isFinalTime={hasChipDownload} runner={runner} />
      <RaceTimeBehind
        display={statusOkOrNc && runnerService.hasFinished(runner) && hasChipDownload}
        time_behind={runner.stage.time_behind}
      />
    </div>
  )
}
