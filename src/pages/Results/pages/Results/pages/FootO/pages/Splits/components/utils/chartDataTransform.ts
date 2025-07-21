import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes"
import { ChartDataItem } from "../Charts/BarChart.tsx"
import { TimeLossResults } from "./timeLossAnalysis.ts"

// Box Plot Data Structures
export interface BoxPlotDataPoint {
  control: string
  controlStation: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers: Array<{ value: number; runnerName: string }>
  scatter: Array<{ value: number; runnerName: string; runnerId: string }>
}

export interface BoxPlotData {
  id: string
  data: BoxPlotDataPoint[]
}

// Radar Chart Data Structures
export interface RadarDataPoint {
  control: string
  controlStation: string
  normalizedTime: number // ratio vs best time (1.0 = best, higher = worse)
  actualTime: number
  bestTime: number
}

export interface RadarChartData {
  runnerName: string
  runnerId: string
  data: RadarDataPoint[]
}

// Position Evolution Data Structures
export interface PositionDataPoint {
  x: string // Control name/number
  y: number // Position (inverted: 1 at top)
  control: string
  controlStation: string
  runnerName: string
  splitTime: number
  timeLost: number
}

export interface PositionChartData {
  id: string
  color: string
  data: PositionDataPoint[]
}

// Heatmap Data Structures
export interface HeatmapDataPoint {
  runner: string
  control: string
  value: number // position or time lost
  actualValue: number // for tooltip
  runnerName: string
  controlStation: string
}

export interface HeatmapData {
  id: string
  data: HeatmapDataPoint[]
}

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
 * Calculates quartiles and statistics for box plot
 */
function calculateBoxPlotStats(values: number[]): {
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers: number[]
} {
  if (values.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] }
  }

  const sorted = [...values].sort((a, b) => a - b)
  const min = sorted[0]
  const max = sorted[sorted.length - 1]

  const median = getPercentile(sorted, 0.5)
  const q1 = getPercentile(sorted, 0.25)
  const q3 = getPercentile(sorted, 0.75)

  // Calculate IQR for outlier detection
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  const outliers = sorted.filter(value => value < lowerBound || value > upperBound)

  return { min, q1, median, q3, max, outliers }
}

/**
 * Calculates percentile from sorted array
 */
function getPercentile(sortedArray: number[], percentile: number): number {
  if (sortedArray.length === 0) return 0
  if (sortedArray.length === 1) return sortedArray[0]

  const index = (sortedArray.length - 1) * percentile
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index % 1

  if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1]

  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight
}
/**
 * Transforms runner data for box plot visualization per control
 * More permissive with runner validation
 */
export function transformRunnersForBoxPlot(runners: ProcessedRunnerModel[]): BoxPlotData[] {
  console.log("transformRunnersForBoxPlot called with:", runners?.length, "runners")

  // Use all runners that have splits data, regardless of status
  const usableRunners = runners.filter(runner => {
    return runner.stage?.splits &&
      Array.isArray(runner.stage.splits) &&
      runner.stage.splits.length > 0
  })

  console.log("Usable runners for BoxPlot:", usableRunners.length)

  if (usableRunners.length === 0) {
    console.log("No usable runners found for BoxPlot")
    return []
  }

  // Group all controls
  const controlsMap = new Map<string, {
    controlStation: string
    times: Array<{ value: number; runnerName: string; runnerId: string }>
  }>()

  usableRunners.forEach(runner => {
    if (!runner.stage?.splits) return

    runner.stage.splits.forEach(split => {
      if (split.control?.id && typeof split.time === 'number' && split.time > 0 && !isNaN(split.time)) {
        const controlId = split.control.id
        if (!controlsMap.has(controlId)) {
          controlsMap.set(controlId, {
            controlStation: split.control.station || split.control.id || controlId,
            times: []
          })
        }
        controlsMap.get(controlId)!.times.push({
          value: split.time,
          runnerName: runner.full_name || "Unknown Runner",
          runnerId: runner.id
        })
      }
    })
  })

  console.log("Controls found for BoxPlot:", controlsMap.size)

  const boxPlotData: BoxPlotDataPoint[] = []

  controlsMap.forEach((controlData, controlId) => {
    if (controlData.times.length >= 2) { // Need at least 2 data points for meaningful box plot
      const values = controlData.times.map(t => t.value).filter(v => !isNaN(v))
      if (values.length >= 2) {
        const stats = calculateBoxPlotStats(values)

        console.log(`BoxPlot stats for control ${controlId}:`, stats)

        boxPlotData.push({
          control: controlId,
          controlStation: controlData.controlStation,
          min: stats.min,
          q1: stats.q1,
          median: stats.median,
          q3: stats.q3,
          max: stats.max,
          outliers: stats.outliers.map(value => ({
            value,
            runnerName: controlData.times.find(t => t.value === value)?.runnerName || "Unknown"
          })),
          scatter: controlData.times
        })
      }
    }
  })

  // Sort by control station for consistent ordering
  boxPlotData.sort((a, b) => {
    // Try to sort numerically if possible, otherwise alphabetically
    const aNum = parseInt(a.controlStation)
    const bNum = parseInt(b.controlStation)
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum
    }
    return a.controlStation.localeCompare(b.controlStation)
  })

  console.log("Final BoxPlot data points:", boxPlotData.length)

  return boxPlotData.length > 0 ? [{
    id: "controls",
    data: boxPlotData
  }] : []
}

