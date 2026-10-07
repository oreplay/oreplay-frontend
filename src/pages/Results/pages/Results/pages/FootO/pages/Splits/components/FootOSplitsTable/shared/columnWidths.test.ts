import { describe, expect, it } from "vitest"
import { columnWidthsWithGutters } from "./columnWidths.ts"

describe("columnWidthsWithGutters", () => {
  it("returns the width of every cell between the leading and trailing gutters", () => {
    const row = { left: 0, right: 232 }
    const cells = [
      { left: 16, right: 116 },
      { left: 116, right: 216 },
    ]

    expect(columnWidthsWithGutters(row, cells)).toEqual([16, 100, 100, 16])
  })

  it("measures the gutters the browser stretched instead of assuming their size", () => {
    const row = { left: 0, right: 300 }
    const cells = [{ left: 40, right: 250 }]

    expect(columnWidthsWithGutters(row, cells)).toEqual([40, 210, 50])
  })

  it("is not affected by how far the row has been scrolled", () => {
    const row = { left: -500, right: -268 }
    const cells = [
      { left: -484, right: -384 },
      { left: -384, right: -284 },
    ]

    expect(columnWidthsWithGutters(row, cells)).toEqual([16, 100, 100, 16])
  })

  it("keeps fractional widths so the columns do not drift apart", () => {
    const row = { left: 0, right: 100.5 }
    const cells = [{ left: 16, right: 84.5 }]

    expect(columnWidthsWithGutters(row, cells)).toEqual([16, 68.5, 16])
  })

  it("has no gutter when the cells fill the row", () => {
    const row = { left: 0, right: 100 }
    const cells = [{ left: 0, right: 100 }]

    expect(columnWidthsWithGutters(row, cells)).toEqual([0, 100, 0])
  })

  it("returns no widths for a row without cells", () => {
    expect(columnWidthsWithGutters({ left: 0, right: 100 }, [])).toEqual([])
  })
})
