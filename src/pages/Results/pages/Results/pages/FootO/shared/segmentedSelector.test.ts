import { describe, expect, it } from "vitest"
import { segmentedSelectorOptionId } from "./segmentedSelector.ts"

describe("segmentedSelectorOptionId", () => {
  it("gives every option of a selector a different id", () => {
    expect(segmentedSelectorOptionId("selector", "a")).not.toBe(
      segmentedSelectorOptionId("selector", "b"),
    )
  })

  it("gives the same option of two selectors different ids", () => {
    expect(segmentedSelectorOptionId("first", "a")).not.toBe(
      segmentedSelectorOptionId("second", "a"),
    )
  })
})