/**
 * Transforms runner data for radar chart visualization (max 2 runners)
 * More permissive with runner validation
 */
export function transformRunnersForRadarChart(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[]
): RadarChartData[] {
  if (selectedRunnerIds.length === 0 || selectedRunnerIds.length > 2) return []

  // Use all runners, don't filter by status - let the function handle missing data
  const selectedRunners = runners.filter(runner => selectedRunnerIds.includes(runner.id))

  if (selectedRunners.length === 0) return []

  // Calculate best times per control across all runners (not just "valid" ones)
  const bestTimes = new Map<string, number>()

  runners.forEach(runner => {
    runner.stage?.splits?.forEach(split => {
      if (split.control?.id && split.time !== null && split.time > 0) {
        const controlId = split.control.id
        const currentBest = bestTimes.get(controlId) || Infinity
        if (split.time < currentBest) {
          bestTimes.set(controlId, split.time)
        }
      }
    })
  })

  return selectedRunners.map(runner => {
    const data: RadarDataPoint[] = []

    runner.stage?.splits?.forEach(split => {
      if (split.control?.id && split.time !== null && split.time > 0) {
        const controlId = split.control.id
        const bestTime = bestTimes.get(controlId)

        if (bestTime && bestTime > 0) {
          const normalizedTime = split.time / bestTime // 1.0 = best time, higher = worse

          data.push({
            control: controlId,
            controlStation: split.control.station,
            normalizedTime,
            actualTime: split.time,
            bestTime
          })
        }
      }
    })

    // Sort by control station
    data.sort((a, b) => a.controlStation.localeCompare(b.controlStation))

    return {
      runnerName: runner.full_name || "Unknown Runner",
      runnerId: runner.id,
      data
    }
  }).filter(runner => runner.data.length > 0) // Only exclude runners with no split data at all
}

/**
 * Transforms runner data for position evolution chart (unlimited runners, inverted Y-axis)
 * More permissive with runner validation
 */
