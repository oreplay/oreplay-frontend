export const MIN_AXIS_LABEL_GAP_PX = 16

/**
 * Chooses which tick labels of an axis are written so that none overlaps its neighbours. The first
 * and the last tick, the start and the finish, are always labelled; in between, a label is dropped
 * when it would sit closer than the minimum gap to the previous one or to the last one.
 *
 * @param positions Position of every tick along the axis, in ascending order and in any unit.
 * @param axisLengthPx Length of the axis on screen, in pixels.
 * @param minGapPx Smallest distance in pixels two labelled ticks may be apart.
 * @returns The indexes, within `positions`, of the ticks to label.
 */
export function visibleAxisLabelIndexes(
  positions: readonly number[],
  axisLengthPx: number,
  minGapPx: number = MIN_AXIS_LABEL_GAP_PX,
): Set<number> {
  if (positions.length === 0) return new Set()

  const lastIndex = positions.length - 1
  const axisRange = positions[lastIndex] - positions[0]
  if (axisRange <= 0) return new Set([0])

  const pixelOf = (index: number) => ((positions[index] - positions[0]) / axisRange) * axisLengthPx
  const lastPixel = pixelOf(lastIndex)
  const visibleIndexes = [0]
  for (let index = 1; index < lastIndex; index++) {
    const previousPixel = pixelOf(visibleIndexes[visibleIndexes.length - 1])
    const isClearOfPrevious = pixelOf(index) - previousPixel >= minGapPx
    const isClearOfLast = lastPixel - pixelOf(index) >= minGapPx
    if (isClearOfPrevious && isClearOfLast) visibleIndexes.push(index)
  }
  return new Set([...visibleIndexes, lastIndex])
}
