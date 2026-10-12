import { describe, expect, it } from "vitest"
import { MIN_AXIS_LABEL_GAP_PX, visibleAxisLabelIndexes } from "./axisLabels.ts"

describe("visibleAxisLabelIndexes", () => {
  it("labels every tick when they are far enough apart", () => {
    expect(visibleAxisLabelIndexes([0, 1, 2, 3], 300, 20)).toEqual(new Set([0, 1, 2, 3]))
  })

  it("drops a label that would overlap the previous one", () => {
    expect(visibleAxisLabelIndexes([0, 50, 55, 100], 100, 20)).toEqual(new Set([0, 1, 3]))
  })

  it("drops a label that would overlap the last one, which is always kept", () => {
    expect(visibleAxisLabelIndexes([0, 50, 95, 100], 100, 20)).toEqual(new Set([0, 1, 3]))
  })

  it("keeps only the first and the last label on a very short axis", () => {
    expect(visibleAxisLabelIndexes([0, 1, 2, 3, 4], 10, 20)).toEqual(new Set([0, 4]))
  })

  it("keeps every nth label of evenly spaced ticks", () => {
    expect(visibleAxisLabelIndexes([0, 1, 2, 3, 4, 5, 6], 60, 20)).toEqual(new Set([0, 2, 4, 6]))
  })

  it("labels nothing when there are no ticks", () => {
    expect(visibleAxisLabelIndexes([], 100)).toEqual(new Set())
  })

  it("labels a single tick", () => {
    expect(visibleAxisLabelIndexes([7], 100)).toEqual(new Set([0]))
  })

  it("uses the default gap when none is given", () => {
    const positions = [0, MIN_AXIS_LABEL_GAP_PX - 1, 100]

    expect(visibleAxisLabelIndexes(positions, 100)).toEqual(new Set([0, 2]))
  })
})
