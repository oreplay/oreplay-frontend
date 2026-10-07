import {
  ProcessedRunnerModel,
  ProcessedSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getSplitTimeLoss, isRunnerOkOrNotCompeting } from "../shared/splitsTableRunner.ts"
import { isRadioSplit } from "../shared/splitsTableRows.ts"
import useSplitsTableContent from "../shared/useSplitsTableContent.ts"
import RunnerOnlineSplit from "./RunnerOnlineSplit.tsx"
import RunnerSplit from "./RunnerSplit.tsx"

type RunnerControlSplitProps = {
  runner: ProcessedRunnerModel
  split?: ProcessedSplitModel
}

export default function RunnerControlSplit({ runner, split }: RunnerControlSplitProps) {
  const { showCumulative, showTimeLoss, timeLossResults } = useSplitsTableContent()

  if (!split) return null

  if (isRadioSplit(split)) {
    return (
      <RunnerOnlineSplit
        split={split}
        startTimeTimestamp={runner.stage.start_time}
        displayRunningTowards={isRunnerOkOrNotCompeting(runner)}
      />
    )
  }

  const timeLossInfo = showTimeLoss ? getSplitTimeLoss(runner, split, timeLossResults) : null

  return (
    <RunnerSplit
      showCumulative={showCumulative}
      split={split}
      timeLossInfo={timeLossInfo}
      timeLossEnabled={showTimeLoss}
    />
  )
}
