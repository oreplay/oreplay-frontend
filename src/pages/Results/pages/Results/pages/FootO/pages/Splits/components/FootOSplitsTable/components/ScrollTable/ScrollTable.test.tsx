import { createContext, useContext } from "react"
import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ScrollTable from "./ScrollTable.tsx"
import {
  ScrollTableCellContentProps,
  ScrollTableHeaderCellContentProps,
  ScrollTableRowHeadingProps,
} from "./shared/scrollTableProps.ts"

const COLUMNS = ["time", "first", "second"]
const ROWS = ["anna", "bea"]
const GUTTER_COLUMN_COUNT = 2
const WIDTH_SIZER_ROW_COUNT = 1
const ROWS_PER_ROW = 2

const UnitContext = createContext("seconds")
const rowHeadingRenders = vi.fn()

const identity = (value: string) => value

function CellContent({ column, row }: ScrollTableCellContentProps<string, string>) {
  const unit = useContext(UnitContext)
  return `${row} ${column} in ${unit}`
}

function HeaderCellContent({ column }: ScrollTableHeaderCellContentProps<string>) {
  return column
}

function RowHeading({ row }: ScrollTableRowHeadingProps<string>) {
  rowHeadingRenders(row)
  return row
}

function TableIn({ unit }: { unit: string }) {
  return (
    <UnitContext.Provider value={unit}>
      <ScrollTable
        CellContent={CellContent}
        columns={COLUMNS}
        getColumnKey={identity}
        getRowKey={identity}
        HeaderCellContent={HeaderCellContent}
        RowHeading={RowHeading}
        rows={ROWS}
      />
    </UnitContext.Provider>
  )
}

function renderTable() {
  const { container, rerender } = render(<TableIn unit="seconds" />)
  const [headerTable, bodyTable] = Array.from(container.querySelectorAll("table"))
  const bodyScroller = bodyTable.parentElement as HTMLElement
  const headerScroller = headerTable.parentElement as HTMLElement
  const showIn = (unit: string) => rerender(<TableIn unit={unit} />)
  return { bodyScroller, bodyTable, headerScroller, headerTable, showIn }
}

describe("ScrollTable", () => {
  beforeEach(() => {
    rowHeadingRenders.mockClear()
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

  it("renders one header cell per column", () => {
    const { headerTable } = renderTable()

    const headerCells = Array.from(headerTable.querySelectorAll("thead tr > *"))

    expect(headerCells.map((cell) => cell.textContent)).toEqual(COLUMNS)
  })

  it("gives the header one column per cell plus the two gutters", () => {
    const { headerTable } = renderTable()

    expect(headerTable.querySelectorAll("col")).toHaveLength(COLUMNS.length + GUTTER_COLUMN_COUNT)
  })

  it("repeats the header cells in a row of the body hidden from assistive technology", () => {
    const { bodyTable } = renderTable()
    const widthSizerRow = bodyTable.querySelector("tbody tr")

    expect(widthSizerRow).toHaveAttribute("aria-hidden", "true")
    expect(widthSizerRow?.children).toHaveLength(COLUMNS.length)
  })

  it("renders a heading and a row of cells for every row", () => {
    const { bodyTable } = renderTable()

    expect(bodyTable.querySelectorAll("tbody tr")).toHaveLength(
      WIDTH_SIZER_ROW_COUNT + ROWS.length * ROWS_PER_ROW,
    )
    expect(bodyTable).toHaveTextContent("anna first in seconds")
  })

  it("scrolls the header along with the body", () => {
    const { bodyScroller, headerScroller } = renderTable()

    bodyScroller.scrollLeft = 140
    bodyScroller.dispatchEvent(new Event("scroll"))

    expect(headerScroller.scrollLeft).toBe(140)
  })

  it("scrolls the body along with the header", () => {
    const { bodyScroller, headerScroller } = renderTable()

    headerScroller.scrollLeft = 60
    headerScroller.dispatchEvent(new Event("scroll"))

    expect(bodyScroller.scrollLeft).toBe(60)
  })

  it("updates only the cell content when the context read by the cells changes", () => {
    const { bodyTable, showIn } = renderTable()
    const cellsBefore = Array.from(bodyTable.querySelectorAll("td"))
    rowHeadingRenders.mockClear()

    showIn("minutes")

    expect(bodyTable).toHaveTextContent("anna first in minutes")
    expect(Array.from(bodyTable.querySelectorAll("td"))).toEqual(cellsBefore)
    expect(rowHeadingRenders).not.toHaveBeenCalled()
  })

  it("keeps the scroll position when the context read by the cells changes", () => {
    const { bodyScroller, headerScroller, showIn } = renderTable()
    bodyScroller.scrollLeft = 140
    bodyScroller.dispatchEvent(new Event("scroll"))

    showIn("minutes")

    expect(bodyScroller.scrollLeft).toBe(140)
    expect(headerScroller.scrollLeft).toBe(140)
  })
})
