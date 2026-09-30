import { describe, expect, it } from "vitest"
import { RESULT_TAB } from "./constants.ts"
import { hasOneChildPerTab, resultTabId, resultTabPanelId, tabIndexForKey } from "./resultTabs.ts"

describe("hasOneChildPerTab", () => {
  it("accepts matching lengths", () => {
    expect(hasOneChildPerTab([1, 2], [RESULT_TAB.Results, RESULT_TAB.Splits])).toBe(true)
  })

  it("rejects mismatching lengths", () => {
    expect(hasOneChildPerTab([1], [RESULT_TAB.Results, RESULT_TAB.Splits])).toBe(false)
  })
})

describe("resultTabId / resultTabPanelId", () => {
  it("builds distinct ids that link a tab with its panel", () => {
    expect(resultTabId(RESULT_TAB.Splits)).toBe("result-tab-splits")
    expect(resultTabPanelId(RESULT_TAB.Splits)).toBe("result-tabpanel-splits")
  })
})

describe("tabIndexForKey", () => {
  it("moves to the next tab and wraps around", () => {
    expect(tabIndexForKey("ArrowRight", 0, 3)).toBe(1)
    expect(tabIndexForKey("ArrowRight", 2, 3)).toBe(0)
  })

  it("moves to the previous tab and wraps around", () => {
    expect(tabIndexForKey("ArrowLeft", 1, 3)).toBe(0)
    expect(tabIndexForKey("ArrowLeft", 0, 3)).toBe(2)
  })

  it("jumps to the first and last tabs", () => {
    expect(tabIndexForKey("Home", 2, 3)).toBe(0)
    expect(tabIndexForKey("End", 0, 3)).toBe(2)
  })

  it("ignores any other key", () => {
    expect(tabIndexForKey("Enter", 1, 3)).toBeNull()
  })
})
