import { describe, expect, it } from "vitest"
import { LINE_CHART_REFERENCE } from "../../../shared/chartDataTransform.ts"
import {
  DEFAULT_GRAPH_VIEW,
  GRAPH_VIEW,
  GRAPH_VIEW_ORDER,
  lineChartReferenceOf,
} from "./graphViews.ts"

describe("lineChartReferenceOf", () => {
  it("compares with the leader in the time behind leader graph", () => {
    expect(lineChartReferenceOf(GRAPH_VIEW.LineChart)).toBe(LINE_CHART_REFERENCE.Leader)
  })

  it("compares with the perfect runner in the time behind perfect runner graph", () => {
    expect(lineChartReferenceOf(GRAPH_VIEW.PerfectRunnerChart)).toBe(
      LINE_CHART_REFERENCE.PerfectRunner,
    )
  })

  it("has no reference for the position graph", () => {
    expect(lineChartReferenceOf(GRAPH_VIEW.PositionChart)).toBeNull()
  })
})

describe("graph order", () => {
  it("offers every graph once, with the default one first", () => {
    expect([...GRAPH_VIEW_ORDER].sort()).toEqual(Object.values(GRAPH_VIEW).sort())
    expect(GRAPH_VIEW_ORDER[0]).toBe(DEFAULT_GRAPH_VIEW)
  })

  it("opens on the perfect runner graph", () => {
    expect(DEFAULT_GRAPH_VIEW).toBe(GRAPH_VIEW.PerfectRunnerChart)
  })
})
