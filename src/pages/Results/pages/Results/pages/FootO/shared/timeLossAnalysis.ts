import {
  ProcessedRunnerModel,
  ProcessedSplitModel,
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS_TEXT } from "../../../../../shared/constants.ts"
import { parseResultStatus } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import { hasChipDownload } from "../../../shared/functions.ts"

export const FINISH_LEG_ID = "FINISH"
export const FINISH_ORDER_NUMBER = Number.MAX_SAFE_INTEGER

export const MIN_RUNNERS_PER_LEG = 3
export const REFERENCE_MIN_FIELD = 8
export const REFERENCE_QUARTILE_FRACTION = 0.25
export const REFERENCE_TRIM_FASTEST = 1
export const MIN_LEGS_FOR_LEVEL = 3
export const DEFAULT_RUNNER_LEVEL = 1
export const MIN_RUNNER_LEVEL = 0.5
export const MISTAKE_ABSOLUTE_FLOOR_SECONDS = 8
export const MISTAKE_RELATIVE_FLOOR = 0.05

export interface RunnerTimeLossInfo {
  hasTimeLoss: boolean
  timeLoss: number
  splitTime: number
  isTopThree: boolean
  isBest: boolean
  position: number
  rank: number
}

export interface TimeLossAnalysis {
  controlId: string
  orderNumber: number
  bestTime: number
  estimatedTimeWithoutError: number
  runnerAnalysis: Map<string, RunnerTimeLossInfo>
}

export interface TimeLossResults {
  analysisPerControl: Map<string, TimeLossAnalysis>
  globalStats: {
    totalControls: number
    totalSplitsAnalyzed: number
    totalTimeLossDetected: number
  }
}

interface LegEntry {
  runnerId: string
  legTime: number
  orderNumber: number
  position: number | null
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
}

export function computeLegReference(times: number[]): number {
  if (times.length === 0) return 0
  if (times.length < REFERENCE_MIN_FIELD) return Math.min(...times)

  const sorted = [...times].sort((a, b) => a - b)
  const minQuartileSizeAfterTrim = REFERENCE_TRIM_FASTEST + 2
  const quartileSize = Math.max(
    minQuartileSizeAfterTrim,
    Math.round(sorted.length * REFERENCE_QUARTILE_FRACTION),
  )
  return mean(sorted.slice(REFERENCE_TRIM_FASTEST, REFERENCE_TRIM_FASTEST + quartileSize))
}

export function competitionRanks(ascendingLegTimes: number[]): number[] {
  const ranks: number[] = []
  let currentRank = 0
  let previousLegTime: number | null = null
  ascendingLegTimes.forEach((legTime, index) => {
    if (previousLegTime === null || legTime > previousLegTime) currentRank = index + 1
    previousLegTime = legTime
    ranks.push(currentRank)
  })
  return ranks
}

export function computeRunnerLevel(ratios: number[]): number {
  if (ratios.length < MIN_LEGS_FOR_LEVEL) return DEFAULT_RUNNER_LEVEL

  return Math.max(MIN_RUNNER_LEVEL, median(ratios))
}

export function legMistakeFloor(reference: number): number {
  return Math.max(MISTAKE_ABSOLUTE_FLOOR_SECONDS, reference * MISTAKE_RELATIVE_FLOOR)
}

export function computeLegLoss(
  legTime: number,
  reference: number,
  level: number,
  tolerance: number,
): { loss: number; hasTimeLoss: boolean; timeLoss: number } {
  const expectedTime = reference * level
  const loss = Math.max(0, legTime - expectedTime)
  const exceedsTolerance = legTime > expectedTime * (1 + tolerance)
  const exceedsFloor = loss > legMistakeFloor(reference)
  const hasTimeLoss = exceedsTolerance && exceedsFloor
  return { loss, hasTimeLoss, timeLoss: hasTimeLoss ? loss : 0 }
}

function runnerStatus(runner: ProcessedRunnerModel): string {
  return parseResultStatus(runner.stage.status_code ?? "")
}

function isNonCompetitive(runner: ProcessedRunnerModel): boolean {
  return runnerStatus(runner) === RESULT_STATUS_TEXT.nc
}

function isDidNotStart(runner: ProcessedRunnerModel): boolean {
  return runnerStatus(runner) === RESULT_STATUS_TEXT.dns
}

function isAnalyzable(runner: ProcessedRunnerModel): boolean {
  return hasChipDownload(runner) && !isDidNotStart(runner) && !isNonCompetitive(runner)
}

function isCleanFinisher(runner: ProcessedRunnerModel): boolean {
  return runnerStatus(runner) === RESULT_STATUS_TEXT.ok && runner.stage.time_seconds > 0
}

function sortedControlSplits(runner: ProcessedRunnerModel): ProcessedSplitModel[] {
  return runner.stage.splits
    .filter((split) => split.control?.id)
    .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0))
}

function lastCumulativeTime(runner: ProcessedRunnerModel): number | null {
  const splits = sortedControlSplits(runner)
  for (let index = splits.length - 1; index >= 0; index--) {
    const cumulative = splits[index].cumulative_time
    if (cumulative !== null && cumulative > 0) return cumulative
  }
  return null
}

