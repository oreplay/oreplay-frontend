import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes"
import { ChartDataItem } from "../Charts/BarChart.tsx"
import { TimeLossResults } from "./timeLossAnalysis.ts"
import { getAccessibleColors } from "../../../../../../../../../../utils/accessibleColors.ts"

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
 * Generates a distinct color for each runner using accessible colors
 */
export function generateRunnerColors(runnerCount: number): string[] {
  return getAccessibleColors(runnerCount)
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
  const selectedRunners = runners.filter((runner) => selectedRunnerIds.includes(runner.id))
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

  // Use all runners, don't filter by status, no limit on the number of runners
  const selectedRunners = runners.filter((runner) => selectedRunnerIds.includes(runner.id))
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
    .filter((runner) => runner.data.length > 1) // Must have at least start + one other point
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

  let errorFreeTime = 0
  let calculatedErrorTime = 0

  if (timeLossResults?.analysisPerControl && totalTime > 0 && runner.stage?.splits) {
    // Use the same logic as timeLossAnalysis.ts for intermediate controls
    runner.stage.splits.forEach((split) => {
      if (split.control?.id && typeof split.time === "number" && split.time > 0) {
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
          // No analysis available for this control - treat as a good time
          errorFreeTime += split.time
        }
      }
    })

    // Handle FINISH control analysis (apply the same time loss logic as intermediate controls)
    if (runner.stage?.time_seconds && runner.stage.time_seconds > 0) {
      const finishControlAnalysis = timeLossResults.analysisPerControl.get("FINISH")
      if (
        finishControlAnalysis?.estimatedTimeWithoutError &&
        finishControlAnalysis.runnerAnalysis
      ) {
        const estimatedFinishTime = finishControlAnalysis.estimatedTimeWithoutError
        const finishRunnerInfo = finishControlAnalysis.runnerAnalysis.get(runner.id)

        if (finishRunnerInfo) {
          const actualFinishTime = finishRunnerInfo.splitTime || runner.stage.time_seconds

          if (finishRunnerInfo.hasTimeLoss) {
            // Calculate the finish segment time loss
            const finishSegmentLoss = Math.max(0, actualFinishTime - estimatedFinishTime)
            calculatedErrorTime += finishSegmentLoss
          }
        }
      }
    }
  } else {
    // Fallback: No analysis available - assume 95% good time
    if (totalTime > 0) {
      errorFreeTime = totalTime * 0.95
      calculatedErrorTime = totalTime * 0.05
    }
  }

  // Ensure we account for all time from start to finish line
  // The total should always match the actual finish time
  const actualTotalTime = runner.stage?.time_seconds || 0

  // If our calculation doesn't match the total time, adjust proportionally
  const calculatedSum = errorFreeTime + calculatedErrorTime
  if (calculatedSum > 0 && Math.abs(calculatedSum - actualTotalTime) > 1) {
    // Significant difference - adjust to match the actual total
    const ratio = actualTotalTime / calculatedSum
    errorFreeTime = errorFreeTime * ratio
    calculatedErrorTime = calculatedErrorTime * ratio
  }

  return {
    totalTime: actualTotalTime, // Always use actual total time including finish
    errorFreeTime: Math.max(0, errorFreeTime),
    errorTime: Math.max(0, calculatedErrorTime),
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
  if (!runners || runners.length === 0) {
    return []
  }

  // Use all runners, not just "valid" ones - let each transformation decide
  const selectedRunners = runners.filter((runner) => selectedRunnerIds.includes(runner.id))

  if (selectedRunners.length === 0) {
    return []
  }

  const colors = generateRunnerColors(selectedRunners.length)

  return selectedRunners
    .map((runner, index) => {
      // If the runner doesn't have basic time data, create the default entry
      const totalTime = runner.stage?.time_seconds || 0

      if (totalTime <= 0) {
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
