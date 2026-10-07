export const BEHIND_TIME_BASELINE_Y_PX = 48
export const CONTROL_RADIUS_PX = 11
export const CUMULATIVE_TIME_BASELINE_Y_PX = 36
export const FINISH_INNER_RADIUS_PX = 7.5
export const NODE_SPACING_PX = 56
export const START_TRIANGLE_SIDE_PX = 22
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

function minWidth(legCount: number) {
  return 2 * HORIZONTAL_PADDING_PX + legCount * NODE_SPACING_PX
}

function nodeXAtMinWidth(nodeIndex: number) {
  return HORIZONTAL_PADDING_PX + nodeIndex * NODE_SPACING_PX
}

function legStartXAtMinWidth(startNodeIndex: number) {
  const symbolTrailingEdgeOffset =
    startNodeIndex === START_NODE_INDEX ? START_TRIANGLE_APEX_OFFSET_PX : CONTROL_RADIUS_PX
  return nodeXAtMinWidth(startNodeIndex) + symbolTrailingEdgeOffset
}

function legEndXAtMinWidth(endNodeIndex: number) {
  return nodeXAtMinWidth(endNodeIndex) - CONTROL_RADIUS_PX
}

function nodeXFraction(nodeIndex: number, legCount: number) {
  return legCount === 0 ? 0 : nodeIndex / legCount
}

function nodeGeometry(nodeIndex: number, legCount: number): OnlineCourseNodeGeometry {
  const xFraction = nodeXFraction(nodeIndex, legCount)

  return {
    offsetX: nodeXAtMinWidth(nodeIndex) - xFraction * minWidth(legCount),
    xFraction,
  }
}

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

export function fractionToPercent(fraction: number): string {
  return `${fraction * 100}%`
}

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

export default function onlineCourseGeometry(nodeCount: number): OnlineCourseGeometry {
  const legCount = Math.max(nodeCount - 1, 0)

  return {
    height: HEIGHT_PX,
    legs: Array.from({ length: legCount }, (_, legIndex) => legGeometry(legIndex, legCount)),
    minWidth: minWidth(legCount),
    nodes: Array.from({ length: nodeCount }, (_, nodeIndex) => nodeGeometry(nodeIndex, legCount)),
  }
}
