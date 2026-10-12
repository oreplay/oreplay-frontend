import { describe, expect, it } from "vitest"
import { positionLabel } from "./positionChartAxis.ts"

describe("positionLabel", () => {
  it("writes the position with the ordinal sign", () => {
    expect(positionLabel(3)).toBe("3°")
  })

  it("rounds fractional positions", () => {
    expect(positionLabel(2.6)).toBe("3°")
  })
})
