import { describe, expect, it } from "vitest"
import onlineCourseGeometry, {
  CONTROL_RADIUS_PX,
  fractionToPercent,
  NODE_SPACING_PX,
  OnlineCourseGeometry,
  START_TRIANGLE_SIDE_PX,
  startTrianglePoints,
} from "./onlineCourseGeometry.ts"

const NODE_COUNT = 4
const LEG_COUNT = NODE_COUNT - 1
const EXTRA_WIDTH_PX = 300
const START_TRIANGLE_APEX_OFFSET_PX = (START_TRIANGLE_SIDE_PX * Math.sqrt(3)) / 3

function nodeXsAtWidth(geometry: OnlineCourseGeometry, width: number) {
  return geometry.nodes.map((node) => node.xFraction * width + node.offsetX)
}

function legsAtWidth(geometry: OnlineCourseGeometry, width: number) {
  return geometry.legs.map((leg) => {
    const boxStartX = leg.xFraction * width + leg.offsetX
    return { endX: boxStartX + leg.widthFraction * width, startX: boxStartX + leg.lineStartX }
  })
}

describe("onlineCourseGeometry", () => {
  it("places the nodes at a fixed spacing at its minimum width", () => {
    const geometry = onlineCourseGeometry(NODE_COUNT)
    const nodeXs = nodeXsAtWidth(geometry, geometry.minWidth)

    expect(nodeXs).toHaveLength(NODE_COUNT)
    nodeXs.slice(1).forEach((x, index) => {
      expect(x - nodeXs[index]).toBeCloseTo(NODE_SPACING_PX)
    })
  })

  it("grows its minimum width with the course and keeps its height", () => {
    const shortCourse = onlineCourseGeometry(NODE_COUNT)
    const longCourse = onlineCourseGeometry(NODE_COUNT + 1)
    const lastNodeX = nodeXsAtWidth(shortCourse, shortCourse.minWidth)[NODE_COUNT - 1]

    expect(shortCourse.minWidth).toBeGreaterThan(lastNodeX + CONTROL_RADIUS_PX)
    expect(longCourse.minWidth - shortCourse.minWidth).toBe(NODE_SPACING_PX)
    expect(longCourse.height).toBe(shortCourse.height)
  })

  it("shares the width beyond the minimum equally between the legs", () => {
    const geometry = onlineCourseGeometry(NODE_COUNT)
    const nodeXs = nodeXsAtWidth(geometry, geometry.minWidth + EXTRA_WIDTH_PX)

    nodeXs.slice(1).forEach((x, index) => {
      expect(x - nodeXs[index]).toBeCloseTo(NODE_SPACING_PX + EXTRA_WIDTH_PX / LEG_COUNT)
    })
  })

  it("keeps the same margin on both sides whatever the width", () => {
    const geometry = onlineCourseGeometry(NODE_COUNT)
    const width = geometry.minWidth + EXTRA_WIDTH_PX
    const nodeXs = nodeXsAtWidth(geometry, width)

    expect(nodeXs[0]).toBeCloseTo(nodeXsAtWidth(geometry, geometry.minWidth)[0])
    expect(width - nodeXs[NODE_COUNT - 1]).toBeCloseTo(nodeXs[0])
  })

  it("has one leg between every pair of consecutive nodes", () => {
    expect(onlineCourseGeometry(NODE_COUNT).legs).toHaveLength(LEG_COUNT)
  })

  it.each([0, EXTRA_WIDTH_PX])(
    "starts the first leg at the apex of the start triangle with %i px of extra width",
    (extraWidth) => {
      const geometry = onlineCourseGeometry(NODE_COUNT)
      const width = geometry.minWidth + extraWidth

      expect(legsAtWidth(geometry, width)[0].startX).toBeCloseTo(
        nodeXsAtWidth(geometry, width)[0] + START_TRIANGLE_APEX_OFFSET_PX,
      )
    },
  )

  it.each([0, EXTRA_WIDTH_PX])(
    "runs the legs from the edge of a circle to the edge of the next one with %i px of extra width",
    (extraWidth) => {
      const geometry = onlineCourseGeometry(NODE_COUNT)
      const width = geometry.minWidth + extraWidth
      const nodeXs = nodeXsAtWidth(geometry, width)
      const legs = legsAtWidth(geometry, width)

      legs.forEach((leg, legIndex) => {
        expect(leg.endX).toBeCloseTo(nodeXs[legIndex + 1] - CONTROL_RADIUS_PX)
      })
      legs.slice(1).forEach((leg, index) => {
        expect(leg.startX).toBeCloseTo(nodeXs[index + 1] + CONTROL_RADIUS_PX)
      })
    },
  )

  it("has no legs for a course without nodes", () => {
    expect(onlineCourseGeometry(0)).toMatchObject({ legs: [], nodes: [] })
  })

  it("places the only node of a course without legs at the margin", () => {
    const geometry = onlineCourseGeometry(1)

    expect(geometry.legs).toEqual([])
    expect(nodeXsAtWidth(geometry, geometry.minWidth + EXTRA_WIDTH_PX)).toEqual([
      geometry.minWidth / 2,
    ])
  })
})

describe("fractionToPercent", () => {
  it("writes a fraction of the width as a percentage", () => {
    expect(fractionToPercent(0.25)).toBe("25%")
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
