import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getRunnerCleanTimeLabel } from "../shared/splitsTableRunner.ts"
import useSplitsTableContent from "../shared/useSplitsTableContent.ts"

type RunnerCleanTimeProps = {
  runner: ProcessedRunnerModel
}

export default function RunnerCleanTime({ runner }: RunnerCleanTimeProps) {
  const { timeLossResults } = useSplitsTableContent()

  return getRunnerCleanTimeLabel(runner, timeLossResults)
}
