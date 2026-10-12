import { describe, expect, it } from "vitest"
import {
  AXIS_LABEL_CHARACTER_WIDTH_PX,
  AXIS_LEGEND_WIDTH_PX,
  AXIS_TICK_SPACE_PX,
  plotWidthPx,
  verticalAxisMarginPx,
} from "./chartLayout.ts"

describe("verticalAxisMarginPx", () => {
  it("fits the longest label", () => {
    expect(verticalAxisMarginPx(["00:00", "1:00:00"])).toBe(
      Math.ceil(7 * AXIS_LABEL_CHARACTER_WIDTH_PX + AXIS_TICK_SPACE_PX),
    )
  })

  it("adds room for a legend", () => {
    expect(verticalAxisMarginPx(["1°"], true)).toBe(
      verticalAxisMarginPx(["1°"]) + AXIS_LEGEND_WIDTH_PX,
    )
  })

  it("only keeps the room of the ticks when there are no labels", () => {
    expect(verticalAxisMarginPx([])).toBe(AXIS_TICK_SPACE_PX)
  })
})

describe("plotWidthPx", () => {
  it("takes both margins off the chart width", () => {
    expect(plotWidthPx(400, 50, 16)).toBe(334)
  })

  it("never goes negative before the chart is measured", () => {
    expect(plotWidthPx(0, 50, 16)).toBe(0)
  })
})
