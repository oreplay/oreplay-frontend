import { describe, expect, it } from "vitest"
import onlineCourseGeometry, {
  CONTROL_RADIUS_PX,
  NODE_SPACING_PX,
  START_TRIANGLE_SIDE_PX,
  startTrianglePoints,
} from "./onlineCourseGeometry.ts"

const NODE_COUNT = 4

describe("onlineCourseGeometry", () => {
  it("places the nodes at a fixed spacing", () => {
    const { nodeXs } = onlineCourseGeometry(NODE_COUNT)

    expect(nodeXs).toHaveLength(NODE_COUNT)
    nodeXs.slice(1).forEach((x, index) => {
      expect(x - nodeXs[index]).toBe(NODE_SPACING_PX)
    })
  })

  it("places a control at the same x whatever the length of the course", () => {
    const shortCourse = onlineCourseGeometry(NODE_COUNT)
    const longCourse = onlineCourseGeometry(NODE_COUNT + 3)

    expect(longCourse.nodeXs.slice(0, NODE_COUNT)).toEqual(shortCourse.nodeXs)
  })

  it("has one leg between every pair of consecutive nodes", () => {
    expect(onlineCourseGeometry(NODE_COUNT).legs).toHaveLength(NODE_COUNT - 1)
  })

  it("starts the first leg at the apex of the start triangle", () => {
    const { legs, nodeXs } = onlineCourseGeometry(NODE_COUNT)
    const triangleHeight = (START_TRIANGLE_SIDE_PX * Math.sqrt(3)) / 2

    expect(legs[0].startX).toBeCloseTo(nodeXs[0] + (triangleHeight * 2) / 3)
  })

  it("runs the legs from the edge of a circle to the edge of the next one", () => {
    const { legs, nodeXs } = onlineCourseGeometry(NODE_COUNT)

    expect(legs[1]).toEqual({
      endX: nodeXs[2] - CONTROL_RADIUS_PX,
      startX: nodeXs[1] + CONTROL_RADIUS_PX,
    })
  })

  it("is wide enough to hold the last node and grows with the course", () => {
    const shortCourse = onlineCourseGeometry(NODE_COUNT)
    const longCourse = onlineCourseGeometry(NODE_COUNT + 1)

    expect(shortCourse.width).toBeGreaterThan(
      shortCourse.nodeXs[NODE_COUNT - 1] + CONTROL_RADIUS_PX,
    )
    expect(longCourse.width - shortCourse.width).toBe(NODE_SPACING_PX)
    expect(longCourse.height).toBe(shortCourse.height)
  })

  it("has no legs for a course without nodes", () => {
    expect(onlineCourseGeometry(0)).toMatchObject({ legs: [], nodeXs: [] })
  })
})

describe("startTrianglePoints", () => {
  it("draws an equilateral triangle pointing towards the first control", () => {
    const [[topX, topY], [apexX, apexY], [bottomX, bottomY]] = startTrianglePoints(100, 50)
      .split(" ")
      .map((point) => point.split(",").map(Number))

    expect(topX).toBe(bottomX)
    expect(bottomY - topY).toBe(START_TRIANGLE_SIDE_PX)
    expect(apexY).toBe(50)
    expect(apexX).toBeGreaterThan(100)
    expect(Math.hypot(apexX - topX, apexY - topY)).toBeCloseTo(START_TRIANGLE_SIDE_PX)
  })
})
