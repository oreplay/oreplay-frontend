import { describe, expect, it } from "vitest"
import { FINISH_STAGE_ITEM, getFinishStageItem, REOPEN_STAGE_ITEM } from "./finishStageMenuItems.ts"

describe("getFinishStageItem", () => {
  it("offers to make a provisional stage official", () => {
    expect(getFinishStageItem(false)).toBe(FINISH_STAGE_ITEM)
  })

  it("offers to make an official stage provisional again", () => {
    expect(getFinishStageItem(true)).toBe(REOPEN_STAGE_ITEM)
  })
})
