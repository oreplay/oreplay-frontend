import { describe, expect, it } from "vitest"
import {
  isDescriptionVisible,
  isMousePointer,
  MOUSE_POINTER_TYPE,
} from "./descriptionVisibility.ts"

describe("isDescriptionVisible", () => {
  it("hides the explanation while it is neither hovered nor pinned", () => {
    expect(isDescriptionVisible(false, false)).toBe(false)
  })

  it("shows the explanation while it is hovered", () => {
    expect(isDescriptionVisible(true, false)).toBe(true)
  })

  it("keeps a pinned explanation on screen after the pointer leaves", () => {
    expect(isDescriptionVisible(false, true)).toBe(true)
  })
})

describe("isMousePointer", () => {
  it("accepts a mouse", () => {
    expect(isMousePointer(MOUSE_POINTER_TYPE)).toBe(true)
  })

  it("rejects a touch", () => {
    expect(isMousePointer("touch")).toBe(false)
  })
})
