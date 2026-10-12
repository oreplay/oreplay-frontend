import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  computeBestLegTimes,
  computeLegReferences,
  FINISH_LEG_ID,
  mean,
  orderNumberLegKey,
} from "./timeLossAnalysis.ts"
import { hasChipDownload } from "../../../shared/functions.ts"
import { TFunction } from "i18next"

export const EVEN_LEG_AXIS_WIDTH = 1
export const LINE_CHART_REFERENCE = {
  Leader: "leader",
  PerfectRunner: "perfectRunner",
} as const
export type LineChartReference = (typeof LINE_CHART_REFERENCE)[keyof typeof LINE_CHART_REFERENCE]
export const MIN_LEG_AXIS_WIDTH_RATIO = 0.5
export const START_AXIS_POSITION = 0
export const START_CONTROL_ID = "START"

// Position Evolution Data Structures
export interface PositionDataPoint {
  x: string
  controlName: string
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
  x: number
  xLabel: string
  y: number // Cumulative time in seconds
  controlId: string
  controlStation: string
  orderNumber: number
  runnerName: string
  position: number
  timeBehindLeader: number
  timeBehindPerfectRunner: number
  cumulativeTime: number
}

export interface LineChartData {
  id: string
  color: string
  data: ChartDataPoint[]
}

export interface LineChartTick {
  value: number
  label: string
}

function courseControlLegKeys(runner: ProcessedRunnerModel): string[] {
  return [...runner.stage.splits]
    .filter((split) => split.control?.id)
    .sort((a, b) => (a.order_number || 0) - (b.order_number || 0))
    .flatMap((split) => {
      const legKey = orderNumberLegKey(split)
      return legKey ? [legKey] : []
    })
}

function courseLegKeys(runners: ProcessedRunnerModel[]): string[] {
  const longestCourse = runners
    .filter(hasChipDownload)
    .map(courseControlLegKeys)
    .reduce<string[]>(
      (longest, legKeys) => (legKeys.length > longest.length ? legKeys : longest),
      [],
    )
  return [...longestCourse, FINISH_LEG_ID]
}

export function computeLegAxisWidths(referenceTimes: (number | undefined)[]): number[] {
  const knownTimes = referenceTimes.filter((time): time is number => time !== undefined && time > 0)
  if (knownTimes.length === 0) return referenceTimes.map(() => EVEN_LEG_AXIS_WIDTH)

  const averageLegTime = mean(knownTimes)
  const minLegWidth = averageLegTime * MIN_LEG_AXIS_WIDTH_RATIO
  return referenceTimes.map((time) => Math.max(time ?? averageLegTime, minLegWidth))
}

export function computeLegAxisPositions(runners: ProcessedRunnerModel[]): Map<string, number> {
  const legKeys = courseLegKeys(runners)
  const legReferences = computeLegReferences(runners, orderNumberLegKey)
  const legWidths = computeLegAxisWidths(legKeys.map((legKey) => legReferences.get(legKey)))

  const positions = new Map<string, number>([[START_CONTROL_ID, START_AXIS_POSITION]])
  let position = START_AXIS_POSITION
  legKeys.forEach((legKey, index) => {
    position += legWidths[index]
    positions.set(legKey, position)
  })
  return positions
}

