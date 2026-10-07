import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import SplitsTableLayout from "./SplitsTableLayout.tsx"

const RADIOS: OnlineControlModel[] = [
  { id: "radio1", station: "31" },
  { id: "radio2", station: "41" },
]
const TIME_COLUMN_COUNT = 1
const GUTTER_COLUMN_COUNT = 2

function renderLayout() {
  const { container } = render(
    <SplitsTableLayout
      controlList={RADIOS}
      onlyRadios
      radiosList={RADIOS}
      runnerList={[]}
      timeLossResults={null}
    />,
  )
  const [headerTable, bodyTable] = Array.from(container.querySelectorAll("table"))
  return { bodyTable, headerTable }
}

describe("SplitsTableLayout", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn()
        disconnect = vi.fn()
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders one header cell for the time and one per control", () => {
    const { headerTable } = renderLayout()

    expect(headerTable.querySelectorAll("thead tr > *")).toHaveLength(
      TIME_COLUMN_COUNT + RADIOS.length,
    )
  })

  it("gives the header one column per cell plus the two gutters", () => {
    const { headerTable } = renderLayout()

    expect(headerTable.querySelectorAll("col")).toHaveLength(
      TIME_COLUMN_COUNT + RADIOS.length + GUTTER_COLUMN_COUNT,
    )
  })

  it("repeats the header cells in a row of the body hidden from assistive technology", () => {
    const { bodyTable } = renderLayout()
    const widthSizerRow = bodyTable.querySelector("tbody tr")

    expect(widthSizerRow).toHaveAttribute("aria-hidden", "true")
    expect(widthSizerRow?.children).toHaveLength(TIME_COLUMN_COUNT + RADIOS.length)
  })

  it("scrolls the header along with the body", () => {
    const { bodyTable, headerTable } = renderLayout()
    const bodyScroller = bodyTable.parentElement as HTMLElement
    const headerScroller = headerTable.parentElement as HTMLElement

    bodyScroller.scrollLeft = 140
    bodyScroller.dispatchEvent(new Event("scroll"))

    expect(headerScroller.scrollLeft).toBe(140)
  })

  it("scrolls the body along with the header", () => {
    const { bodyTable, headerTable } = renderLayout()
    const bodyScroller = bodyTable.parentElement as HTMLElement
    const headerScroller = headerTable.parentElement as HTMLElement

    headerScroller.scrollLeft = 60
    headerScroller.dispatchEvent(new Event("scroll"))

    expect(bodyScroller.scrollLeft).toBe(60)
  })
})
