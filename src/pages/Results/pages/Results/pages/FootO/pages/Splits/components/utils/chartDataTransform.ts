import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes"
import { ChartDataItem } from "../Charts/BarChart.tsx"

export interface ChartDataPoint {
  x: string // Control formatted as "START", "1", "2", "3", etc.
  y: number // Cumulative time in seconds
  controlId: string
  controlStation: string
  orderNumber: number
  runnerName: string
  position: number
  timeBehindLeader: number
  timeBehindBestPartialIncremental: number // Incremental sum of control-to-control gaps
  cumulativeTime: number
}

export interface LineChartData {
  id: string
  color: string
  data: ChartDataPoint[]
}

/**
 * Formats time in seconds to HH:MM:SS or MM:SS format
 */
export function formatTime(seconds: number): string {
  if (seconds < 0) return "00:00"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  } else {
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
}

/**
 * Formats time difference with proper +/- signs
 */
export function formatTimeDifference(seconds: number): string {
  if (seconds === 0) return "00:00"
  if (seconds < 0) return `-${formatTime(Math.abs(seconds))}`
  return `+${formatTime(seconds)}`
}

/**
 * Generates a distinct color for each runner
 */
export function generateRunnerColors(runnerCount: number): string[] {
  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#aec7e8",
    "#ffbb78",
    "#98df8a",
    "#ff9896",
    "#c5b0d5",
    "#c49c94",
    "#f7b6d3",
    "#c7c7c7",
    "#dbdb8d",
    "#9edae5",
  ]

  const result: string[] = []
  for (let i = 0; i < runnerCount; i++) {
    result.push(colors[i % colors.length])
  }
  return result
}

/**
 * Calculates incremental time behind best partial for each runner
 */
function calculateIncrementalTimeBehindBestPartial(
  runners: ProcessedRunnerModel[],
  runnerId: string,
): Map<string, number> {
  const incrementalMap = new Map<string, number>()

  const runner = runners.find((r) => r.id === runnerId)
  if (!runner) return incrementalMap

  const sortedSplits = [...runner.stage.splits].sort(
    (a, b) => (a.order_number || 0) - (b.order_number || 0),
  )

  let cumulativeTimeBehindBestPartial = 0

  sortedSplits.forEach((split) => {
    if (!split.control?.id || !split.time) return

    const controlId = split.control.id
    const runnerSplitTime = split.time // Individual split time, not cumulative

    // Find the best split time for this control among all runners
    let bestSplitTime = Infinity
    runners.forEach((r) => {
      const runnerSplit = r.stage.splits.find((s) => s.control?.id === controlId)
      if (runnerSplit && runnerSplit.time !== null && runnerSplit.time < bestSplitTime) {
        bestSplitTime = runnerSplit.time
      }
    })

    if (bestSplitTime !== Infinity) {
      // Calculate gap for this control only (not cumulative)
      const gapForThisControl = runnerSplitTime - bestSplitTime

      // Add to incremental sum
      cumulativeTimeBehindBestPartial += Math.max(0, gapForThisControl)
      incrementalMap.set(controlId, cumulativeTimeBehindBestPartial)
    }
  })

  return incrementalMap
}

/**
 * Transforms runner data for line chart visualization (cumulative time progression)
 */
