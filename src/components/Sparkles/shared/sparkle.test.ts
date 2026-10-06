import { describe, expect, it } from "vitest"
import {
  ICON_SPARKLES,
  SPARKLE_PERIOD_SECONDS,
  sparklePathOf,
  sparkleTranslationOf,
} from "./sparkle.ts"

describe("sparklePathOf", () => {
  it("draws a closed four pointed star around the origin", () => {
    expect(sparklePathOf(4)).toBe("M0,-4 Q0,0 4,0 Q0,0 0,4 Q0,0 -4,0 Q0,0 0,-4 Z")
  })
})

describe("sparkleTranslationOf", () => {
  it("moves the sparkle to its position", () => {
    expect(sparkleTranslationOf({ delaySeconds: 0, radius: 2, x: 21, y: 3 })).toBe(
      "translate(21 3)",
    )
  })
})

describe("ICON_SPARKLES", () => {
  it("staggers every sparkle inside one animation period", () => {
    const delays = ICON_SPARKLES.map((sparkle) => sparkle.delaySeconds)

    expect(new Set(delays).size).toBe(delays.length)
    expect(Math.max(...delays)).toBeLessThan(SPARKLE_PERIOD_SECONDS)
  })
})
