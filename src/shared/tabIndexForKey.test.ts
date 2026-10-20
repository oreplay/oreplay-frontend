import { describe, expect, it } from "vitest"
import { tabIndexForKey } from "./tabIndexForKey.ts"

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
