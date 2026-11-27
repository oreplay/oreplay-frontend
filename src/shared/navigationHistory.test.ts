import { describe, expect, it } from "vitest"
import { hasInAppHistory } from "./navigationHistory.ts"

describe("hasInAppHistory", () => {
  it("is false on the first page of a visit", () => {
    expect(hasInAppHistory("default")).toBe(false)
  })

  it("is true after navigating inside the app", () => {
    expect(hasInAppHistory("a1b2c3")).toBe(true)
  })
})
