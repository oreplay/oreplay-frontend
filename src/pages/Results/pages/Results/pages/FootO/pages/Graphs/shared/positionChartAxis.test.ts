import { describe, expect, it } from "vitest"
import { positionChartControls, positionLabel } from "./positionChartAxis.ts"

describe("positionChartControls", () => {
  it("lists every control once, by first appearance across the series", () => {
    const series = [
      { data: [{ x: "1" }, { x: "2" }, { x: "Finish" }] },
      { data: [{ x: "1" }, { x: "3" }, { x: "Finish" }] },
    ]

    expect(positionChartControls(series)).toEqual(["1", "2", "Finish", "3"])
  })

  it("is empty without series", () => {
    expect(positionChartControls([])).toEqual([])
  })
})

describe("positionLabel", () => {
  it("writes the position with the ordinal sign", () => {
    expect(positionLabel(3)).toBe("3°")
  })

  it("rounds fractional positions", () => {
    expect(positionLabel(2.6)).toBe("3°")
  })
})
