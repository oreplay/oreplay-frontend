// Import core data model and chart item type definitions
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes"
import { ChartDataItem } from "../Charts/BarChart.tsx"

// Represents a single point in the line chart (usually per control)
export interface ChartDataPoint {
  x: string // X-axis label, such as "START", "1", "2", "3", "FINISH"
  y: number // Y-axis value, representing cumulative or relative time
  controlId: string
  controlStation: string
  orderNumber: number
  runnerName: string
  position: number
  timeBehindLeader: number
  timeBehindBestPartialIncremental: number // Sum of positive time losses across controls
  cumulativeTime: number
}

// Structure expected by the Nivo Line chart component
export interface LineChartData {
  id: string // Runner's full name
  color: string // Assigned color for the line
  data: ChartDataPoint[] // Array of data points (controls)
}

/**
 * Converts seconds into HH:MM:SS or MM:SS format
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
 * Returns a formatted string with +/- sign depending on time difference
 */
export function formatTimeDifference(seconds: number): string {
  if (seconds === 0) return "00:00"
  if (seconds < 0) return `-${formatTime(Math.abs(seconds))}`
  return `+${formatTime(seconds)}`
}

/**
 * Assigns a unique color to each runner based on index from a predefined palette
 */
export function generateRunnerColors(runnerCount: number): string[] {
  const colors = [ /* 20-color palette */ ]
  const result: string[] = []
  for (let i = 0; i < runnerCount; i++) {
    result.push(colors[i % colors.length]) // Cycle if more runners than colors
  }
  return result
}

/**
 * Computes incremental time behind the best split for each control
 * Used to show cumulative "lost time" across the course
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
    const runnerSplitTime = split.time

    // Identify best split time for this control among all runners
    let bestSplitTime = Infinity
    runners.forEach((r) => {
      const runnerSplit = r.stage.splits.find((s) => s.control?.id === controlId)
      if (runnerSplit && runnerSplit.time !== null && runnerSplit.time < bestSplitTime) {
        bestSplitTime = runnerSplit.time
      }
    })

    if (bestSplitTime !== Infinity) {
      const gap = runnerSplitTime - bestSplitTime
      cumulativeTimeBehindBestPartial += Math.max(0, gap) // Only add positive loss
      incrementalMap.set(controlId, cumulativeTimeBehindBestPartial)
    }
  })

  return incrementalMap
}

/**
 * Converts processed runner data into a line chart format for cumulative time or time behind leader
 */
export function transformRunnersForLineChart(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[],
): LineChartData[] {
  const selectedRunners = runners.filter((runner) => selectedRunnerIds.includes(runner.id))
  const colors = generateRunnerColors(selectedRunners.length)
  const leaderTimes = calculateLeaderTimesForEachControl(runners)

  return selectedRunners.map((runner, index) => {
    const sortedSplits = [...runner.stage.splits].sort(
      (a, b) => (a.order_number || 0) - (b.order_number || 0),
    )
    const incrementalLossMap = calculateIncrementalTimeBehindBestPartial(runners, runner.id)
    const data: ChartDataPoint[] = []

    // Add start point (always zero)
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

    // Add control points
    sortedSplits.forEach((split) => {
      if (!split.control?.id || !split.cumulative_time) return
      const controlId = split.control.id
      const orderNumber = split.order_number || 0
      const cumulativeTime = split.cumulative_time
      const leaderTimeAtControl = leaderTimes.get(controlId) || 0
      const timeBehindLeader = cumulativeTime - leaderTimeAtControl
      const timeBehindBestPartial = incrementalLossMap.get(controlId) || 0

      data.push({
        x: orderNumber.toString(),
        y: timeBehindLeader,
        controlId,
        controlStation: split.control.station,
        orderNumber,
        runnerName: runner.full_name,
        position: split.cumulative_position || 0,
        timeBehindLeader,
        timeBehindBestPartialIncremental: timeBehindBestPartial,
        cumulativeTime,
      })
    })

    // Add finish point if available
    if (runner.stage.time_seconds > 0) {
      const finishTime = runner.stage.time_seconds
      const finishGap = runner.stage.time_behind
      const finalIncrementalLoss =
        Array.from(incrementalLossMap.values()).pop() || 0

      data.push({
        x: "FINISH",
        y: finishGap,
        controlId: "FINISH",
        controlStation: "FINISH",
        orderNumber: 999,
        runnerName: runner.full_name,
        position: runner.stage.position,
        timeBehindLeader: finishGap,
        timeBehindBestPartialIncremental: finalIncrementalLoss,
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
 * Calculates the best cumulative time (leader) per control across all runners
 */
function calculateLeaderTimesForEachControl(runners: ProcessedRunnerModel[]): Map<string, number> {
  const leaderTimes = new Map<string, number>()
  const controlIds = new Set<string>()

  // Collect all control IDs
  runners.forEach((runner) => {
    runner.stage.splits.forEach((split) => {
      if (split.control?.id) {
        controlIds.add(split.control.id)
      }
    })
  })

  // For each control, find best cumulative time
  controlIds.forEach((controlId) => {
    let bestTime = Infinity
    runners.forEach((runner) => {
      const split = runner.stage.splits.find((s) => s.control?.id === controlId)
      if (split && split.cumulative_time !== null && split.cumulative_time < bestTime) {
        bestTime = split.cumulative_time
      }
    })

    if (bestTime !== Infinity) {
      leaderTimes.set(controlId, bestTime)
    }
  })

  return leaderTimes
}

/**
 * Calculates total, error-free, and error time using time loss analysis (if available)
 */
function calculateRaceAnalysisData(
  runner: ProcessedRunnerModel,
  timeLossResults?: { analysisPerControl?: Map<string, { estimatedTimeWithoutError?: number }> },
): { totalTime: number; errorFreeTime: number; errorTime: number } {
  const totalTime = runner.stage.time_seconds || 0
  let errorFreeTime = 0

  // Sum estimated error-free times per control if available
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

  if (errorFreeTime === 0) errorFreeTime = totalTime
  const errorTime = Math.max(0, totalTime - errorFreeTime)

  return { totalTime, errorFreeTime, errorTime }
}

/**
 * Transforms runner data into format required for the bar chart
 * Used to compare error-free vs. error time in a stacked bar
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

    return {
      runnerId: runner.id,
      name: runner.full_name,
      totalTime,
      errorFreeTime,
      errorTime,
      theoreticalTime: 0, // Optional: replace with actual theoretical time if needed
      color: colors[index],
    }
  })
}
