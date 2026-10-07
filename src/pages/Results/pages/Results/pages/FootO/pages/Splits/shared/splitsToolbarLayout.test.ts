import { describe, expect, it } from "vitest"
import { SPLITS_TOOLBAR_HEIGHT_PX, splitsTableHeaderStickyTopPx } from "./splitsToolbarLayout.ts"

describe("splitsTableHeaderStickyTopPx", () => {
  it("places the table header right below a toolbar stuck to the top", () => {
    expect(splitsTableHeaderStickyTopPx(0)).toBe(SPLITS_TOOLBAR_HEIGHT_PX)
  })

  it("adds the offset of the toolbar itself", () => {
    expect(splitsTableHeaderStickyTopPx(59)).toBe(59 + SPLITS_TOOLBAR_HEIGHT_PX)
  })
})
