import { describe, expect, it } from "vitest"
import { fittingLineCount, MIN_FITTING_LINES } from "./fittingLineCount.ts"

describe("fittingLineCount", () => {
  it("counts the whole lines that fit in the available height", () => {
    expect(fittingLineCount(100, 19.44)).toBe(5)
  })

  it("counts an exact fit as a whole line", () => {
    expect(fittingLineCount(60, 20)).toBe(3)
  })

  it("never returns fewer than the minimum, even when nothing fits", () => {
    expect(fittingLineCount(5, 20)).toBe(MIN_FITTING_LINES)
    expect(fittingLineCount(0, 20)).toBe(MIN_FITTING_LINES)
  })

  it("falls back to the minimum when the line height is not measurable", () => {
    expect(fittingLineCount(100, 0)).toBe(MIN_FITTING_LINES)
    expect(fittingLineCount(100, Number.NaN)).toBe(MIN_FITTING_LINES)
  })

  it("falls back to the minimum when the available height is not measurable", () => {
    expect(fittingLineCount(Number.NaN, 20)).toBe(MIN_FITTING_LINES)
  })
})
