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

const HEADER_STICKY_TOP_PX = 60
const HEADING_COLUMN_HEADER = "name"

interface TableInProps {
  headingColumnHeader?: string
  unit: string
}

function TableIn({ headingColumnHeader, unit }: TableInProps) {
  return (
    <UnitContext.Provider value={unit}>
      <ScrollTable
        CellContent={CellContent}
        columns={COLUMNS}
        getColumnKey={identity}
        getRowKey={identity}
        HeaderCellContent={HeaderCellContent}
        headerStickyTopPx={HEADER_STICKY_TOP_PX}
        headingColumnHeader={headingColumnHeader}
        RowHeading={RowHeading}
        rows={ROWS}
      />
    </UnitContext.Provider>
  )
}

function renderTable(headingColumnHeader?: string) {
  const { container, rerender } = render(
    <TableIn headingColumnHeader={headingColumnHeader} unit="seconds" />,
  )
  const [headerTable, bodyTable] = Array.from(container.querySelectorAll("table"))
  const bodyScroller = bodyTable.parentElement as HTMLElement
  const headerScroller = headerTable.parentElement as HTMLElement
  const showIn = (unit: string) =>
    rerender(<TableIn headingColumnHeader={headingColumnHeader} unit={unit} />)
  return { bodyScroller, bodyTable, headerScroller, headerTable, showIn }
}

function stubScreenWidth(isWide: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    matches: isWide,
    media: query,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  }))
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

  it("sticks the header at the given distance from the top", () => {
    const { headerScroller } = renderTable()

    expect(headerScroller.parentElement).toHaveStyle({
      position: "sticky",
      top: `${HEADER_STICKY_TOP_PX}px`,
    })
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

  it("heads the heading column first on wide screens", () => {
    stubScreenWidth(true)
    const { headerTable } = renderTable(HEADING_COLUMN_HEADER)

    const headerCells = Array.from(headerTable.querySelectorAll("thead tr > *"))

    expect(headerCells.map((cell) => cell.textContent)).toEqual([HEADING_COLUMN_HEADER, ...COLUMNS])
    expect(headerTable.querySelectorAll("col")).toHaveLength(
      COLUMNS.length + 1 + GUTTER_COLUMN_COUNT,
    )
  })

  it("puts each heading in the first cell of its row on wide screens", () => {
    stubScreenWidth(true)
    const { bodyTable } = renderTable(HEADING_COLUMN_HEADER)
    const [widthSizerRow, ...rows] = Array.from(bodyTable.querySelectorAll("tbody tr"))

    expect(widthSizerRow.children).toHaveLength(COLUMNS.length + 1)
    expect(rows.map((row) => row.children[0].textContent)).toEqual(ROWS)
    expect(rows[0].children).toHaveLength(COLUMNS.length + 1)
  })

  it("keeps each heading on its own line on narrow screens", () => {
    stubScreenWidth(false)
    const { bodyTable, headerTable } = renderTable(HEADING_COLUMN_HEADER)

    expect(headerTable.querySelectorAll("thead tr > *")).toHaveLength(COLUMNS.length)
    expect(bodyTable.querySelectorAll("tbody tr")).toHaveLength(
      WIDTH_SIZER_ROW_COUNT + ROWS.length * ROWS_PER_ROW,
    )
  })

  it("keeps each heading on its own line on wide screens without a heading column header", () => {
    stubScreenWidth(true)
    const { bodyTable } = renderTable()

    expect(bodyTable.querySelectorAll("tbody tr")).toHaveLength(
      WIDTH_SIZER_ROW_COUNT + ROWS.length * ROWS_PER_ROW,
    )
  })
})
