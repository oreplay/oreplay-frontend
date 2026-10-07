import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

/**
 * Tells whether a runner counts for the best time of the class.
 *
 * @param runner Runner to check.
 * @returns `true` for a runner with an OK status that is not out of competition.
 */
function isContender(runner: ProcessedRunnerModel) {
  return runnerService.isOK(runner) && !runnerService.isNC(runner)
}

/**
 * Counts the online splits of a runner, the finish included.
 *
 * @param runner Runner to count the online splits of.
 * @returns The number of online splits, `0` when the runner has none.
 */
function onlineSplitCount(runner: ProcessedRunnerModel) {
  return runner.stage.online_splits?.length ?? 0
}

/**
 * Reads the time since the start of a runner at one of their online splits.
 *
 * @param runner Runner to read the time from.
 * @param splitIndex Position of the online split in the course.
 * @returns The time in seconds, or `null` without a reading there.
 */
function cumulativeSecondsAt(runner: ProcessedRunnerModel, splitIndex: number) {
  return runner.stage.online_splits?.[splitIndex]?.cumulative_time ?? null
}

/**
 * Picks the lowest of the values that are not `null`.
 *
 * @param values Values to compare, `null` for a missing one.
 * @returns The lowest value, or `null` when every value is missing.
 */
function lowestOrNull(values: (number | null)[]) {
  const readings = values.filter((value) => value !== null)
  return readings.length > 0 ? Math.min(...readings) : null
}

/**
 * Computes the best time since the start at every online split of a class.
 *
 * Only runners with an OK status that are in competition are taken into account.
 *
 * @param runners Runners of the class.
 * @returns One entry per online split, the finish included: the best time in seconds, or `null`
 * when no contender has a reading there.
 */
export default function bestOnlineCumulativeSeconds(
  runners: ProcessedRunnerModel[],
): (number | null)[] {
  const contenders = runners.filter(isContender)
  const splitCount = Math.max(0, ...runners.map(onlineSplitCount))

  return Array.from({ length: splitCount }, (_, splitIndex) =>
    lowestOrNull(contenders.map((runner) => cumulativeSecondsAt(runner, splitIndex))),
  )
}
