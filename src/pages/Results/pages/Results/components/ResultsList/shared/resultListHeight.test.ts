import { describe, expect, it } from "vitest"
import { MOBILE_FLOATING_BUTTON_BOTTOM_OFFSET_PX } from "../../../shared/mobileLayout.ts"
import {
  computeResultListHeight,
  RESULT_LIST_DESKTOP_BOTTOM_GAP_PX,
  RESULT_LIST_MIN_HEIGHT_PX,
  resultListBottomGapPx,
} from "./resultListHeight.ts"

const BOTTOM_GAP_PX = 72

describe("computeResultListHeight", () => {
  it("fills the viewport below the list minus the bottom gap", () => {
    const viewportHeight = 1000
    const listDocumentTop = 300

    expect(computeResultListHeight(viewportHeight, listDocumentTop, BOTTOM_GAP_PX)).toBe(
      viewportHeight - listDocumentTop - BOTTOM_GAP_PX,
    )
  })

  it("reaches the bottom of the viewport when there is no bottom gap", () => {
    expect(computeResultListHeight(1000, 300, 0)).toBe(700)
  })

  it("never goes below the minimum height", () => {
    expect(computeResultListHeight(400, 300, BOTTOM_GAP_PX)).toBe(RESULT_LIST_MIN_HEIGHT_PX)
  })

  it("rounds fractional pixel values", () => {
    const expected = 1000 - 300 - BOTTOM_GAP_PX
    expect(computeResultListHeight(1000, 300.4, BOTTOM_GAP_PX)).toBe(expected)
  })
})

describe("resultListBottomGapPx", () => {
  it("leaves no gap on desktop", () => {
    expect(resultListBottomGapPx(false)).toBe(RESULT_LIST_DESKTOP_BOTTOM_GAP_PX)
  })

  it("stops above the bottom navigation on a mobile device", () => {
    expect(resultListBottomGapPx(true)).toBe(MOBILE_FLOATING_BUTTON_BOTTOM_OFFSET_PX)
  })
})
