import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { formatEventDateRange, formatStageStart } from "./eventDates.ts"
import { parseDate } from "../../../shared/Functions.tsx"

describe("formatEventDateRange", () => {
  it("returns null when a date is missing", () => {
    expect(formatEventDateRange(undefined, "2026-04-12")).toBeNull()
    expect(formatEventDateRange("2026-04-12", undefined)).toBeNull()
    expect(formatEventDateRange("", "")).toBeNull()
  })

  it("returns a single date for one-day events", () => {
    expect(formatEventDateRange("2026-04-12", "2026-04-12")).toBe(parseDate("2026-04-12"))
  })

  it("returns a range for multi-day events", () => {
    expect(formatEventDateRange("2026-04-12", "2026-04-13")).toBe(
      `${parseDate("2026-04-12")} - ${parseDate("2026-04-13")}`,
    )
  })
})

describe("formatStageStart", () => {
  it("formats the stage start with weekday, date and time", () => {
    const start = "2026-04-12T10:00:00.000Z"
    expect(formatStageStart(start)).toBe(
      DateTime.fromISO(start).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
    )
  })
})
