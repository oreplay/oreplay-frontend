import { DateTime } from "luxon"
import { checkIfTimezonesMatch } from "./timezoneFunctions.ts"
import { describe, it, expect } from "vitest"

describe("checkIfTimezonesMatch", () => {
  it("returns true for identical timezones", () => {
    const when = DateTime.fromISO("2024-01-15T12:00:00Z")

    const result = checkIfTimezonesMatch(when, "Europe/Madrid", "Europe/Madrid")

    expect(result).toBe(true)
  })

  it("returns true for different timezones with same offset", () => {
    const when = DateTime.fromISO("2024-01-15T12:00:00Z")

    // Madrid and Paris share the same offset in winter
    const result = checkIfTimezonesMatch(when, "Europe/Madrid", "Europe/Paris")

    expect(result).toBe(true)
  })

  it("returns false for timezones with different offsets", () => {
    const when = DateTime.fromISO("2024-01-15T12:00:00Z")

    const result = checkIfTimezonesMatch(when, "Europe/Madrid", "America/New_York")

    expect(result).toBe(false)
  })

  it("handles DST differences correctly (summer)", () => {
    const when = DateTime.fromISO("2024-07-15T12:00:00Z")

    // Madrid (UTC+2) vs London (UTC+1 in summer)
    const result = checkIfTimezonesMatch(when, "Europe/Madrid", "Europe/London")

    expect(result).toBe(false)
  })

  it("handles DST differences correctly (winter)", () => {
    const when = DateTime.fromISO("2024-01-15T12:00:00Z")

    // Madrid (UTC+1) vs London (UTC+0 in winter)
    const result = checkIfTimezonesMatch(when, "Europe/Madrid", "Europe/London")

    expect(result).toBe(false)
  })

  it("returns true for UTC vs GMT-equivalent timezone", () => {
    const when = DateTime.fromISO("2024-01-15T12:00:00Z")

    const result = checkIfTimezonesMatch(when, "UTC", "Etc/UTC")

    expect(result).toBe(true)
  })
})
