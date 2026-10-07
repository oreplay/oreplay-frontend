import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { OnlineControlModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import FootOSplitsTable from "./FootOSplitsTable.tsx"
import { buildRunnerFixture } from "./shared/splitsTableFixtures.ts"

const runnerHeadingRenders = vi.hoisted(() => vi.fn())

vi.mock("./components/RunnerHeading.tsx", () => ({
  default: () => {
    runnerHeadingRenders()
    return null
  },
}))

const NO_RADIOS: OnlineControlModel[] = []
const RUNNERS = [buildRunnerFixture("anna"), buildRunnerFixture("bea")]
const SECOND_SPLIT_TIME = "01:30"
const SECOND_CUMULATIVE_TIME = "02:30"
const TIME_LOSS_THRESHOLD = 10

type View = {
  showCumulative?: boolean
  timeLossEnabled?: boolean
}

function TableShowing({ showCumulative, timeLossEnabled }: View) {
  return (
    <FootOSplitsTable
      radiosList={NO_RADIOS}
      runners={RUNNERS}
      showCumulative={showCumulative}
      timeLossEnabled={timeLossEnabled}
      timeLossThreshold={TIME_LOSS_THRESHOLD}
    />
  )
}

function renderTable() {
  const { container, rerender } = render(<TableShowing />)
  const [headerTable, bodyTable] = Array.from(container.querySelectorAll("table"))
  const bodyScroller = bodyTable.parentElement as HTMLElement
  const headerScroller = headerTable.parentElement as HTMLElement
  const show = (view: View) => rerender(<TableShowing {...view} />)
  return { bodyScroller, bodyTable, headerScroller, headerTable, show }
}

describe("FootOSplitsTable", () => {
  beforeEach(() => {
    runnerHeadingRenders.mockClear()
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

  it("shows the time of each leg by default", () => {
    const { bodyTable } = renderTable()

    expect(bodyTable).toHaveTextContent(SECOND_SPLIT_TIME)
    expect(bodyTable).not.toHaveTextContent(SECOND_CUMULATIVE_TIME)
  })

  it("shows the accumulated times in the same cells without rendering the rows again", () => {
    const { bodyTable, show } = renderTable()
    const cellsBefore = Array.from(bodyTable.querySelectorAll("td"))
    runnerHeadingRenders.mockClear()

    show({ showCumulative: true })

    expect(bodyTable).toHaveTextContent(SECOND_CUMULATIVE_TIME)
    expect(Array.from(bodyTable.querySelectorAll("td"))).toEqual(cellsBefore)
    expect(runnerHeadingRenders).not.toHaveBeenCalled()
  })

  it("keeps the horizontal scroll when the accumulated times are shown", () => {
    const { bodyScroller, headerScroller, show } = renderTable()
    bodyScroller.scrollLeft = 140
    bodyScroller.dispatchEvent(new Event("scroll"))

    show({ showCumulative: true })

    expect(bodyScroller.scrollLeft).toBe(140)
    expect(headerScroller.scrollLeft).toBe(140)
  })

  it("keeps the clean time column when the time loss is shown on the accumulated times", () => {
    const { bodyTable, headerTable, show } = renderTable()
    const headerCellCountBefore = headerTable.querySelectorAll("thead th").length

    show({ showCumulative: true, timeLossEnabled: true })

    expect(headerTable.querySelectorAll("thead th")).toHaveLength(headerCellCountBefore + 1)
    expect(bodyTable).toHaveTextContent(SECOND_CUMULATIVE_TIME)
  })

  it("adds the clean time column to the same table when the time loss is shown", () => {
    const { bodyScroller, bodyTable, headerTable, show } = renderTable()
    const headerCellCountBefore = headerTable.querySelectorAll("thead th").length
    const cellsBefore = Array.from(bodyTable.querySelectorAll("td"))
    bodyScroller.scrollLeft = 140

    show({ timeLossEnabled: true })

    expect(headerTable.querySelectorAll("thead th")).toHaveLength(headerCellCountBefore + 1)
    expect(Array.from(bodyTable.querySelectorAll("td"))).toEqual(
      expect.arrayContaining(cellsBefore),
    )
    expect(bodyScroller.scrollLeft).toBe(140)
  })
})
