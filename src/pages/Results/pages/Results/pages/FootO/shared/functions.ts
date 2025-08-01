import { DateTime } from "luxon"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS_PRIORITY } from "../../../../../shared/constants.ts"
import { RunnerState } from "../../../../../../../shared/EntityTypes.ts"

//TODO: Duplicated code fragment
/**
 * map status code → ordering priority (lower = better)
 */
export function getResultStatusPriority(code: string): number {
  return RESULT_STATUS_PRIORITY[code] ?? 99
}

export function sortFootORunners(runners: ProcessedRunnerModel[]): ProcessedRunnerModel[] {
  const now = DateTime.now()
  const states: RunnerState[] = runners.map((r) => analyseRunner(r, now))
  states.sort(compareRunners)
  return states.map((s) => s.runner)
}

// Analyze one runner and cache everything needed for comparisons
function analyseRunner(runner: ProcessedRunnerModel, now: DateTime): RunnerState {
  const stage = runner.stage

  // Start time and race time calculation
  const startDt = stage.start_time ? DateTime.fromISO(stage.start_time) : null
  const hasStarted: boolean = !!startDt && now >= startDt
  const hasFinished: boolean = !!stage.finish_time
  const currentRaceTime = hasStarted
    ? hasFinished
      ? stage.time_seconds
      : // @ts-expect-error TS2345 hasFinished implicitly checks that startDt is non-null
        now.diff(startDt, "seconds").as("seconds")
    : Infinity

  // Finish detection - use finish_time presence, not position
  const position = stage.position ?? 0
  const isFinished = !!stage.finish_time && position > 0

  // Build control → time map
  const controlTimes: Record<number, number> = {}
  let lastPassedControl = 0
  let lastPassedTime: number | null = null

  if (stage.online_splits?.length) {
    stage.online_splits.forEach((split) => {
      if (split.order_number != null && split.time != null) {
        controlTimes[split.order_number] = split.time
        if (split.order_number >= lastPassedControl && split.order_number !== Infinity) {
          lastPassedControl = split.order_number
          lastPassedTime = split.time
        }
      }
    })
  }

  return {
    runner: runner,
    statusCode: stage.status_code ?? "0",
    hasStarted,
    isFinished,
    position,
    currentRaceTime,
    lastPassedControl,
    lastPassedTime,
    controlTimes,
  }
}

function compareRunners(a: RunnerState, b: RunnerState): number {
  // Priority by status (DSQ, DNF, DNS, etc)
  const statusDiff = getResultStatusPriority(a.statusCode) - getResultStatusPriority(b.statusCode)
  if (statusDiff !== 0) return statusDiff

  // If both finished, sort only by position (ignoring splits)
  if (a.isFinished && b.isFinished) {
    return a.position - b.position
  }

  // Check for splits presence
  const aHasSplits = Object.keys(a.controlTimes).length > 0
  const bHasSplits = Object.keys(b.controlTimes).length > 0
  if (!aHasSplits && !bHasSplits) {
    return handleRunnersWithoutSplits(a, b)
  }
  if (!aHasSplits) return 1
  if (!bHasSplits) return -1

  if (!a.hasStarted && !b.hasStarted) return a.currentRaceTime - b.currentRaceTime
  if (!a.hasStarted) return 1
  if (!b.hasStarted) return -1

  // General case with splits
  return compareSplitBySplit(a, b)
}

/**
 * Compare two runners split by split, regardless of finish status
 * NOTE: both finished runners do not reach this point (handled before)
 */
function compareSplitBySplit(a: RunnerState, b: RunnerState): number {
  // Get sorted list of common splits (excluding finish control)
  const aSplits = Object.keys(a.controlTimes)
    .map(Number)
    .filter((n) => n !== Infinity)
  const bSplits = Object.keys(b.controlTimes)
    .map(Number)
    .filter((n) => n !== Infinity)
  const commonSplits = aSplits.filter((s) => bSplits.includes(s)).sort((x, y) => x - y)

  for (const splitNum of commonSplits) {
    const diff = a.controlTimes[splitNum] - b.controlTimes[splitNum]
    if (diff !== 0) return diff
  }

  // Tie on common splits:

  // If both are running, more controls passed wins
  if (!a.isFinished && !b.isFinished) {
    if (a.lastPassedControl !== b.lastPassedControl) {
      return b.lastPassedControl - a.lastPassedControl
    }
  }

  // Finally, break tie by current race time
  return a.currentRaceTime - b.currentRaceTime
}

function handleRunnersWithoutSplits(a: RunnerState, b: RunnerState): number {
  // Finished runners first, sorted by position
  if (a.isFinished !== b.isFinished) return a.isFinished ? -1 : 1
  if (a.isFinished && b.isFinished) return a.position - b.position

  // Both started → shorter race time first
  if (a.hasStarted && b.hasStarted) return a.currentRaceTime - b.currentRaceTime

  // Both not started → earlier planned start time first
  if (!a.hasStarted && !b.hasStarted) {
    const aStart = a.runner.stage.start_time
      ? DateTime.fromISO(a.runner.stage.start_time).toMillis()
      : Infinity
    const bStart = b.runner.stage.start_time
      ? DateTime.fromISO(b.runner.stage.start_time).toMillis()
      : Infinity
    return aStart - bStart
  }

  // One started, the other not
  return a.hasStarted ? -1 : 1
}
