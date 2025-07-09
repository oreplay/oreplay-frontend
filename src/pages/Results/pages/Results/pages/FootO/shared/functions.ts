import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { DateTime } from "luxon"

interface RunnerStatus {
  runner: ProcessedRunnerModel
  currentRaceTime: number           // seconds from start_time to now (DateTime.now - start_time)
  currentAccumulatedTime: number    // accumulated time from the last split or fallback to currentRaceTime
  isFinished: boolean
  finishTime: number | null         // runner.stage.time_seconds if finished
  lastPassedControl: number         // amount of last control passed
  lastPassedTime: number | null     // time of last split
  hasStarted: boolean
  statusCode: string                // runner.stage.status_code (e.g. "0", "3", etc)
  duration?: number                 // duration finish_time - start_time for status 3 (internal sorting)
}

export function orderFootRunners(runnerList: ProcessedRunnerModel[]): ProcessedRunnerModel[] {
  const now = DateTime.now()

  const runnerStatuses: RunnerStatus[] = runnerList.map(runner => analyzeRunnerStatus(runner, now))

  // Separate status 3 (timing failure)
  const status3Runners = runnerStatuses.filter(r => r.statusCode === "3")
  const normalRunners = runnerStatuses.filter(r => r.statusCode !== "3")

  // Sort normal runners (includes not started)
  normalRunners.sort((a, b) => compareRunnersNormal(a, b))

  // Sort status 3 at the end
  status3Runners.sort((a, b) => {
    if (a.finishTime !== null && b.finishTime !== null && a.duration !== undefined && b.duration !== undefined) {
      return a.duration - b.duration
    }
    return a.currentAccumulatedTime - b.currentAccumulatedTime
  })

  // Concatenate normal + status 3 at the end
  return [...normalRunners, ...status3Runners].map(r => r.runner)
}

function analyzeRunnerStatus(runner: ProcessedRunnerModel, currentTime: DateTime): RunnerStatus {
  const startTime = runner.stage.start_time ? DateTime.fromISO(runner.stage.start_time) : null
  const currentRaceTime = startTime ? currentTime.diff(startTime, 'seconds').seconds : Infinity
  const hasStarted = currentRaceTime >= 0

  const isFinished = !!(runner.stage.finish_time && runner.stage.time_seconds)
  const finishTime = isFinished ? runner.stage.time_seconds : null

  let lastPassedControl = 0
  let lastPassedTime: number | null = null

  if (runner.stage.online_splits && runner.stage.online_splits.length > 0) {
    const sortedSplits = runner.stage.online_splits
      .filter(split => split.order_number !== null)
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

  const lastSplitTime =
    runner.stage.online_splits && runner.stage.online_splits.length > 0
      ? runner.stage.online_splits[runner.stage.online_splits.length - 1].time ?? 0
      : 0

  const currentAccumulatedTime = Math.max(lastSplitTime, currentRaceTime)

  // For status 3, internal duration (finish_time - start_time) for sorting
  const duration =
    (runner.stage.status_code === "3" && finishTime !== null && startTime !== null)
      ? finishTime - startTime.diff(startTime.startOf('day'), 'seconds').seconds
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

function compareRunnersNormal(a: RunnerStatus, b: RunnerStatus): number {
  // Not started runners go to the end
  if (!a.hasStarted && !b.hasStarted) {
    return a.currentRaceTime - b.currentRaceTime
  }
  if (!a.hasStarted) return 1
  if (!b.hasStarted) return -1

  const aHasControls = a.lastPassedControl > 0
  const bHasControls = b.lastPassedControl > 0

  // Both finished: sort by controls and times (not just finishTime)
  if (a.isFinished && b.isFinished) {
    if (a.lastPassedControl !== b.lastPassedControl) {
      // Similar to in-race logic: fewer controls but better time goes ahead
      if (a.lastPassedControl < b.lastPassedControl) {
        const aTimeToCompare = a.currentAccumulatedTime
        const bTimeToCompare = b.lastPassedTime ?? b.currentAccumulatedTime
        if (aTimeToCompare < bTimeToCompare) {
          return -1
        } else {
          return 1
        }
      } else {
        const bTimeToCompare = b.currentAccumulatedTime
        const aTimeToCompare = a.lastPassedTime ?? a.currentAccumulatedTime
        if (bTimeToCompare < aTimeToCompare) {
          return 1
        } else {
          return -1
        }
      }
    }
    if (a.lastPassedTime !== null && b.lastPassedTime !== null) {
      return a.lastPassedTime - b.lastPassedTime
    }
    return a.currentAccumulatedTime - b.currentAccumulatedTime
  }

  // Mix finished and in-race runners
  if (a.isFinished && !b.isFinished) {
    const bTimeToCompare = bHasControls ? b.currentAccumulatedTime : b.currentRaceTime
    if (bTimeToCompare < a.finishTime!) return 1
    return -1
  }
  if (!a.isFinished && b.isFinished) {
    const aTimeToCompare = aHasControls ? a.currentAccumulatedTime : a.currentRaceTime
    if (aTimeToCompare < b.finishTime!) return -1
    return 1
  }

  // Both in races
  if (!aHasControls && !bHasControls) {
    return a.currentRaceTime - b.currentRaceTime
  }
  if (aHasControls && !bHasControls) return -1
  if (!aHasControls && bHasControls) return 1

  // Both have passed controls: fewer controls but better current time goes ahead
  if (a.lastPassedControl !== b.lastPassedControl) {
    if (a.lastPassedControl < b.lastPassedControl) {
      const aTimeToCompare = a.currentAccumulatedTime
      const bTimeToCompare = b.lastPassedTime ?? b.currentAccumulatedTime
      if (aTimeToCompare < bTimeToCompare) {
        return -1
      } else {
        return 1
      }
    } else {
      const bTimeToCompare = b.currentAccumulatedTime
      const aTimeToCompare = a.lastPassedTime ?? a.currentAccumulatedTime
      if (bTimeToCompare < aTimeToCompare) {
        return 1
      } else {
        return -1
      }
    }
  }

  // Tie in controls: sort by last split time
  if (a.lastPassedTime !== null && b.lastPassedTime !== null) {
    return a.lastPassedTime - b.lastPassedTime
  }

  // Fallback
  return a.currentAccumulatedTime - b.currentAccumulatedTime
}
