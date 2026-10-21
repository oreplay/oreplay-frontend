import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import RogainePointsTable from "./RogainePointsTable.tsx"
import { buildRogaineRunnerFixture } from "./shared/rogainePointsTableFixtures.ts"

vi.mock("../../../../../../components/RunnerHeading.tsx", () => ({
  default: () => null,
}))

const CONTROL_STATIONS = [31n, 41n, 51n]
const SCORE_AND_TIME_COLUMN_COUNT = 4
const RUNNERS = [
  buildRogaineRunnerFixture("anna", {
    pointsBonus: 20,
    pointsFinal: 150,
    pointsPenalty: -10,
    stations: ["31", "41"],
  }),
  buildRogaineRunnerFixture("bea", { finishTime: null, stations: [] }),
]

/**
 * Renders the table with the fixture runners and splits it into its header and body tables.
 *
 * @returns The header and body `<table>` elements.
 */
function renderTable() {
  const { container } = render(
    <RogainePointsTable controlStations={CONTROL_STATIONS} runners={RUNNERS} />,
  )
  const [headerTable, bodyTable] = Array.from(container.querySelectorAll("table"))
  return { bodyTable, headerTable }
}

describe("RogainePointsTable", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn()
        disconnect = vi.fn()
        unobserve = vi.fn()
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("has a column for the scores, the time and every control", () => {
    const { headerTable } = renderTable()

    expect(headerTable.querySelectorAll("thead th")).toHaveLength(
      SCORE_AND_TIME_COLUMN_COUNT + CONTROL_STATIONS.length,
    )
  })

  it("shows the bonus, penalty and final points of a runner", () => {
    const { bodyTable } = renderTable()

    expect(bodyTable).toHaveTextContent("+20")
    expect(bodyTable).toHaveTextContent("-10")
    expect(bodyTable).toHaveTextContent("150")
  })

  it("shows a badge for every control of a runner with a score only", () => {
    const { bodyTable } = renderTable()
    const visibleRows = Array.from(bodyTable.querySelectorAll("tbody tr:not([aria-hidden])"))
    const [, annaCells, , beaCells] = visibleRows

    expect(annaCells).toHaveTextContent(/31.*41.*51/)
    expect(beaCells).not.toHaveTextContent(/31|41|51/)
  })
})
