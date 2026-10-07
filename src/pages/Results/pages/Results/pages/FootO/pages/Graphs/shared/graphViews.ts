export const GRAPH_VIEW = {
  BarChart: "barChart",
  LineChart: "lineChart",
  PositionChart: "positionChart",
} as const

export type GraphView = (typeof GRAPH_VIEW)[keyof typeof GRAPH_VIEW]

export const DEFAULT_GRAPH_VIEW: GraphView = GRAPH_VIEW.LineChart
