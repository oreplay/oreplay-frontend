import { describe, expect, it } from "vitest"
import { formatStageOrderTitle } from "./formatStageOrderTitle.ts"

describe("formatStageOrderTitle", () => {
  it("zero-pads the order to two digits and prefixes the description", () => {
    expect(formatStageOrderTitle(3, "Prologue")).toBe("03 - Prologue")
  })

  it("leaves orders of two or more digits unpadded", () => {
    expect(formatStageOrderTitle(12, "Stage")).toBe("12 - Stage")
    expect(formatStageOrderTitle(105, "Stage")).toBe("105 - Stage")
  })
})
