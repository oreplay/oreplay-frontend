import { describe, expect, it } from "vitest"
import { STAGE_TYPE_DATABASE_ID } from "./constants.ts"
import { isTrailOStage } from "./stageTypes.ts"

describe("isTrailOStage", () => {
  it("is true for a Trail-O stage", () => {
    expect(isTrailOStage(STAGE_TYPE_DATABASE_ID.TrailO)).toBe(true)
  })

  it("is false for any other stage type", () => {
    expect(isTrailOStage(STAGE_TYPE_DATABASE_ID.FootO)).toBe(false)
    expect(isTrailOStage(STAGE_TYPE_DATABASE_ID.Totals)).toBe(false)
  })

  it("is false when the stage has no type yet", () => {
    expect(isTrailOStage(null)).toBe(false)
    expect(isTrailOStage(undefined)).toBe(false)
  })
})
