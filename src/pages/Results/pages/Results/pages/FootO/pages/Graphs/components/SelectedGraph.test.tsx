import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useIsMobileDevice } from "../../../../../../../shared/useIsMobileDevice.ts"
import { GRAPH_VIEW, GraphView } from "../shared/graphViews.ts"
import LineChart from "./Charts/LineChart.tsx"
import PositionChart from "./Charts/PositionChart.tsx"
import SelectedGraph from "./SelectedGraph.tsx"

vi.mock("../../../../../../../shared/useIsMobileDevice.ts", () => ({
  useIsMobileDevice: vi.fn(),
}))
vi.mock("./Charts/LineChart.tsx", () => ({ default: vi.fn(() => null) }))
vi.mock("./Charts/PositionChart.tsx", () => ({ default: vi.fn(() => null) }))

const CHART_BY_VIEW = {
  [GRAPH_VIEW.LineChart]: LineChart,
  [GRAPH_VIEW.PerfectRunnerChart]: LineChart,
  [GRAPH_VIEW.PositionChart]: PositionChart,
}

const VIEWS = Object.values(GRAPH_VIEW)

/**
 * Renders the given graph, with no runners, on a mobile device or on desktop.
 *
 * @param view The graph to show.
 * @param isMobile Whether the device is a mobile one.
 * @returns Whether the chart drawn for the graph was made interactive.
 */
function renderedChartIsInteractive(view: GraphView, isMobile: boolean) {
  vi.mocked(useIsMobileDevice).mockReturnValue(isMobile)
  render(<SelectedGraph runners={[]} selectedRunnerIds={[]} view={view} />)
  const chart = vi.mocked(CHART_BY_VIEW[view])

  return chart.mock.calls[0][0].isInteractive
}

describe("SelectedGraph", () => {
  beforeEach(() => {
    vi.mocked(LineChart).mockClear()
    vi.mocked(PositionChart).mockClear()
  })

  it.each(VIEWS)("draws the %s without tooltips on a mobile device", (view) => {
    expect(renderedChartIsInteractive(view, true)).toBe(false)
  })

  it.each(VIEWS)("draws the %s with tooltips on desktop", (view) => {
    expect(renderedChartIsInteractive(view, false)).toBe(true)
  })
})
