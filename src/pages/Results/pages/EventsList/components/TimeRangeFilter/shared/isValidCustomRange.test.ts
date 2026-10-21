import { describe, expect, it } from "vitest"
import { isValidCustomRange } from "./isValidCustomRange.ts"

describe("isValidCustomRange", () => {
  it("accepts an ordered range", () => {
    expect(isValidCustomRange("2026-01-01", "2026-02-01")).toBe(true)
  })

  it("accepts a single-day range", () => {
    expect(isValidCustomRange("2026-01-01", "2026-01-01")).toBe(true)
  })

  it("rejects a reversed range", () => {
    expect(isValidCustomRange("2026-02-01", "2026-01-01")).toBe(false)
  })

  it("rejects a range missing either bound", () => {
    expect(isValidCustomRange(undefined, "2026-01-01")).toBe(false)
    expect(isValidCustomRange("2026-01-01", undefined)).toBe(false)
  })

  it("rejects an unparseable date", () => {
    expect(isValidCustomRange("not-a-date", "2026-01-01")).toBe(false)
  })
})
