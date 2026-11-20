import { describe, expect, it } from "vitest"
import { isStageEnded, isStageEndedById } from "./isStageEnded.ts"
import { StageModel } from "../../shared/EntityTypes.ts"
import { LastDates } from "../../domain/types/v1api"

const UPLOADED_AT = "2026-08-06T10:00:00.000+00:00"
const MADE_FINAL_AT = "2026-08-06T12:00:00.000+00:00"

const aStage = (id: string, lastDates: LastDates): StageModel => ({
  id,
  description: `Stage ${id}`,
  external_url: null,
  last_dates: lastDates,
  stage_type: { id: "stage-type", description: "Rogaine" },
  start: null,
})

const stages = [
  aStage("running", { start_list: UPLOADED_AT, results: UPLOADED_AT, final: null }),
  aStage("ended", { results: UPLOADED_AT, final: MADE_FINAL_AT }),
  aStage("empty", { cleared: null, start_list: null, results: null, final: null }),
]

describe("isStageEnded", () => {
  it("is true when the stage has a final date", () => {
    expect(isStageEnded(stages[1])).toBe(true)
  })

  it("is false when the stage only uploaded start times and results", () => {
    expect(isStageEnded(stages[0])).toBe(false)
  })

  it("is false when the stage has no dates", () => {
    expect(isStageEnded(stages[2])).toBe(false)
  })

  it("is false when the final date is missing", () => {
    expect(isStageEnded(aStage("partial", {}))).toBe(false)
  })

  it("is false without a stage", () => {
    expect(isStageEnded(undefined)).toBe(false)
  })
})

describe("isStageEndedById", () => {
  it("finds the stage and checks whether it was ended", () => {
    expect(isStageEndedById(stages, "ended")).toBe(true)
    expect(isStageEndedById(stages, "running")).toBe(false)
  })

  it("is false when the stage is not listed", () => {
    expect(isStageEndedById(stages, "unknown")).toBe(false)
  })
})
