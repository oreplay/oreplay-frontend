import { describe, expect, it } from "vitest"
import { DESKTOP_RESULT_TABS_BAR_HEIGHT_PX, resultsStickyTopPx } from "./desktopLayout.ts"

describe("resultsStickyTopPx", () => {
  it("leaves room for the result tabs bar on desktop", () => {
    expect(resultsStickyTopPx(false)).toBe(DESKTOP_RESULT_TABS_BAR_HEIGHT_PX)
  })

  it("sticks to the very top on mobile", () => {
    expect(resultsStickyTopPx(true)).toBe(0)
  })
})
