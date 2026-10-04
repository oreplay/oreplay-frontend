import { describe, expect, it } from "vitest"
import {
  computeResultListHeight,
  RESULT_LIST_BOTTOM_GAP_PX,
  RESULT_LIST_MIN_HEIGHT_PX,
} from "./resultListHeight.ts"

describe("computeResultListHeight", () => {
  it("fills the viewport below the list minus the bottom gap", () => {
    const viewportHeight = 1000
    const listDocumentTop = 300

    expect(computeResultListHeight(viewportHeight, listDocumentTop)).toBe(
      viewportHeight - listDocumentTop - RESULT_LIST_BOTTOM_GAP_PX,
    )
  })

  it("never goes below the minimum height", () => {
    expect(computeResultListHeight(400, 300)).toBe(RESULT_LIST_MIN_HEIGHT_PX)
  })

  it("rounds fractional pixel values", () => {
    const expected = 1000 - 300 - RESULT_LIST_BOTTOM_GAP_PX
    expect(computeResultListHeight(1000, 300.4)).toBe(expected)
  })
})
