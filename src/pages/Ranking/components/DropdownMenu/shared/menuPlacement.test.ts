import { describe, expect, it } from "vitest"
import { menuPlacement } from "./menuPlacement.ts"

const VIEWPORT_HEIGHT = 800
const MENU_HEIGHT = 200

describe("menuPlacement", () => {
  it("opens below the trigger when the menu fits there", () => {
    expect(
      menuPlacement({
        triggerTop: 100,
        triggerBottom: 120,
        menuHeight: MENU_HEIGHT,
        viewportHeight: VIEWPORT_HEIGHT,
      }),
    ).toBe("below")
  })

  it("opens above the trigger when the menu would run past the bottom of the viewport", () => {
    expect(
      menuPlacement({
        triggerTop: 700,
        triggerBottom: 720,
        menuHeight: MENU_HEIGHT,
        viewportHeight: VIEWPORT_HEIGHT,
      }),
    ).toBe("above")
  })

  it("stays below when the menu fits neither below nor above", () => {
    expect(
      menuPlacement({
        triggerTop: 150,
        triggerBottom: 170,
        menuHeight: 700,
        viewportHeight: VIEWPORT_HEIGHT,
      }),
    ).toBe("below")
  })

  it("counts the gap between trigger and menu", () => {
    expect(
      menuPlacement({
        triggerTop: 400,
        triggerBottom: 598,
        menuHeight: MENU_HEIGHT,
        viewportHeight: VIEWPORT_HEIGHT,
      }),
    ).toBe("above")
  })
})
