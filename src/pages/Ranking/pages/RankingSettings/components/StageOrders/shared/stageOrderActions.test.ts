import { describe, expect, it } from "vitest"
import { isSourceStageAction, STAGE_ORDER_ACTIONS } from "./stageOrderActions.ts"

describe("STAGE_ORDER_ACTIONS", () => {
  it("keeps the menu order edit, organizers, process, export, stats", () => {
    expect(STAGE_ORDER_ACTIONS.map(({ key }) => key)).toEqual([
      "edit",
      "organizers",
      "process",
      "export",
      "stats",
    ])
  })
})

describe("isSourceStageAction", () => {
  it("is true only for actions that operate on the source stage", () => {
    expect(STAGE_ORDER_ACTIONS.map(({ key }) => key).filter(isSourceStageAction)).toEqual([
      "process",
      "export",
      "stats",
    ])
  })
})
