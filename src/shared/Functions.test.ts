import { describe, it, expect } from "vitest"
import { formatScoreAsInteger, parseSecondsToMMSS, parseTimeBehind } from "./Functions.tsx"

describe("formatScoreAsInteger", () => {
  it("should return empty string for null or undefined inputs", () => {
    expect(formatScoreAsInteger(null)).toBe("")
    expect(formatScoreAsInteger(undefined)).toBe("")
  })

  it("should round integers and remove decimal places", () => {
    expect(formatScoreAsInteger(50)).toBe("50")
    expect(formatScoreAsInteger(50.0)).toBe("50")
    expect(formatScoreAsInteger(49.9999999)).toBe("49.9999999") // Has decimal places, display as-is
  })

  it("should preserve decimal values as-is when they exist", () => {
    expect(formatScoreAsInteger(50.5)).toBe("50.5")
    expect(formatScoreAsInteger(49.25)).toBe("49.25")
    expect(formatScoreAsInteger(100.1)).toBe("100.1")
    expect(formatScoreAsInteger(0.5)).toBe("0.5")
  })

  it("should handle negative numbers correctly", () => {
    expect(formatScoreAsInteger(-50)).toBe("-50")
    expect(formatScoreAsInteger(-50.0)).toBe("-50")
    expect(formatScoreAsInteger(-50.5)).toBe("-50.5")
  })

  it("should handle zero correctly", () => {
    expect(formatScoreAsInteger(0)).toBe("0")
    expect(formatScoreAsInteger(0.0)).toBe("0")
    expect(formatScoreAsInteger(0.1)).toBe("0.1")
  })
})

describe("parseSecondsToMMSS", () => {
  it("formats durations under an hour as mm:ss", () => {
    expect(parseSecondsToMMSS(65)).toBe("01:05")
  })

  it("formats durations of an hour or more as h:mm:ss", () => {
    expect(parseSecondsToMMSS(3700)).toBe("1:01:40")
  })

  it("puts a single minus in front of a negative duration", () => {
    expect(parseSecondsToMMSS(-5)).toBe("-00:05")
    expect(parseSecondsToMMSS(-65)).toBe("-01:05")
    expect(parseSecondsToMMSS(-3700)).toBe("-1:01:40")
  })
})

describe("parseTimeBehind", () => {
  it("keeps signing the time behind", () => {
    expect(parseTimeBehind(65)).toBe("+01:05")
    expect(parseTimeBehind(-65)).toBe("-01:05")
  })
})
