import { describe, expect, it } from "vitest"
import { isTotalCircuitRacesMismatch } from "./overallSettings.ts"

const STAGE_ORDER_COUNT = 4

describe("isTotalCircuitRacesMismatch", () => {
  it("flags total circuit races that differ from the stage order count", () => {
    expect(isTotalCircuitRacesMismatch("totalCircuitRaces", 5, STAGE_ORDER_COUNT)).toBe(true)
  })

  it("accepts total circuit races equal to the stage order count", () => {
    expect(isTotalCircuitRacesMismatch("totalCircuitRaces", 4, STAGE_ORDER_COUNT)).toBe(false)
  })

  it("ignores an empty value", () => {
    expect(isTotalCircuitRacesMismatch("totalCircuitRaces", null, STAGE_ORDER_COUNT)).toBe(false)
  })

  it("ignores a stage order count that is not loaded yet", () => {
    expect(isTotalCircuitRacesMismatch("totalCircuitRaces", 5, undefined)).toBe(false)
  })

  it("ignores the other circuit settings", () => {
    expect(isTotalCircuitRacesMismatch("maxRacesCounted", 5, STAGE_ORDER_COUNT)).toBe(false)
  })
})