export function transformRunnersForPositionChart(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[]
): PositionChartData[] {
  if (selectedRunnerIds.length === 0) return []

  // Use all runners, don't filter by status, no limit on number of runners
  const selectedRunners = runners.filter(runner => selectedRunnerIds.includes(runner.id))
  const colors = generateRunnerColors(selectedRunners.length)

  return selectedRunners.map((runner, index) => {
    const data: PositionDataPoint[] = []

    // Add start position
    data.push({
      x: "START",
      y: 1, // Everyone starts at position 1
      control: "START",
      controlStation: "START",
      runnerName: runner.full_name || "Unknown Runner",
      splitTime: 0,
      timeLost: 0
    })

    // Add positions per control if available
    if (runner.stage?.splits) {
      const sortedSplits = [...runner.stage.splits].sort(
        (a, b) => (a.order_number || 0) - (b.order_number || 0)
      )

      sortedSplits.forEach(split => {
        if (split.control?.id && split.cumulative_position !== null && split.cumulative_position > 0) {
          data.push({
            x: split.control.station,
            y: split.cumulative_position, // Position (will be inverted in chart)
            control: split.control.id,
            controlStation: split.control.station,
            runnerName: runner.full_name || "Unknown Runner",
            splitTime: split.time || 0,
            timeLost: split.time_behind || 0
          })
        }
      })
    }

    // Add finish position if available
    if (runner.stage?.position && runner.stage.position > 0) {
      data.push({
        x: "FINISH",
        y: runner.stage.position,
        control: "FINISH",
        controlStation: "FINISH",
        runnerName: runner.full_name || "Unknown Runner",
        splitTime: runner.stage.time_seconds || 0,
        timeLost: runner.stage.time_behind || 0
      })
    }

    return {
      id: runner.full_name || "Unknown Runner",
      color: colors[index],
      data
    }
  }).filter(runner => runner.data.length > 1) // Must have at least start + one other point
}

/**
 * Transforms runner data for heatmap visualization
 * More permissive with runner validation
 */
export function transformRunnersForHeatmap(
  runners: ProcessedRunnerModel[],
  valueType: 'position' | 'timeLost' = 'position'
): HeatmapData[] {
  // Use all runners, don't filter by status
  const usableRunners = runners.filter(runner => runner.stage?.splits && runner.stage.splits.length > 0)

  if (usableRunners.length === 0) return []

  const data: HeatmapDataPoint[] = []

  usableRunners.forEach(runner => {
    runner.stage.splits.forEach(split => {
      if (split.control?.id) {
        let value: number
        let actualValue: number

        if (valueType === 'position') {
          value = split.cumulative_position || 999
          actualValue = value
        } else {
          value = split.time_behind || 0
          actualValue = value
        }

        data.push({
          runner: runner.full_name || "Unknown Runner",
          control: split.control.station || split.control.id,
          value,
          actualValue,
          runnerName: runner.full_name || "Unknown Runner",
          controlStation: split.control.station || split.control.id
        })
      }
    })
  })

  return [{
    id: "heatmap",
    data
  }]
}
/**
 * Calculates error-free time and error time using the same logic as timeLossAnalysis.ts
 * Uses estimatedTimeWithoutError and hasTimeLoss from the existing analysis
 */
function calculateRaceAnalysisData(
  runner: ProcessedRunnerModel,
  timeLossResults?: TimeLossResults,
): { totalTime: number; errorFreeTime: number; errorTime: number } {
  const totalTime = runner.stage?.time_seconds || 0

  console.log(`Calculating race analysis for ${runner.full_name}, total time: ${totalTime}`)

  let errorFreeTime = 0
  let calculatedErrorTime = 0

  if (timeLossResults?.analysisPerControl && totalTime > 0 && runner.stage?.splits) {
    // Use the same logic as timeLossAnalysis.ts
    runner.stage.splits.forEach((split) => {
      if (split.control?.id && typeof split.time === 'number' && split.time > 0) {
        const controlId = split.control.id
        const controlAnalysis = timeLossResults.analysisPerControl.get(controlId)

        if (controlAnalysis?.estimatedTimeWithoutError && controlAnalysis.runnerAnalysis) {
          const estimatedTime = controlAnalysis.estimatedTimeWithoutError
          const runnerInfo = controlAnalysis.runnerAnalysis.get(runner.id)

          if (runnerInfo) {
            const actualSplitTime = runnerInfo.splitTime || split.time

            if (runnerInfo.hasTimeLoss) {
              // Runner has time loss - split into estimated time (green) and lost time (red)
              errorFreeTime += estimatedTime
              calculatedErrorTime += Math.max(0, actualSplitTime - estimatedTime)
            } else {
              // No time loss detected - all time is considered good time
              errorFreeTime += actualSplitTime
            }
          } else {
            // No analysis for this runner on this control - use estimated time
            errorFreeTime += Math.min(estimatedTime, split.time)
            calculatedErrorTime += Math.max(0, split.time - estimatedTime)
          }
        } else {
          // No analysis available for this control - treat as good time
          errorFreeTime += split.time
        }
      }
    })
  } else {
    // Fallback: No analysis available - assume 95% good time
    if (totalTime > 0) {
      errorFreeTime = totalTime * 0.95
      calculatedErrorTime = totalTime * 0.05
    }
  }

  // Ensure values make sense
  if (errorFreeTime <= 0 && totalTime > 0) {
    errorFreeTime = totalTime * 0.95
    calculatedErrorTime = totalTime * 0.05
  }

  // Ensure we don't exceed total time
  const sum = errorFreeTime + calculatedErrorTime
  if (sum > totalTime && totalTime > 0) {
    const ratio = totalTime / sum
    errorFreeTime = errorFreeTime * ratio
    calculatedErrorTime = calculatedErrorTime * ratio
  }

  const result = {
    totalTime,
    errorFreeTime: Math.max(0, errorFreeTime),
    errorTime: Math.max(0, calculatedErrorTime)
  }

  console.log(`Analysis result for ${runner.full_name}:`, result, {
    hasAnalysisData: !!timeLossResults?.analysisPerControl,
    controlsAnalyzed: runner.stage?.splits?.length || 0
  })

  return result
}

