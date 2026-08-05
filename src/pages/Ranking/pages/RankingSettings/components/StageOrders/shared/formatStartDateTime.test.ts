import { describe, expect, it } from "vitest"
import { formatStartDateTime } from "./formatStartDateTime.ts"

describe("formatStartDateTime", () => {
  it("formats an ISO instant with the given locale", () => {
    expect(formatStartDateTime("2026-05-01T08:30:00+00:00", "en")).toContain("2026")
  })

  it("returns empty for empty or invalid input", () => {
    expect(formatStartDateTime("", "en")).toBe("")
    expect(formatStartDateTime("nope", "en")).toBe("")
  })
})
