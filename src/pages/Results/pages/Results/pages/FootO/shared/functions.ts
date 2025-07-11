import { DateTime } from "luxon"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS_PRIORITY } from "../../../../../shared/constants.ts"
import { RunnerState } from "../../../../../../../shared/EntityTypes.ts"

  // map status code → ordering priority (lower = better)
export function getResultStatusPriority(code: string): number {
  return RESULT_STATUS_PRIORITY[code] ?? 99
}

export function sortFootORunners(runners: ProcessedRunnerModel[]): ProcessedRunnerModel[] {
  const now = DateTime.now()
  const states: RunnerState[] = runners.map((r) => analyseRunner(r, now))
  states.sort(compareRunners)
  return states.map((s) => s.runner)
}

  // Analyze one runner and cache everything we need for comparisons
function analyseRunner(runner: ProcessedRunnerModel, now: DateTime): RunnerState {
  const stage = runner.stage

  // Start‑time and race‑time
  const startDt = stage.start_time ? DateTime.fromISO(stage.start_time) : null
  const hasStarted = !!startDt && now >= startDt
  const currentRaceTime = hasStarted && startDt ? now.diff(startDt, "seconds").seconds : Infinity

  // Finish detection
  const position = stage.position ?? 0
  const isFinished = position > 0

  // Build RC → time map
  const controlTimes: Record<number, number> = {}
  let lastPassedControl = 0
  let lastPassedTime: number | null = null

  if (stage.online_splits?.length) {
    stage.online_splits.forEach((split) => {
      if (split.order_number != null && split.time != null) {
        controlTimes[split.order_number] = split.time
        if (split.order_number >= lastPassedControl) {
          lastPassedControl = split.order_number
          lastPassedTime = split.time
        }
      }
    })
  }

  return {
    runner,
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
  /** Status priority (DSQ, DNF, DNS, …) */
  const statusDiff = getResultStatusPriority(a.statusCode) - getResultStatusPriority(b.statusCode)

  if (statusDiff !== 0) {
    return statusDiff
  }

  /** Detect whether each runner has radio‑controls */
  const aHasSplits =
    Array.isArray(a.runner.stage.online_splits) && a.runner.stage.online_splits.length > 0
  const bHasSplits =
    Array.isArray(b.runner.stage.online_splits) && b.runner.stage.online_splits.length > 0

    // Neither runner has splits
  if (!aHasSplits && !bHasSplits) {
    // Finished runners first
    if (a.isFinished !== b.isFinished) return a.isFinished ? -1 : 1
    if (a.isFinished && b.isFinished) return a.position - b.position

    // Both have started → shorter time on course first
    const aStarted = a.hasStarted
    const bStarted = b.hasStarted
    if (aStarted && bStarted) return a.currentRaceTime - b.currentRaceTime

    // Both haven't started → earlier planned start first
    if (!aStarted && !bStarted) {
      const aStart = a.runner.stage.start_time
        ? DateTime.fromISO(a.runner.stage.start_time).toMillis()
        : Infinity
      const bStart = b.runner.stage.start_time
        ? DateTime.fromISO(b.runner.stage.start_time).toMillis()
        : Infinity
      return aStart - bStart
    }

    // One started, the other not (shouldn’t reach here, safety net)
    return aStarted ? -1 : 1
  }

    // Only one runner has splits → the one with splits leads
  if (!aHasSplits) return 1
  if (!bHasSplits) return -1

    // Both runners have splits

    // Not‑started runners sink
  if (!a.hasStarted && !b.hasStarted) return a.currentRaceTime - b.currentRaceTime
  if (!a.hasStarted) return 1
  if (!b.hasStarted) return -1

    // Compare last common RC
  const commonControls = Object.keys(a.controlTimes)
    .filter((k) => k in b.controlTimes)
    .map(Number)

  if (commonControls.length) {
    const lastCommon = Math.max(...commonControls)
    const diff = a.controlTimes[lastCommon] - b.controlTimes[lastCommon] // lower → better
    if (diff !== 0) return diff
  }

    // More controls passed wins
  if (a.lastPassedControl !== b.lastPassedControl) return b.lastPassedControl - a.lastPassedControl

    // Both finished → unique position decides
  if (a.isFinished && b.isFinished) return a.position - b.position

    // Final tie‑breaker → shorter elapsed race time
  return a.currentRaceTime - b.currentRaceTime
}