/**
 * Transforms runner data for bar chart visualization (stacked bar showing race analysis data)
 * Uses the same logic as timeLossAnalysis.ts: estimatedTimeWithoutError and hasTimeLoss
 */
export function transformRunnersForBarChart(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[],
  timeLossResults?: TimeLossResults,
): ChartDataItem[] {
  console.log("transformRunnersForBarChart called with:", {
    runnersCount: runners?.length,
    selectedRunnerIds,
    hasTimeLossResults: !!timeLossResults,
    analysisMethod: "Using timeLossAnalysis.ts logic"
  })

  // Use all runners, not just "valid" ones - let each transformation decide
  const selectedRunners = runners.filter((runner) => selectedRunnerIds.includes(runner.id))

  if (selectedRunners.length === 0) {
    console.log("No selected runners found for bar chart")
    return []
  }

  const colors = generateRunnerColors(selectedRunners.length)

  return selectedRunners
    .map((runner, index) => {
      // If runner doesn't have basic time data, create default entry
      const totalTime = runner.stage?.time_seconds || 0

      if (totalTime <= 0) {
        console.log(`Runner ${runner.full_name} has no time data`)
        // Still create an entry but with minimal data for visualization
        return {
          runnerId: runner.id,
          name: runner.full_name || "Unknown Runner",
          totalTime: 0,
          errorFreeTime: 0,
          errorTime: 0,
          theoreticalTime: 0,
          color: colors[index],
        }
      }

      const { totalTime: calcTotal, errorFreeTime, errorTime } = calculateRaceAnalysisData(
        runner,
        timeLossResults
      )

      // Ensure the bar segments add up correctly for stacked visualization
      const finalErrorFreeTime = Math.max(0, errorFreeTime)
      const finalErrorTime = Math.max(0, errorTime)

      // Validate that the sum doesn't exceed total time
      const sum = finalErrorFreeTime + finalErrorTime
      let adjustedErrorFreeTime = finalErrorFreeTime
      let adjustedErrorTime = finalErrorTime

      if (sum > calcTotal && calcTotal > 0) {
        // Proportionally adjust if sum exceeds total
        const ratio = calcTotal / sum
        adjustedErrorFreeTime = finalErrorFreeTime * ratio
        adjustedErrorTime = finalErrorTime * ratio
      }

      const result = {
        runnerId: runner.id,
        name: runner.full_name || "Unknown Runner",
        totalTime: calcTotal,
        errorFreeTime: adjustedErrorFreeTime,
        errorTime: adjustedErrorTime,
        theoreticalTime: adjustedErrorFreeTime, // Best possible time without errors
        color: colors[index],
      }

      console.log(`Bar chart data for ${runner.full_name}:`, result)
      return result
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

