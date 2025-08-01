import { DateTime } from "luxon"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS_PRIORITY } from "../../../../../shared/constants.ts"
import { RunnerState } from "../../../../../../../shared/EntityTypes.ts"

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

function analyseRunner(runner: ProcessedRunnerModel, now: DateTime): RunnerState {
  const stage = runner.stage

  const startDt = stage.start_time ? DateTime.fromISO(stage.start_time) : null
  const hasStarted: boolean = !!startDt && now >= startDt
  const hasFinished: boolean = !!stage.finish_time
  let currentRaceTime: number
  if (hasStarted) {
    currentRaceTime = hasFinished ? stage.time_seconds : now.diff(startDt!, "seconds").as("seconds") // startDt! asegura a TypeScript que no es null
  } else {
    currentRaceTime = Infinity
  }

  const position = stage.position ?? 0
  const isFinished = !!stage.finish_time && position > 0

  const controlTimes: Record<number, number> = {}
  let lastPassedControl = 0
  let lastPassedTime: number | null = null
  let nextControl: number | null = null
  let nextControlReadingTime: DateTime | null = null

  if (stage.online_splits?.length) {
    stage.online_splits.forEach((split) => {
      if (split.order_number != null && split.time != null) {
        controlTimes[split.order_number] = split.time
        if (split.order_number >= lastPassedControl && split.order_number !== Infinity) {
          lastPassedControl = split.order_number
          lastPassedTime = split.time
        }
      }
      if (split.is_next && split.order_number != null && split.order_number !== Infinity) {
        nextControl = split.order_number
        nextControlReadingTime = split.is_next
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
    nextControl,
    nextControlReadingTime,
  }
}

function compareRunners(a: RunnerState, b: RunnerState): number {
  const statusDiff = getResultStatusPriority(a.statusCode) - getResultStatusPriority(b.statusCode)
  if (statusDiff !== 0) return statusDiff

  if (a.isFinished && b.isFinished) {
    return a.position - b.position
  }

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

  return compareSplitBySplit(a, b)
}

function compareSplitBySplit(a: RunnerState, b: RunnerState): number {
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

  // Compare runner A going to a control already passed by B
  if (!a.isFinished && a.nextControl && b.controlTimes[a.nextControl] != null) {
    const bTimeAtControl = b.controlTimes[a.nextControl]
    if (a.currentRaceTime < bTimeAtControl) return -1
    if (a.currentRaceTime > bTimeAtControl) return 1
  }

  // Compare runner B going to a control already passed by A
  if (!b.isFinished && b.nextControl && a.controlTimes[b.nextControl] != null) {
    const aTimeAtControl = a.controlTimes[b.nextControl]
    if (b.currentRaceTime < aTimeAtControl) return 1
    if (b.currentRaceTime > aTimeAtControl) return -1
  }

  if (!a.isFinished && !b.isFinished) {
    if (a.nextControl && !b.nextControl) return -1
    if (!a.nextControl && b.nextControl) return 1

    if (a.lastPassedControl !== b.lastPassedControl) {
      return b.lastPassedControl - a.lastPassedControl
    }

    if (a.nextControl && b.nextControl && a.nextControlReadingTime && b.nextControlReadingTime) {
      const timeDiff = b.nextControlReadingTime
        .diff(a.nextControlReadingTime, "seconds")
        .as("seconds")
      if (timeDiff !== 0) return timeDiff
    }
  }

  return a.currentRaceTime - b.currentRaceTime
}

function handleRunnersWithoutSplits(a: RunnerState, b: RunnerState): number {
  if (a.isFinished !== b.isFinished) return a.isFinished ? -1 : 1
  if (a.isFinished && b.isFinished) return a.position - b.position

  if (a.hasStarted && b.hasStarted) return a.currentRaceTime - b.currentRaceTime

  if (!a.hasStarted && !b.hasStarted) {
    const aStart = a.runner.stage.start_time
      ? DateTime.fromISO(a.runner.stage.start_time).toMillis()
      : Infinity
    const bStart = b.runner.stage.start_time
      ? DateTime.fromISO(b.runner.stage.start_time).toMillis()
      : Infinity
    return aStart - bStart
  }

  return a.hasStarted ? -1 : 1
}
