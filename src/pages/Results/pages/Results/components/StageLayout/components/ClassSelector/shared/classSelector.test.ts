import { describe, expect, it } from "vitest"
import {
  CLASS_SELECTOR_LABEL_KEYS,
  classSelectorLabelKey,
  classSelectorPanelId,
  classSelectorTabId,
  classSelectorTriggerText,
  filterByName,
  ignoreDashes,
  ignoreDashesAndUnderscores,
  tabForKind,
} from "./classSelector.ts"

const identity = (name: string) => name

describe("classSelectorLabelKey", () => {
  it("labels the selector after the kind of item being shown", () => {
    expect(classSelectorLabelKey(true)).toBe(CLASS_SELECTOR_LABEL_KEYS.classes)
    expect(classSelectorLabelKey(false)).toBe(CLASS_SELECTOR_LABEL_KEYS.clubs)
  })
})

describe("classSelectorTriggerText", () => {
  it("shows the active name when there is one", () => {
    expect(classSelectorTriggerText("M-21E", "Class")).toBe("M-21E")
  })

  it("falls back to the label when nothing is selected", () => {
    expect(classSelectorTriggerText(undefined, "Class")).toBe("Class")
    expect(classSelectorTriggerText("", "Class")).toBe("Class")
  })
})

describe("filterByName", () => {
  const names = ["M-21E", "F21E", "M16", "Open_Long"]

  it("returns every item for an empty query", () => {
    expect(filterByName(names, "", identity)).toEqual(names)
  })

  it("matches case-insensitively", () => {
    expect(filterByName(names, "f21", identity)).toEqual(["F21E"])
  })

  it("applies the normalizer to both the query and the names", () => {
    expect(filterByName(names, "m21", identity, ignoreDashes)).toEqual(["M-21E"])
    expect(filterByName(names, "m-21", identity, ignoreDashes)).toEqual(["M-21E"])
  })

  it("returns nothing when no name matches", () => {
    expect(filterByName(names, "W99", identity)).toEqual([])
  })
})

describe("ignoreDashes", () => {
  it("removes dashes only", () => {
    expect(ignoreDashes("M-21_E")).toBe("M21_E")
  })
})

describe("ignoreDashesAndUnderscores", () => {
  it("removes dashes and underscores", () => {
    expect(ignoreDashesAndUnderscores("Club-Name_X")).toBe("ClubNameX")
  })
})

describe("tabForKind", () => {
  it("maps the item kind to its tab", () => {
    expect(tabForKind(true)).toBe("classes")
    expect(tabForKind(false)).toBe("clubs")
  })
})

describe("tab ids", () => {
  it("builds distinct tab and panel ids", () => {
    expect(classSelectorTabId("clubs")).toBe("class-selector-tab-clubs")
    expect(classSelectorPanelId("clubs")).toBe("class-selector-panel-clubs")
  })
})
