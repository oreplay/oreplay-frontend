import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS_PRIORITY } from "../../../../../shared/constants.ts"
import { DateTime } from "luxon"
import { RunnerStatus } from "../../../../../../../shared/EntityTypes.ts"

// This function returns the priority of a runner's status based on a predefined priority map.
// If the status is not found in the map, it defaults to 99 (lowest priority).
export function getResultStatusPriority(status: string): number {
  return RESULT_STATUS_PRIORITY[status] ?? 99
}

// Main sorting function: takes an array of runner models and returns them sorted according to race logic.
export function sortFootORunners(runnerList: ProcessedRunnerModel[]): ProcessedRunnerModel[] {
  const now = DateTime.now()

  // Analyze each runner to extract detailed status information at the current time.
  const runnerStatuses: RunnerStatus[] = runnerList.map((runner) =>
    analyzeRunnerStatus(runner, now),
  )

  // Sort the analyzed runner statuses with the custom comparator.
  runnerStatuses.sort((a, b) => compareRunnersNormal(a, b))

  // Return only the original runner models, but now sorted.
  return runnerStatuses.map((r) => r.runner)
}

// This function analyzes a single runner's current race status given the current time.
// It calculates:
// - Whether the runner has started (based on start time vs current time)
// - Whether the runner has finished (based on finish time presence)
// - The finish time (total race time if finished)
// - The last passed control and time recorded there
// - The current accumulated time (max of last split time or current race time)
// - The duration (difference between finish and start, adjusted for the day's start)
// Returns a RunnerStatus object with these details for further sorting logic.
function analyzeRunnerStatus(runner: ProcessedRunnerModel, currentTime: DateTime): RunnerStatus {
  const startTime = runner.stage.start_time ? DateTime.fromISO(runner.stage.start_time) : null
  const currentRaceTime = startTime ? currentTime.diff(startTime, "seconds").seconds : Infinity
  const hasStarted = currentRaceTime >= 0

  const isFinished = !!(runner.stage.finish_time && runner.stage.time_seconds)
  const finishTime = isFinished ? runner.stage.time_seconds : null

  let lastPassedControl = 0
  let lastPassedTime: number | null = null

  if (runner.stage.online_splits && runner.stage.online_splits.length > 0) {
    // Sort splits by order and find the last one with a recorded time.
    const sortedSplits = runner.stage.online_splits
      .filter((split) => split.order_number !== null)
      .sort((a, b) => a.order_number! - b.order_number!)

    for (const split of sortedSplits) {
      if (split.time !== null) {
        lastPassedControl = split.order_number!
        lastPassedTime = split.time
      } else {
        break
      }
    }
  }

  // Get the time of the last recorded split or 0 if none.
  const lastSplitTime =
    runner.stage.online_splits && runner.stage.online_splits.length > 0
      ? (runner.stage.online_splits[runner.stage.online_splits.length - 1].time ?? 0)
      : 0

  // The current accumulated time is the max of the last split time or the total race time so far.
  const currentAccumulatedTime = Math.max(lastSplitTime, currentRaceTime)

  // Calculate total duration if the runner has finished and data is available.
  const duration =
    runner.stage.status_code === "3" && finishTime !== null && startTime !== null
      ? finishTime - startTime.diff(startTime.startOf("day"), "seconds").seconds
      : undefined

  return {
    runner,
    currentRaceTime,
    currentAccumulatedTime,
    isFinished,
    finishTime,
    lastPassedControl,
    lastPassedTime,
    hasStarted,
    statusCode: runner.stage.status_code ?? "0",
    duration,
  }
}

// Comparator function that implements the custom sorting logic for runners based on their race status.
// The main sorting criteria:
// 1. Sort by the priority of the runner's status code (lower priority value first).
// 2. Runners who haven't started yet go to the bottom, sorted by their currentRaceTime.
// 3. Finished runners are sorted by their finish time.
// 4. If comparing a finished runner with a runner still racing, logic decides relative order based on times.
// 5. Runners currently racing are ordered based on last passed control and times at splits.
// 6. If no splits passed, order by current race time.
function compareRunnersNormal(a: RunnerStatus, b: RunnerStatus): number {
  const priorityA = getResultStatusPriority(a.statusCode)
  const priorityB = getResultStatusPriority(b.statusCode)

  if (priorityA !== priorityB) {
    return priorityA - priorityB
  }

  // Both runners have not started yet, order by their current race time (usually large).
  if (!a.hasStarted && !b.hasStarted) {
    return a.currentRaceTime - b.currentRaceTime
  }
  // One runner has not started, so that runner goes after the one who started.
  if (!a.hasStarted) return 1
  if (!b.hasStarted) return -1

  const aHasControls = a.lastPassedControl > 0
  const bHasControls = b.lastPassedControl > 0

  // If both finished, order by finishTime (total race time).
  if (a.isFinished && b.isFinished) {
    return a.finishTime! - b.finishTime!
  }

  // If one finished and the other is racing:
  // If the racer's current time is less than the finisher’s finish time, racer is ahead.
  if (a.isFinished && !b.isFinished) {
    const bTime = bHasControls ? b.currentAccumulatedTime : b.currentRaceTime
    return bTime < a.finishTime! ? -1 : 1
  }
  if (!a.isFinished && b.isFinished) {
    const aTime = aHasControls ? a.currentAccumulatedTime : a.currentRaceTime
    return aTime < b.finishTime! ? -1 : 1
  }

  // Both currently racing:
  // If neither has passed any controls, order by current race time.
  if (!aHasControls && !bHasControls) {
    return a.currentRaceTime - b.currentRaceTime
  }
  // If only one has passed controls, that runner is ahead.
  if (aHasControls && !bHasControls) return -1
  if (!aHasControls && bHasControls) return 1

  // Both passed controls: order by number of controls passed.
  if (a.lastPassedControl !== b.lastPassedControl) {
    if (a.lastPassedControl < b.lastPassedControl) {
      const aTime = a.currentAccumulatedTime
      const bTime = b.lastPassedTime ?? b.currentAccumulatedTime
      return aTime < bTime ? -1 : 1
    } else {
      const bTime = b.currentAccumulatedTime
      const aTime = a.lastPassedTime ?? a.currentAccumulatedTime
      return bTime < aTime ? 1 : -1
    }
  }

  // If the number of controls is equal, order by the time at last passed control.
  if (a.lastPassedTime !== null && b.lastPassedTime !== null) {
    return a.lastPassedTime - b.lastPassedTime
  }

  // As a last resort, order by current accumulated time.
  return a.currentAccumulatedTime - b.currentAccumulatedTime
}
