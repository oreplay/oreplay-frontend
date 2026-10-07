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
  nodeXs: number[]
  width: number
}

export interface OnlineCourseLegGeometry {
  endX: number
  startX: number
}

function nodeX(nodeIndex: number) {
  return HORIZONTAL_PADDING_PX + nodeIndex * NODE_SPACING_PX
}

function legStartX(startNodeIndex: number) {
  const symbolTrailingEdgeOffset =
    startNodeIndex === START_NODE_INDEX ? START_TRIANGLE_APEX_OFFSET_PX : CONTROL_RADIUS_PX
  return nodeX(startNodeIndex) + symbolTrailingEdgeOffset
}

function legEndX(endNodeIndex: number) {
  return nodeX(endNodeIndex) - CONTROL_RADIUS_PX
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
    legs: Array.from({ length: legCount }, (_, legIndex) => ({
      endX: legEndX(legIndex + 1),
      startX: legStartX(legIndex),
    })),
    nodeXs: Array.from({ length: nodeCount }, (_, nodeIndex) => nodeX(nodeIndex)),
    width: 2 * HORIZONTAL_PADDING_PX + legCount * NODE_SPACING_PX,
  }
}
