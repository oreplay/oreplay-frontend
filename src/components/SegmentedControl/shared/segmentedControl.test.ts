import { describe, expect, it } from "vitest"
import {
  SEGMENTED_CONTROL_MODE,
  segmentedControlOptionAria,
  segmentedControlOptionId,
  segmentedControlRole,
} from "./segmentedControl.ts"

describe("segmentedControlOptionId", () => {
  it("gives every option of a control a different id", () => {
    expect(segmentedControlOptionId("control", "a")).not.toBe(
      segmentedControlOptionId("control", "b"),
    )
  })

  it("gives the same option of two controls different ids", () => {
    expect(segmentedControlOptionId("first", "a")).not.toBe(segmentedControlOptionId("second", "a"))
  })
})

describe("segmentedControlRole", () => {
  it("groups tabs in a tab list", () => {
    expect(segmentedControlRole(SEGMENTED_CONTROL_MODE.Tabs)).toBe("tablist")
  })

  it("groups values in a radio group", () => {
    expect(segmentedControlRole(SEGMENTED_CONTROL_MODE.Radio)).toBe("radiogroup")
  })
})

describe("segmentedControlOptionAria", () => {
  it("marks a tab as selected and links it to its panel", () => {
    expect(segmentedControlOptionAria(SEGMENTED_CONTROL_MODE.Tabs, true, "panel")).toEqual({
      role: "tab",
      "aria-selected": true,
      "aria-controls": "panel",
    })
  })

  it("marks a value as checked", () => {
    expect(segmentedControlOptionAria(SEGMENTED_CONTROL_MODE.Radio, false)).toEqual({
      role: "radio",
      "aria-checked": false,
    })
  })
})
