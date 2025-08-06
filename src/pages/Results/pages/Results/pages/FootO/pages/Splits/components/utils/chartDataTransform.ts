import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes"
import { ChartDataItem } from "../Charts/BarChart.tsx"
import { getRunnerTimeLossInfo, TimeLossResults } from "./timeLossAnalysis.ts"
import { hasChipDownload } from "../../../../../../shared/functions.ts"

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
 * Calculates incremental time behind the best partial for each runner
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
      // Calculate a gap for this control only (not cumulative)
      const gapForThisControl = runnerSplitTime - bestSplitTime

      // Add to an incremental sum
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
  const selectedRunners = runners.filter(
    (runner) => selectedRunnerIds.includes(runner.id) && hasChipDownload(runner),
  )
  const colors = generateRunnerColors(selectedRunners.length)

  const leaderTimes = calculateLeaderTimesForEachControl(runners)

  return selectedRunners.map((runner, index) => {
    const sortedSplits = [...runner.stage.splits].sort(
      (a, b) => (a.order_number || 0) - (b.order_number || 0),
    )

    const incrementalTimeBehindBestPartial = calculateIncrementalTimeBehindBestPartial(
      runners,
      runner.id,
    )

    const data: ChartDataPoint[] = []

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
        y: timeBehindLeader,
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

    if (runner.stage.time_seconds > 0) {
      const finishTime = runner.stage.time_seconds
      const finishTimeBehindLeader = runner.stage.time_behind

      const finalIncrementalTime = Array.from(incrementalTimeBehindBestPartial.values()).pop() || 0

      data.push({
        x: "FINISH",
        y: finishTimeBehindLeader,
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
 * Calculates leader times for each control (the best cumulative time at each control)
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

  // Find the best cumulative time for each control
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
 * Transforms runner data for position evolution chart (unlimited runners, inverted Y-axis)
 * More permissive with runner validation
 */
export function transformRunnersForPositionChart(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[],
): PositionChartData[] {
  if (selectedRunnerIds.length === 0) return []

  // Filter by hasChipDownload and selectedRunnerIds
  const selectedRunners = runners.filter(
    (runner) => selectedRunnerIds.includes(runner.id) && hasChipDownload(runner),
  )
  const colors = generateRunnerColors(selectedRunners.length)

  return selectedRunners
    .map((runner, index) => {
      const data: PositionDataPoint[] = []

      // Add a start position
      data.push({
        x: "START",
        y: 1, // Everyone starts at position 1
        control: "START",
        controlStation: "START",
        runnerName: runner.full_name || "Unknown Runner",
        splitTime: 0,
        timeLost: 0,
      })

      // Add positions per control if available
      if (runner.stage?.splits) {
        const sortedSplits = [...runner.stage.splits].sort(
          (a, b) => (a.order_number || 0) - (b.order_number || 0),
        )

        sortedSplits.forEach((split) => {
          if (
            split.control?.id &&
            split.cumulative_position !== null &&
            split.cumulative_position > 0
          ) {
            data.push({
              x: split.control.station,
              y: split.cumulative_position, // Position (will be inverted in the chart)
              control: split.control.id,
              controlStation: split.control.station,
              runnerName: runner.full_name || "Unknown Runner",
              splitTime: split.time || 0,
              timeLost: split.time_behind || 0,
            })
          }
        })
      }

      // Add a finish position if available
      if (runner.stage?.position && runner.stage.position > 0) {
        data.push({
          x: "FINISH",
          y: runner.stage.position,
          control: "FINISH",
          controlStation: "FINISH",
          runnerName: runner.full_name || "Unknown Runner",
          splitTime: runner.stage.time_seconds || 0,
          timeLost: runner.stage.time_behind || 0,
        })
      }

      return {
        id: runner.full_name || "Unknown Runner",
        color: colors[index],
        data,
      }
    })
    .filter((runner) => runner.data.length > 1) // Must have at least started + one other point
}

/**
 * Calculates the total loss time using the exact same logic as the table
 */
function calculateTotalLossTime(
  runner: ProcessedRunnerModel,
  timeLossResults?: TimeLossResults,
): number {
  if (!timeLossResults) {
    return 0
  }

  let totalLoss = 0

  // Calculate loss time for each split (exact same logic as table's RunnerRow.tsx)
  runner.stage.splits.forEach((split) => {
    if (split.control?.id && split.time !== null) {
      const timeLossInfo = getRunnerTimeLossInfo(timeLossResults, runner.id, split.control.id)
      if (timeLossInfo && timeLossInfo.hasTimeLoss) {
        const controlAnalysis = timeLossResults.analysisPerControl.get(split.control.id)
        if (controlAnalysis) {
          // The timeLossInfo.splitTime should match the split.time for individual splits
          // Calculate the loss as: actual time - estimated good time
          const lossTime = split.time - controlAnalysis.estimatedTimeWithoutError
          if (lossTime > 0) {
            totalLoss += lossTime
          }
        }
      }
    }
  })

  return Math.max(0, totalLoss)
}

/**
 * Calculates error-free time and error time using the exact same logic as the table RunnerRow.tsx
 * This ensures perfect data consistency between table and bar chart views
 */
function calculateRaceAnalysisData(
  runner: ProcessedRunnerModel,
  timeLossResults?: TimeLossResults,
): { totalTime: number; errorFreeTime: number; errorTime: number } {
  const totalTime = runner.stage?.time_seconds || 0

  if (totalTime <= 0) {
    return {
      totalTime: 0,
      errorFreeTime: 0,
      errorTime: 0,
    }
  }

  // Use the exact same calculation logic as the table (RunnerRow.tsx calculateTotalLossTime)
  const totalLossTime = calculateTotalLossTime(runner, timeLossResults)

  // Calculate clean time: Total race time - Total loss time (identical to table calculation)
  // const cleanTime = Math.max(0, result.time_seconds - totalLossTime) from RunnerRow.tsx
  const errorFreeTime = Math.max(0, totalTime - totalLossTime)
  return {
    totalTime: totalTime,
    errorFreeTime: errorFreeTime,
    errorTime: totalLossTime,
  }
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
  // Filter by hasChipDownload and selectedRunnerIds
  const selectedRunners = runners.filter(
    (runner) => selectedRunnerIds.includes(runner.id) && hasChipDownload(runner),
  )

  if (selectedRunners.length === 0) {
    return []
  }

  const colors = generateRunnerColors(selectedRunners.length)

  return selectedRunners
    .map((runner, index) => {
      // If the runner doesn't have basic time data, create the default entry
      const totalTime = runner.stage?.time_seconds || 0

      if (totalTime <= 0) {
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

      const {
        totalTime: calcTotal,
        errorFreeTime,
        errorTime,
      } = calculateRaceAnalysisData(runner, timeLossResults)

      // Ensure the bar segments add up correctly for stacked visualization
      const finalErrorFreeTime = Math.max(0, errorFreeTime)
      const finalErrorTime = Math.max(0, errorTime)

      // Validate that the sum doesn't exceed total time
      const sum = finalErrorFreeTime + finalErrorTime
      let adjustedErrorFreeTime = finalErrorFreeTime
      let adjustedErrorTime = finalErrorTime

      if (sum > calcTotal && calcTotal > 0) {
        // Proportionally adjust if a sum exceeds the total
        const ratio = calcTotal / sum
        adjustedErrorFreeTime = finalErrorFreeTime * ratio
        adjustedErrorTime = finalErrorTime * ratio
      }

      return {
        runnerId: runner.id,
        name: runner.full_name || "Unknown Runner",
        totalTime: calcTotal,
        errorFreeTime: adjustedErrorFreeTime,
        errorTime: adjustedErrorTime,
        theoreticalTime: adjustedErrorFreeTime, // Best possible time without errors
        color: colors[index],
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}
