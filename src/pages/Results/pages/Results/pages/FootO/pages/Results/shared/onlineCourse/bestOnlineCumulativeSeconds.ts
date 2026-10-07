import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

function isContender(runner: ProcessedRunnerModel) {
  return runnerService.isOK(runner) && !runnerService.isNC(runner)
}

function onlineSplitCount(runner: ProcessedRunnerModel) {
  return runner.stage.online_splits?.length ?? 0
}

function cumulativeSecondsAt(runner: ProcessedRunnerModel, splitIndex: number) {
  return runner.stage.online_splits?.[splitIndex]?.cumulative_time ?? null
}

function lowestOrNull(values: (number | null)[]) {
  const readings = values.filter((value) => value !== null)
  return readings.length > 0 ? Math.min(...readings) : null
}

export default function bestOnlineCumulativeSeconds(
  runners: ProcessedRunnerModel[],
): (number | null)[] {
  const contenders = runners.filter(isContender)
  const splitCount = Math.max(0, ...runners.map(onlineSplitCount))

  return Array.from({ length: splitCount }, (_, splitIndex) =>
    lowestOrNull(contenders.map((runner) => cumulativeSecondsAt(runner, splitIndex))),
  )
}
