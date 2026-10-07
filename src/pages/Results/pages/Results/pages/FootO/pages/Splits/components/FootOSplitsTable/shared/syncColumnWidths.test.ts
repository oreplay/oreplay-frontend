import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { HorizontalBounds } from "./columnWidths.ts"
import syncColumnWidths from "./syncColumnWidths.ts"

let notifyResize: () => void
const observe = vi.fn()
const disconnect = vi.fn()

function placeAt(element: Element, bounds: HorizontalBounds) {
  element.getBoundingClientRect = () => ({ ...bounds }) as DOMRect
}

function createSourceRow(row: HorizontalBounds, cells: HorizontalBounds[]) {
  const sourceRow = document.createElement("tr")
  placeAt(sourceRow, row)
  cells.forEach((bounds) => placeAt(sourceRow.appendChild(document.createElement("td")), bounds))
  return sourceRow
}

function createTargetColumns(columnCount: number) {
  const targetColumns = document.createElement("colgroup")
  Array.from({ length: columnCount }).forEach(() =>
    targetColumns.appendChild(document.createElement("col")),
  )
  return targetColumns
}

function columnWidthsOf(targetColumns: HTMLElement) {
  return Array.from(targetColumns.querySelectorAll("col")).map((column) => column.style.width)
}

describe("syncColumnWidths", () => {
  beforeEach(() => {
    observe.mockClear()
    disconnect.mockClear()
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          notifyResize = callback
        }
        observe = observe
        disconnect = disconnect
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("copies the gutters and the cell widths of the row onto the columns", () => {
    const sourceRow = createSourceRow({ left: 0, right: 232 }, [
      { left: 16, right: 96 },
      { left: 96, right: 216 },
    ])
    const targetColumns = createTargetColumns(4)

    syncColumnWidths(sourceRow, targetColumns)

    expect(columnWidthsOf(targetColumns)).toEqual(["16px", "80px", "120px", "16px"])
  })

  it("observes the row and each of its cells", () => {
    const sourceRow = createSourceRow({ left: 0, right: 232 }, [
      { left: 16, right: 96 },
      { left: 96, right: 216 },
    ])

    syncColumnWidths(sourceRow, createTargetColumns(4))

    expect(observe).toHaveBeenCalledWith(sourceRow)
    expect(observe).toHaveBeenCalledWith(sourceRow.children[0])
    expect(observe).toHaveBeenCalledWith(sourceRow.children[1])
  })

  it("copies the widths again when a cell is resized", () => {
    const sourceRow = createSourceRow({ left: 0, right: 132 }, [{ left: 16, right: 116 }])
    const targetColumns = createTargetColumns(3)
    syncColumnWidths(sourceRow, targetColumns)

    placeAt(sourceRow, { left: 0, right: 182 })
    placeAt(sourceRow.children[0], { left: 16, right: 166 })
    notifyResize()

    expect(columnWidthsOf(targetColumns)).toEqual(["16px", "150px", "16px"])
  })

  it("leaves the columns that have no matching cell untouched", () => {
    const sourceRow = createSourceRow({ left: 0, right: 132 }, [{ left: 16, right: 116 }])
    const targetColumns = createTargetColumns(4)

    syncColumnWidths(sourceRow, targetColumns)

    expect(columnWidthsOf(targetColumns)).toEqual(["16px", "100px", "16px", ""])
  })

  it("stops observing once the sync is stopped", () => {
    const sourceRow = createSourceRow({ left: 0, right: 132 }, [{ left: 16, right: 116 }])
    const stopSync = syncColumnWidths(sourceRow, createTargetColumns(3))

    stopSync()

    expect(disconnect).toHaveBeenCalledOnce()
  })
})
