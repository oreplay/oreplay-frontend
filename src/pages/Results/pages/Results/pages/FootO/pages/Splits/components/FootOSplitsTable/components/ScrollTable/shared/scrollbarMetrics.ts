export const MIN_SCROLLBAR_THUMB_WIDTH_PX = 20

interface ThumbDrag {
  maxScrollLeft: number
  pointerDelta: number
  startScrollLeft: number
  thumbTravel: number
}

interface TrackClick {
  clickOffset: number
  scrollWidth: number
  thumbWidth: number
  trackWidth: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function scrollLeftAfterThumbDrag(drag: ThumbDrag) {
  if (drag.thumbTravel <= 0 || drag.maxScrollLeft <= 0) return drag.startScrollLeft
  const scrolledPerThumbPixel = drag.maxScrollLeft / drag.thumbTravel
  const scrollLeft = drag.startScrollLeft + drag.pointerDelta * scrolledPerThumbPixel
  return clamp(scrollLeft, 0, drag.maxScrollLeft)
}

export function scrollLeftForTrackClick(click: TrackClick) {
  if (click.trackWidth <= 0) return 0
  const thumbCenteredOffset = click.clickOffset - click.thumbWidth / 2
  const clickRatio = thumbCenteredOffset / click.trackWidth
  return Math.max(0, Math.floor(clickRatio * click.scrollWidth))
}

export function scrollProgress(scrollLeft: number, scrollWidth: number, clientWidth: number) {
  const maxScrollLeft = scrollWidth - clientWidth
  if (maxScrollLeft <= 0) return 0
  return clamp(scrollLeft / maxScrollLeft, 0, 1)
}

export function visibleRatio(scrollWidth: number, clientWidth: number) {
  if (scrollWidth <= 0) return 1
  return clamp(clientWidth / scrollWidth, 0, 1)
}
