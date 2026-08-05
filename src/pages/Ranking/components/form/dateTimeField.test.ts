import { describe, expect, it } from "vitest"
import {
  combineDateAndTime,
  isoToDatePart,
  isoToTimePart,
  withDateChange,
  withTimeChange,
} from "./dateTimeField.ts"

describe("isoToDatePart", () => {
  it("extracts the date from an ISO instant", () => {
    expect(isoToDatePart("2026-05-01T08:30:00+00:00")).toBe("2026-05-01")
  })

  it("returns empty for empty or invalid input", () => {
    expect(isoToDatePart("")).toBe("")
    expect(isoToDatePart("not-a-date")).toBe("")
  })
})

describe("isoToTimePart", () => {
  it("extracts the time from an ISO instant", () => {
    expect(isoToTimePart("2026-05-01T08:30:00+00:00")).toBe("08:30")
  })

  it("returns empty for empty or invalid input", () => {
    expect(isoToTimePart("")).toBe("")
    expect(isoToTimePart("not-a-date")).toBe("")
  })
})

describe("combineDateAndTime", () => {
  it("combines a date and time into an ISO instant", () => {
    expect(combineDateAndTime("2026-05-01", "08:30")).toBe("2026-05-01T08:30:00.000+00:00")
  })

  it("falls back to midnight when the time is missing", () => {
    expect(combineDateAndTime("2026-05-01", "")).toBe("2026-05-01T00:00:00.000+00:00")
  })

  it("returns empty when the date is missing", () => {
    expect(combineDateAndTime("", "08:30")).toBe("")
  })
})

describe("withDateChange", () => {
  it("applies the default time when no time is selected yet", () => {
    expect(withDateChange("2026-05-01", "", "09:00")).toBe("2026-05-01T09:00:00.000+00:00")
  })

  it("keeps a time that is already selected", () => {
    expect(withDateChange("2026-05-02", "2026-05-01T14:30:00+00:00", "09:00")).toBe(
      "2026-05-02T14:30:00.000+00:00",
    )
  })

  it("falls back to midnight when there is no default time", () => {
    expect(withDateChange("2026-05-01", "")).toBe("2026-05-01T00:00:00.000+00:00")
  })

  it("clears the value when the date is cleared", () => {
    expect(withDateChange("", "2026-05-01T14:30:00+00:00", "09:00")).toBe("")
  })
})

describe("withTimeChange", () => {
  it("updates the time while keeping the date", () => {
    expect(withTimeChange("14:30", "2026-05-01T09:00:00+00:00")).toBe(
      "2026-05-01T14:30:00.000+00:00",
    )
  })

  it("returns empty when no date is selected yet", () => {
    expect(withTimeChange("14:30", "")).toBe("")
  })
})