function collectLegEntries(runners: ProcessedRunnerModel[]): Map<string, LegEntry[]> {
  const entriesByLeg = new Map<string, LegEntry[]>()

  const addEntry = (legId: string, entry: LegEntry) => {
    const existing = entriesByLeg.get(legId)
    if (existing) existing.push(entry)
    else entriesByLeg.set(legId, [entry])
  }

  runners.forEach((runner) => {
    sortedControlSplits(runner).forEach((split) => {
      const controlId = split.control?.id
      if (!controlId || split.time === null || split.time <= 0) return
      addEntry(controlId, {
        runnerId: runner.id,
        legTime: split.time,
        orderNumber: split.order_number ?? 0,
        position: split.position,
      })
    })

    const runInTime = finishLegTime(runner)
    if (runInTime !== null) {
      addEntry(FINISH_LEG_ID, {
        runnerId: runner.id,
        legTime: runInTime,
        orderNumber: FINISH_ORDER_NUMBER,
        position: runner.stage.position > 0 ? runner.stage.position : null,
      })
    }
  })

  return entriesByLeg
}

function finishLegTime(runner: ProcessedRunnerModel): number | null {
  if (runner.stage.time_seconds <= 0) return null
  const lastCumulative = lastCumulativeTime(runner)
  if (lastCumulative === null) return null
  const runInTime = runner.stage.time_seconds - lastCumulative
  return runInTime > 0 ? runInTime : null
}

function referencePool(legEntries: LegEntry[], cleanRunnerIds: Set<string>): LegEntry[] {
  const cleanEntries = legEntries.filter((entry) => cleanRunnerIds.has(entry.runnerId))
  return cleanEntries.length >= MIN_RUNNERS_PER_LEG ? cleanEntries : legEntries
}

function buildRunnerLevels(
  entriesByLeg: Map<string, LegEntry[]>,
  legReferences: Map<string, number>,
): Map<string, number> {
  const ratiosByRunner = new Map<string, number[]>()

  entriesByLeg.forEach((entries, legId) => {
    const reference = legReferences.get(legId)
    if (reference === undefined || reference <= 0) return
    entries.forEach((entry) => {
      const ratios = ratiosByRunner.get(entry.runnerId) ?? []
      ratios.push(entry.legTime / reference)
      ratiosByRunner.set(entry.runnerId, ratios)
    })
  })

  const levelByRunner = new Map<string, number>()
  ratiosByRunner.forEach((ratios, runnerId) => {
    levelByRunner.set(runnerId, computeRunnerLevel(ratios))
  })
  return levelByRunner
}

function analyzeLeg(
  legId: string,
  entries: LegEntry[],
  reference: number,
  levelByRunner: Map<string, number>,
  tolerance: number,
): TimeLossAnalysis {
  const rankedEntries = [...entries].sort((a, b) => a.legTime - b.legTime)
  const ranks = competitionRanks(rankedEntries.map((entry) => entry.legTime))
  const runnerAnalysis = new Map<string, RunnerTimeLossInfo>()

  rankedEntries.forEach((entry, index) => {
    const level = levelByRunner.get(entry.runnerId) ?? DEFAULT_RUNNER_LEVEL
    const { hasTimeLoss, timeLoss } = computeLegLoss(entry.legTime, reference, level, tolerance)
    const rank = ranks[index]
    runnerAnalysis.set(entry.runnerId, {
      hasTimeLoss,
      timeLoss,
      splitTime: entry.legTime,
      isBest: rank === 1,
      isTopThree: rank <= 3,
      position: entry.position ?? rank,
      rank,
    })
  })

  return {
    controlId: legId,
    orderNumber: rankedEntries[0].orderNumber,
    bestTime: rankedEntries[0].legTime,
    estimatedTimeWithoutError: reference,
    runnerAnalysis,
  }
}

function emptyResults(): TimeLossResults {
  return {
    analysisPerControl: new Map<string, TimeLossAnalysis>(),
    globalStats: { totalControls: 0, totalSplitsAnalyzed: 0, totalTimeLossDetected: 0 },
  }
}

export function analyzeTimeLoss(
  runners: ProcessedRunnerModel[],
  threshold: number,
): TimeLossResults {
  const tolerance = Math.max(0, threshold) / 100
  const analyzedRunners = runners.filter(isAnalyzable)
  if (analyzedRunners.length === 0) return emptyResults()

  const cleanRunnerIds = new Set(analyzedRunners.filter(isCleanFinisher).map((runner) => runner.id))
  const entriesByLeg = collectLegEntries(analyzedRunners)

  const legReferences = new Map<string, number>()
  entriesByLeg.forEach((entries, legId) => {
    const pool = referencePool(entries, cleanRunnerIds)
    if (pool.length < MIN_RUNNERS_PER_LEG) return
    legReferences.set(legId, computeLegReference(pool.map((entry) => entry.legTime)))
  })

  const levelByRunner = buildRunnerLevels(entriesByLeg, legReferences)

  const analysisPerControl = new Map<string, TimeLossAnalysis>()
  let totalSplitsAnalyzed = 0
  let totalTimeLossDetected = 0

  entriesByLeg.forEach((entries, legId) => {
    const reference = legReferences.get(legId)
    if (reference === undefined) return

    const legAnalysis = analyzeLeg(legId, entries, reference, levelByRunner, tolerance)
    analysisPerControl.set(legId, legAnalysis)
    totalSplitsAnalyzed += legAnalysis.runnerAnalysis.size
    legAnalysis.runnerAnalysis.forEach((info) => {
      if (info.hasTimeLoss) totalTimeLossDetected++
    })
  })

  return {
    analysisPerControl,
    globalStats: {
      totalControls: analysisPerControl.size,
      totalSplitsAnalyzed,
      totalTimeLossDetected,
    },
  }
}

export function getRunnerTimeLossInfo(
  timeLossResults: TimeLossResults,
  runnerId: string,
  controlId: string,
): RunnerTimeLossInfo | null {
  const controlAnalysis = timeLossResults.analysisPerControl.get(controlId)
  if (!controlAnalysis) return null
  return controlAnalysis.runnerAnalysis.get(runnerId) ?? null
}
