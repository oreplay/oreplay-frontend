import { describe, expect, it } from "vitest"
import { StageModel } from "../../../../../../../../../shared/EntityTypes.ts"
import { STAGE_TYPE_DATABASE_ID } from "../../../../../../../../Results/pages/Results/shared/constants.ts"
import { defaultStageId, NO_STAGE_SELECTED, selectedStageId } from "./stageSelection.ts"

const stage = (id: string): StageModel => ({
  id,
  description: id,
  last_logs: [],
  stage_type: { id: STAGE_TYPE_DATABASE_ID.FootO, description: "Foot-O, MTBO, Ski-O" },
  start: null,
})

describe("defaultStageId", () => {
  it("selects the only stage of the event", () => {
    expect(defaultStageId([stage("only")])).toBe("only")
  })

  it("leaves the choice to the user when there are several stages", () => {
    expect(defaultStageId([stage("first"), stage("second")])).toBe(NO_STAGE_SELECTED)
  })

  it("selects nothing when the event has no stages", () => {
    expect(defaultStageId([])).toBe(NO_STAGE_SELECTED)
  })
})

describe("selectedStageId", () => {
  it("keeps the stage the user chose while it exists", () => {
    expect(selectedStageId([stage("first"), stage("second")], "second")).toBe("second")
  })

  it("falls back to the only stage when nothing was chosen", () => {
    expect(selectedStageId([stage("created-later")], NO_STAGE_SELECTED)).toBe("created-later")
  })

  it("drops a chosen stage that no longer exists", () => {
    expect(selectedStageId([stage("first"), stage("second")], "deleted")).toBe(NO_STAGE_SELECTED)
  })
})
