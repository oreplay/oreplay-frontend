import { describe, expect, it } from "vitest"
import { LINE_CHART_REFERENCE } from "../../../shared/chartDataTransform.ts"
import { GRAPH_VIEW, lineChartReferenceOf } from "./graphViews.ts"

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
