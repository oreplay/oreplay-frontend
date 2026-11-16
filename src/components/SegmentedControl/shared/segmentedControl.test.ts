import { describe, expect, it } from "vitest"
import {
  SEGMENTED_CONTROL_MODE,
  segmentedControlOptionAria,
  segmentedControlOptionId,
  segmentedControlRole,
  segmentedControlThumbStyle,
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

describe("segmentedControlThumbStyle", () => {
  it("makes the thumb one equal share of the track, net of padding and gaps", () => {
    expect(segmentedControlThumbStyle(0, 3).width).toBe(
      "calc((100% - 2 * 0.25rem - 2 * 0.25rem) / 3)",
    )
  })

  it("keeps the thumb on the first choice when it is selected", () => {
    expect(segmentedControlThumbStyle(0, 2).transform).toBe(
      "translateX(calc(0 * (100% + 0.25rem)))",
    )
  })

  it("moves the thumb by its own width plus a gap for every choice before the selected one", () => {
    expect(segmentedControlThumbStyle(2, 3).transform).toBe(
      "translateX(calc(2 * (100% + 0.25rem)))",
    )
  })

  it("shows the thumb while a choice is selected", () => {
    expect(segmentedControlThumbStyle(1, 2).opacity).toBe(1)
  })

  it("hides the thumb when no choice is selected", () => {
    expect(segmentedControlThumbStyle(-1, 2)).toEqual({
      bottom: "0.25rem",
      left: "0.25rem",
      opacity: 0,
      top: "0.25rem",
      transform: "translateX(calc(0 * (100% + 0.25rem)))",
      width: "calc((100% - 2 * 0.25rem - 1 * 0.25rem) / 2)",
    })
  })

  it("hides the thumb of a control without choices", () => {
    expect(segmentedControlThumbStyle(0, 0).opacity).toBe(0)
  })
})