export function transformRunnersForLineChart(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[],
): LineChartData[] {
  const selectedRunners = runners.filter((runner) => selectedRunnerIds.includes(runner.id))
  const colors = generateRunnerColors(selectedRunners.length)

  // Calcular los mejores tiempos del líder para cada control
  const leaderTimes = calculateLeaderTimesForEachControl(runners)

  return selectedRunners.map((runner, index) => {
    const sortedSplits = [...runner.stage.splits].sort(
      (a, b) => (a.order_number || 0) - (b.order_number || 0),
    )

    // Calcular tiempo incremental detrás del mejor parcial para este corredor
    const incrementalTimeBehindBestPartial = calculateIncrementalTimeBehindBestPartial(
      runners,
      runner.id,
    )

    const data: ChartDataPoint[] = []

    // Punto START (siempre 0)
    data.push({
      x: "START",
      y: 0,
      controlId: "START",
      controlStation: "START",
      orderNumber: 0,
      runnerName: runner.full_name,
      position: 1,
      timeBehindLeader: 0,
      timeBehindBestPartialIncremental: 0,
      cumulativeTime: 0,
    })

    // Puntos para cada control usando diferencia al líder en Y
    sortedSplits.forEach((split) => {
      if (!split.control?.id || !split.cumulative_time) return

      const controlId = split.control.id
      const orderNumber = split.order_number || 0
      const cumulativeTime = split.cumulative_time

      const leaderTimeAtControl = leaderTimes.get(controlId) || 0
      const timeBehindLeader = cumulativeTime - leaderTimeAtControl

      const timeBehindBestPartialIncremental = incrementalTimeBehindBestPartial.get(controlId) || 0

      data.push({
        x: orderNumber.toString(),
        y: timeBehindLeader, // <-- Aquí está el cambio principal
        controlId,
        controlStation: split.control.station,
        orderNumber,
        runnerName: runner.full_name,
        position: split.cumulative_position || 0,
        timeBehindLeader,
        timeBehindBestPartialIncremental,
        cumulativeTime,
      })
    })

    // Punto FINISH usando diferencia al líder
    if (runner.stage.time_seconds > 0) {
      const finishTime = runner.stage.time_seconds
      const finishTimeBehindLeader = runner.stage.time_behind

      const finalIncrementalTime = Array.from(incrementalTimeBehindBestPartial.values()).pop() || 0

      data.push({
        x: "FINISH",
        y: finishTimeBehindLeader, // <-- Cambio aquí también
        controlId: "FINISH",
        controlStation: "FINISH",
        orderNumber: 999,
        runnerName: runner.full_name,
        position: runner.stage.position,
        timeBehindLeader: finishTimeBehindLeader,
        timeBehindBestPartialIncremental: finalIncrementalTime,
        cumulativeTime: finishTime,
      })
    }

    return {
      id: runner.full_name,
      color: colors[index],
      data,
    }
  })
}

/**
 * Calculates leader times for each control (best cumulative time at each control)
 */
function calculateLeaderTimesForEachControl(runners: ProcessedRunnerModel[]): Map<string, number> {
  const leaderTimes = new Map<string, number>()

  // Get all unique control IDs
  const controlIds = new Set<string>()
  runners.forEach((runner) => {
    runner.stage.splits.forEach((split) => {
      if (split.control?.id) {
        controlIds.add(split.control.id)
      }
    })
  })

  // Find best cumulative time for each control
  controlIds.forEach((controlId) => {
    let bestCumulativeTime = Infinity

    runners.forEach((runner) => {
      const split = runner.stage.splits.find((s) => s.control?.id === controlId)
      if (split && split.cumulative_time !== null && split.cumulative_time < bestCumulativeTime) {
        bestCumulativeTime = split.cumulative_time
      }
    })

    if (bestCumulativeTime !== Infinity) {
      leaderTimes.set(controlId, bestCumulativeTime)
    }
  })

  return leaderTimes
}

/**
 * Calculates error-free time and error time from race analysis table
 */
function calculateRaceAnalysisData(
  runner: ProcessedRunnerModel,
  timeLossResults?: { analysisPerControl?: Map<string, { estimatedTimeWithoutError?: number }> },
): { totalTime: number; errorFreeTime: number; errorTime: number } {
  const totalTime = runner.stage.time_seconds || 0

  let errorFreeTime = 0

  if (timeLossResults?.analysisPerControl) {
    runner.stage.splits.forEach((split) => {
      if (split.control?.id) {
        const controlAnalysis = timeLossResults.analysisPerControl?.get(split.control.id)
        if (controlAnalysis?.estimatedTimeWithoutError) {
          errorFreeTime += controlAnalysis.estimatedTimeWithoutError
        }
      }
    })
  }

  if (errorFreeTime === 0) {
    errorFreeTime = totalTime
  }

  const errorTime = Math.max(0, totalTime - errorFreeTime)

  return { totalTime, errorFreeTime, errorTime }
}

/**
 * Transforms runner data for bar chart visualization (stacked bar showing race analysis data)
 */
export function transformRunnersForBarChart(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[],
  timeLossResults?: { analysisPerControl?: Map<string, { estimatedTimeWithoutError?: number }> },
): ChartDataItem[] {
  const selectedRunners = runners.filter((runner) => selectedRunnerIds.includes(runner.id))
  const colors = generateRunnerColors(selectedRunners.length)

  return selectedRunners.map((runner, index) => {
    const { totalTime, errorFreeTime, errorTime } = calculateRaceAnalysisData(
      runner,
      timeLossResults,
    )

    // Agregamos runnerId y theoreticalTime para cumplir con ChartDataItem
    return {
      runnerId: runner.id,
      name: runner.full_name,
      totalTime,
      errorFreeTime,
      errorTime,
      theoreticalTime: 0, // o calcula el valor real si lo tienes disponible
      color: colors[index],
    }
  })
}

