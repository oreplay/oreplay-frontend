export const BEHIND_TIME_BASELINE_Y_PX = 48
export const CONTROL_RADIUS_PX = 11
export const CUMULATIVE_TIME_BASELINE_Y_PX = 36
export const FINISH_INNER_RADIUS_PX = 7.5
export const NODE_SPACING_PX = 56
export const START_TRIANGLE_SIDE_PX = 19
export const SYMBOL_CENTER_Y_PX = 13
export const SYMBOL_STROKE_WIDTH_PX = 1.5

const HEIGHT_PX = 52
const HORIZONTAL_PADDING_PX = 22
const START_NODE_INDEX = 0
const START_TRIANGLE_HEIGHT_PX = (START_TRIANGLE_SIDE_PX * Math.sqrt(3)) / 2
const START_TRIANGLE_APEX_OFFSET_PX = (START_TRIANGLE_HEIGHT_PX * 2) / 3
const START_TRIANGLE_BASE_OFFSET_PX = START_TRIANGLE_HEIGHT_PX / 3

export interface OnlineCourseGeometry {
  height: number
  legs: OnlineCourseLegGeometry[]
  minWidth: number
  nodes: OnlineCourseNodeGeometry[]
}

export interface OnlineCourseLegGeometry {
  lineStartX: number
  offsetX: number
  widthFraction: number
  xFraction: number
}

export interface OnlineCourseNodeGeometry {
  offsetX: number
  xFraction: number
}

/**
 * Computes the width of a course drawn at its fixed spacing, which is the narrowest it gets.
 *
 * @param legCount Number of legs of the course.
 * @returns The width in pixels.
 */
function minWidth(legCount: number) {
  return 2 * HORIZONTAL_PADDING_PX + legCount * NODE_SPACING_PX
}

/**
 * Computes where the centre of a node is when the course is at its minimum width.
 *
 * @param nodeIndex Position of the node in the course, the start being `0`.
 * @returns The horizontal position in pixels.
 */
function nodeXAtMinWidth(nodeIndex: number) {
  return HORIZONTAL_PADDING_PX + nodeIndex * NODE_SPACING_PX
}

/**
 * Computes where a leg starts when the course is at its minimum width: at the apex of the start
 * triangle for the first leg and at the edge of the circle for the others.
 *
 * @param startNodeIndex Position of the node the leg starts at.
 * @returns The horizontal position in pixels.
 */
function legStartXAtMinWidth(startNodeIndex: number) {
  const symbolTrailingEdgeOffset =
    startNodeIndex === START_NODE_INDEX ? START_TRIANGLE_APEX_OFFSET_PX : CONTROL_RADIUS_PX
  return nodeXAtMinWidth(startNodeIndex) + symbolTrailingEdgeOffset
}

/**
 * Computes where a leg ends when the course is at its minimum width: at the edge of the circle
 * it reaches.
 *
 * @param endNodeIndex Position of the node the leg ends at.
 * @returns The horizontal position in pixels.
 */
function legEndXAtMinWidth(endNodeIndex: number) {
  return nodeXAtMinWidth(endNodeIndex) - CONTROL_RADIUS_PX
}

/**
 * Computes the share of the width of the course at which a node sits.
 *
 * @param nodeIndex Position of the node in the course, the start being `0`.
 * @param legCount Number of legs of the course.
 * @returns A fraction from `0` to `1`, `0` for a course without legs.
 */
function nodeXFraction(nodeIndex: number, legCount: number) {
  return legCount === 0 ? 0 : nodeIndex / legCount
}

/**
 * Computes where a node is drawn at any width of the course, as a fraction of the width plus a
 * fixed offset, so the margins stay the same while the legs stretch.
 *
 * @param nodeIndex Position of the node in the course, the start being `0`.
 * @param legCount Number of legs of the course.
 * @returns The fraction of the width and the offset in pixels.
 */
function nodeGeometry(nodeIndex: number, legCount: number): OnlineCourseNodeGeometry {
  const xFraction = nodeXFraction(nodeIndex, legCount)

  return {
    offsetX: nodeXAtMinWidth(nodeIndex) - xFraction * minWidth(legCount),
    xFraction,
  }
}

/**
 * Computes where a leg is drawn at any width of the course. The leg takes a fraction of the
 * width and its line starts a fixed distance into it, so the extra width goes to the line while
 * the symbols at both ends keep their size.
 *
 * @param legIndex Position of the leg in the course, the first being `0`.
 * @param legCount Number of legs of the course.
 * @returns The fractions of the width and the offsets in pixels.
 */
function legGeometry(legIndex: number, legCount: number): OnlineCourseLegGeometry {
  const startX = legStartXAtMinWidth(legIndex)
  const lengthAtMinWidth = legEndXAtMinWidth(legIndex + 1) - startX
  const xFraction = nodeXFraction(legIndex, legCount)
  const widthFraction = 1 / legCount
  const lineStartX = widthFraction * minWidth(legCount) - lengthAtMinWidth

  return {
    lineStartX,
    offsetX: startX - xFraction * minWidth(legCount) - lineStartX,
    widthFraction,
    xFraction,
  }
}

/**
 * Writes a fraction as the percentage SVG attributes expect.
 *
 * @param fraction Fraction of the width, from `0` to `1`.
 * @returns The percentage, such as `"25%"`.
 */
export function fractionToPercent(fraction: number): string {
  return `${fraction * 100}%`
}

/**
 * Computes the corners of the start triangle, an equilateral triangle pointing to the first
 * control.
 *
 * @param centerX Horizontal position of the centre of the triangle.
 * @param centerY Vertical position of the centre of the triangle.
 * @returns The corners in the format of the `points` attribute of an SVG polygon.
 */
export function startTrianglePoints(centerX: number, centerY: number): string {
  const baseX = centerX - START_TRIANGLE_BASE_OFFSET_PX
  const apexX = centerX + START_TRIANGLE_APEX_OFFSET_PX
  const halfSide = START_TRIANGLE_SIDE_PX / 2

  return [
    `${baseX},${centerY - halfSide}`,
    `${apexX},${centerY}`,
    `${baseX},${centerY + halfSide}`,
  ].join(" ")
}

/**
 * Computes where every node and leg of a course is drawn. The course fills the width it is given
 * and never gets narrower than its nodes at a fixed spacing.
 *
 * @param nodeCount Number of nodes of the course, the start and the finish included.
 * @returns The height, the minimum width and the geometry of every node and leg.
 */
export default function onlineCourseGeometry(nodeCount: number): OnlineCourseGeometry {
  const legCount = Math.max(nodeCount - 1, 0)

  return {
    height: HEIGHT_PX,
    legs: Array.from({ length: legCount }, (_, legIndex) => legGeometry(legIndex, legCount)),
    minWidth: minWidth(legCount),
    nodes: Array.from({ length: nodeCount }, (_, nodeIndex) => nodeGeometry(nodeIndex, legCount)),
  }
}
