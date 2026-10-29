import { describe, expect, it } from "vitest"
import { isStageEnded, isStageEndedById } from "./isStageEnded.ts"
import { StageModel, StateLogConst } from "../../shared/EntityTypes.ts"

const aStage = (id: string, states: StateLogConst[]): StageModel => ({
  id,
  description: `Stage ${id}`,
  external_url: null,
  last_logs: states.map((state) => ({ state, created: "2026-08-06T10:00:00+00:00" })),
  stage_type: { id: "stage-type", description: "Rogaine" },
  start: null,
})

const stages = [
  aStage("running", [StateLogConst.START, StateLogConst.RESULT]),
  aStage("ended", [StateLogConst.RESULT, StateLogConst.ENDED]),
  aStage("empty", []),
]

describe("isStageEnded", () => {
  it("is true when the stage was ended", () => {
    expect(isStageEnded(stages[1])).toBe(true)
  })

  it("is false when the stage only uploaded start times and results", () => {
    expect(isStageEnded(stages[0])).toBe(false)
  })

  it("is false when the stage has no logs", () => {
    expect(isStageEnded(stages[2])).toBe(false)
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
