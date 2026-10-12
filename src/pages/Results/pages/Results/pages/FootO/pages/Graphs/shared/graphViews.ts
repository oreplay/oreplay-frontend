import { LINE_CHART_REFERENCE, LineChartReference } from "../../../shared/chartDataTransform.ts"

export const GRAPH_VIEW = {
  LineChart: "lineChart",
  PerfectRunnerChart: "perfectRunnerChart",
  PositionChart: "positionChart",
} as const

export type GraphView = (typeof GRAPH_VIEW)[keyof typeof GRAPH_VIEW]

export const DEFAULT_GRAPH_VIEW: GraphView = GRAPH_VIEW.LineChart

export const GRAPH_VIEW_DESCRIPTION_KEY: Record<GraphView, string> = {
  [GRAPH_VIEW.LineChart]: "Graphs.Description.lineChart",
  [GRAPH_VIEW.PerfectRunnerChart]: "Graphs.Description.perfectRunnerChart",
  [GRAPH_VIEW.PositionChart]: "Graphs.Description.positionChart",
}

export const GRAPH_VIEW_LABEL_KEY: Record<GraphView, string> = {
  [GRAPH_VIEW.LineChart]: "view.lineChart",
  [GRAPH_VIEW.PerfectRunnerChart]: "view.perfectRunnerChart",
  [GRAPH_VIEW.PositionChart]: "view.positionChart",
}

export const GRAPH_VIEW_SHORT_LABEL_KEY: Partial<Record<GraphView, string>> = {
  [GRAPH_VIEW.LineChart]: "view.lineChartShort",
  [GRAPH_VIEW.PerfectRunnerChart]: "view.perfectRunnerChartShort",
}

export const GRAPH_VIEW_TITLE_KEY: Record<GraphView, string> = {
  [GRAPH_VIEW.LineChart]: "Graphs.Title.lineChart",
  [GRAPH_VIEW.PerfectRunnerChart]: "Graphs.Title.perfectRunnerChart",
  [GRAPH_VIEW.PositionChart]: "Graphs.Title.positionChart",
}

const LINE_CHART_REFERENCE_BY_VIEW: Partial<Record<GraphView, LineChartReference>> = {
  [GRAPH_VIEW.LineChart]: LINE_CHART_REFERENCE.Leader,
  [GRAPH_VIEW.PerfectRunnerChart]: LINE_CHART_REFERENCE.PerfectRunner,
}

/**
 * Who the runners are compared with in a graph drawn as a line chart of time behind.
 *
 * @param view The graph being shown.
 * @returns The reference of the graph, or `null` when the graph is not such a line chart.
 */
export function lineChartReferenceOf(view: GraphView): LineChartReference | null {
  return LINE_CHART_REFERENCE_BY_VIEW[view] ?? null
}
