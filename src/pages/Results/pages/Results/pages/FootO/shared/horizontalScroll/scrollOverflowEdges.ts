const SUBPIXEL_TOLERANCE_PX = 1

export interface ScrollOverflowEdges {
  end: boolean
  start: boolean
}

export default function scrollOverflowEdges(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
): ScrollOverflowEdges {
  const hiddenAtStart = scrollLeft
  const hiddenAtEnd = scrollWidth - clientWidth - scrollLeft

  return {
    end: hiddenAtEnd >= SUBPIXEL_TOLERANCE_PX,
    start: hiddenAtStart >= SUBPIXEL_TOLERANCE_PX,
  }
}
