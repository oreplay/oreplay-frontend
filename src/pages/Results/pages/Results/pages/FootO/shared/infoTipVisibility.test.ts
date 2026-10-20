import { describe, expect, it } from "vitest"
import { isInfoTipVisible, isMousePointer, MOUSE_POINTER_TYPE } from "./infoTipVisibility.ts"

describe("isInfoTipVisible", () => {
  it("hides the explanation while it is neither hovered nor pinned", () => {
    expect(isInfoTipVisible(false, false)).toBe(false)
  })

  it("shows the explanation while it is hovered", () => {
    expect(isInfoTipVisible(true, false)).toBe(true)
  })

  it("keeps a pinned explanation on screen after the pointer leaves", () => {
    expect(isInfoTipVisible(false, true)).toBe(true)
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
