import { describe, expect, it } from "vitest"
import { formatDate } from "./formatDate.ts"

describe("formatDate", () => {
  it("returns '' for empty input", () => {
    expect(formatDate("", "en")).toBe("")
    expect(formatDate(null, "en")).toBe("")
    expect(formatDate(undefined, "en")).toBe("")
  })

  it("returns the raw input when it can't be parsed", () => {
    expect(formatDate("not-a-date", "en")).toBe("not-a-date")
  })

  it("formats a valid ISO datetime as a date without time", () => {
    const result = formatDate("2026-06-27T10:30:00Z", "en")
    expect(result).toContain("2026")
    expect(result).not.toContain(":")
  })
})
