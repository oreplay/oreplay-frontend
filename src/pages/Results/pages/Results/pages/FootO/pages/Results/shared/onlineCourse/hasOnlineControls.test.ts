import { describe, expect, it } from "vitest"
import hasOnlineControls from "./hasOnlineControls.ts"
import {
  buildFinishSplit,
  buildOnlineSplit,
  buildRunnerWithOnlineSplits,
} from "./onlineCourseFixtures.ts"

describe("hasOnlineControls", () => {
  it("is true when the class of the runner has online controls", () => {
    const runner = buildRunnerWithOnlineSplits({
      onlineSplits: [buildOnlineSplit(31, 1, null), buildFinishSplit(null)],
    })

    expect(hasOnlineControls(runner)).toBe(true)
  })

  it("is false when the class of the runner has no online controls", () => {
    expect(hasOnlineControls(buildRunnerWithOnlineSplits({ onlineSplits: [] }))).toBe(false)
  })
})
