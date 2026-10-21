import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { toIsoDate } from "./toIsoDate.ts"

describe("toIsoDate", () => {
  it("formats a valid date as yyyy-MM-dd", () => {
    expect(toIsoDate(DateTime.fromISO("2026-03-14T10:00:00"))).toBe("2026-03-14")
  })

  it("returns undefined for a cleared picker", () => {
    expect(toIsoDate(null)).toBeUndefined()
  })

  it("returns undefined for an invalid date", () => {
    expect(toIsoDate(DateTime.invalid("typed garbage"))).toBeUndefined()
  })
})