export function getLineChartTicks(series: LineChartData[]): LineChartTick[] {
  const labelByValue = new Map<number, string>()
  series.forEach((runnerSeries) =>
    runnerSeries.data.forEach((point) => labelByValue.set(point.x, point.xLabel)),
  )
  return [...labelByValue.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.value - b.value)
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
 * Time the perfect runner, the one with the best time on every leg, needs to reach each control.
 *
 * @param runners Runners of the class.
 * @returns Seconds from the start by leg key, in course order and with the finish leg last. A leg
 * nobody has a time for adds nothing to the total.
 */
export function computePerfectRunnerTimes(runners: ProcessedRunnerModel[]): Map<string, number> {
  const bestLegTimes = computeBestLegTimes(runners, orderNumberLegKey)
  const perfectRunnerTimes = new Map<string, number>()
  let elapsed = 0
  courseLegKeys(runners).forEach((legKey) => {
    elapsed += bestLegTimes.get(legKey) ?? 0
    perfectRunnerTimes.set(legKey, elapsed)
  })
  return perfectRunnerTimes
}

/**
 * Picks the value a line chart plots for a point, according to who the runners are compared with.
 *
 * @param reference Who the runners are compared with.
 * @param timeBehindLeader Seconds the runner is behind the leader at the point.
 * @param timeBehindPerfectRunner Seconds the runner is behind the perfect runner at the point.
 * @returns The seconds to plot.
 */
function timeBehindReference(
  reference: LineChartReference,
  timeBehindLeader: number,
  timeBehindPerfectRunner: number,
): number {
  return reference === LINE_CHART_REFERENCE.PerfectRunner
    ? timeBehindPerfectRunner
    : timeBehindLeader
}

/**
 * Builds the series of a line chart that shows, control by control, how far behind a reference each
 * selected runner is. Controls are spaced along the x axis by the reference time of their leg.
 *
 * @param runners Runners of the class.
 * @param selectedRunnerIds Ids of the runners to plot; the ones without chip download are skipped.
 * @param t Translation function for the start and finish labels.
 * @param reference Who the runners are compared with: the leader at each control, or the perfect
 * runner made of the best time on every leg.
 * @returns One series per plotted runner.
 */
export function transformRunnersForLineChart(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[],
  t: TFunction,
  reference: LineChartReference = LINE_CHART_REFERENCE.Leader,
): LineChartData[] {
  const selectedRunners = runners.filter(
    (runner) => selectedRunnerIds.includes(runner.id) && hasChipDownload(runner),
  )
  const colors = generateRunnerColors(selectedRunners.length)
  const axisPositions = computeLegAxisPositions(runners)
  const perfectRunnerTimes = computePerfectRunnerTimes(runners)

  return selectedRunners.map((runner, index) => {
    const sortedSplits = [...runner.stage.splits].sort(
      (a, b) => (a.order_number || 0) - (b.order_number || 0),
    )

    const data: ChartDataPoint[] = []

    data.push({
      x: START_AXIS_POSITION,
      xLabel: t("Graphs.Start"),
      y: 0,
      controlId: START_CONTROL_ID,
      controlStation: START_CONTROL_ID,
      orderNumber: 0,
      runnerName: runner.full_name,
      position: 1,
      timeBehindLeader: 0,
      timeBehindPerfectRunner: 0,
      cumulativeTime: 0,
    })

    sortedSplits.forEach((split) => {
      const legKey = orderNumberLegKey(split)
      if (!split.control?.id || !split.cumulative_time || !legKey) return

      const controlId = split.control.id
      const axisPosition = axisPositions.get(legKey)
      if (axisPosition === undefined) return
      const orderNumber = split.order_number || 0
      const cumulativeTime = split.cumulative_time

      const timeBehindLeader = split.cumulative_behind || 0

      const timeBehindPerfectRunner = cumulativeTime - (perfectRunnerTimes.get(legKey) ?? 0)

      data.push({
        x: axisPosition,
        xLabel: orderNumber.toString(),
        y: timeBehindReference(reference, timeBehindLeader, timeBehindPerfectRunner),
        controlId,
        controlStation: split.control.station,
        orderNumber,
        runnerName: runner.full_name,
        position: split.cumulative_position || 0,
        timeBehindLeader,
        timeBehindPerfectRunner,
        cumulativeTime,
      })
    })

    const finishAxisPosition = axisPositions.get(FINISH_LEG_ID)
    if (runner.stage.time_seconds > 0 && finishAxisPosition !== undefined) {
      const finishTime = runner.stage.time_seconds
      const finishTimeBehindLeader = runner.stage.time_behind

      const finishTimeBehindPerfectRunner =
        finishTime - (perfectRunnerTimes.get(FINISH_LEG_ID) ?? 0)

      data.push({
        x: finishAxisPosition,
        xLabel: t("Graphs.Finish"),
        y: timeBehindReference(reference, finishTimeBehindLeader, finishTimeBehindPerfectRunner),
        controlId: FINISH_LEG_ID,
        controlStation: FINISH_LEG_ID,
        orderNumber: Infinity,
        runnerName: runner.full_name,
        position: runner.stage.position,
        timeBehindLeader: finishTimeBehindLeader,
        timeBehindPerfectRunner: finishTimeBehindPerfectRunner,
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
 * Transforms runner data for position evolution chart (unlimited runners, inverted Y-axis)
 * More permissive with runner validation
 */
export function transformRunnersForPositionChart(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[],
  t: TFunction,
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
              x: (split.order_number ?? data.length + 1).toString(),
              controlName: split.control.station,
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
          x: t("Graphs.Finish"),
          controlName: t("Graphs.Finish"),
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
    .filter((runner) => runner.data.length > 0)
}
