export const PULL_DAMPING = 0.5
export const PULL_DIRECTION_SLOP_PX = 8
export const PULL_INDICATOR_SIZE_PX = 40
export const PULL_MAX_DISTANCE_PX = 120
export const PULL_THRESHOLD_PX = 70

/**
 * Turns how far the finger travelled down into how far the content follows it. The content moves
 * at half the finger's speed, which gives the pull a rubber-band resistance, and stops at
 * {@link PULL_MAX_DISTANCE_PX} however far the finger goes.
 * @param fingerDeltaY - Vertical finger travel since the touch started, in px; negative when the
 * finger moved up, which yields 0.
 * @returns The content's downward offset, in px, between 0 and {@link PULL_MAX_DISTANCE_PX}.
 */
export function dampPullDistance(fingerDeltaY: number): number {
  return Math.min(Math.max(fingerDeltaY * PULL_DAMPING, 0), PULL_MAX_DISTANCE_PX)
}

/**
 * Tells whether a scrollable element between the touched element and the pull area is scrolled
 * away from its top, in which case pulling down must scroll it back rather than refresh.
 * @param target - The element the touch started on; `null` or a non-element means nothing is
 * scrolled.
 * @param boundary - The pull area's root; the walk stops there, so elements outside it are ignored.
 * @returns `true` when the target or any ancestor up to (excluding) the boundary has scrolled down.
 */
export function hasScrolledAncestor(target: EventTarget | null, boundary: Element): boolean {
  let node = target instanceof Element ? target : null
  while (node && node !== boundary) {
    if (node.scrollTop > 0) {
      return true
    }
    node = node.parentElement
  }
  return false
}

/**
 * Tells whether the finger has moved far enough to judge the gesture's direction, so a tap or a
 * jitter neither starts a pull nor cancels one.
 * @param deltaX - Horizontal finger travel since the touch started, in px.
 * @param deltaY - Vertical finger travel since the touch started, in px.
 * @returns `true` once either axis exceeds {@link PULL_DIRECTION_SLOP_PX}.
 */
export function hasPassedDirectionSlop(deltaX: number, deltaY: number): boolean {
  return Math.max(Math.abs(deltaX), Math.abs(deltaY)) > PULL_DIRECTION_SLOP_PX
}

/**
 * Places the indicator in the middle of the gap the pulled-down content leaves above it.
 * @param distance - The content's current downward offset, in px.
 * @returns The indicator's vertical offset from the top of the pull area, in px; negative (hidden
 * above the area) while the gap is narrower than the indicator.
 */
export function indicatorOffset(distance: number): number {
  return (distance - PULL_INDICATOR_SIZE_PX) / 2
}

/**
 * Tells whether a gesture is a downward pull rather than a horizontal swipe (scrolling a wide
 * table) or an upward scroll, which must be left to the browser.
 * @param deltaX - Horizontal finger travel since the touch started, in px.
 * @param deltaY - Vertical finger travel since the touch started, in px; positive is down.
 * @returns `true` when the finger moved down more than sideways.
 */
export function isDownwardPull(deltaX: number, deltaY: number): boolean {
  return deltaY > Math.abs(deltaX)
}

/**
 * Tells whether releasing the pull now should trigger a refresh.
 * @param distance - The content's current downward offset, in px.
 * @returns `true` when the offset has reached {@link PULL_THRESHOLD_PX}.
 */
export function isPullPastThreshold(distance: number): boolean {
  return distance >= PULL_THRESHOLD_PX
}

/**
 * Says how close the pull is to triggering a refresh, to fade in and rotate the indicator.
 * @param distance - The content's current downward offset, in px.
 * @returns A fraction from 0 (not pulled) to 1 (threshold reached or passed).
 */
export function pullProgress(distance: number): number {
  return Math.min(Math.max(distance / PULL_THRESHOLD_PX, 0), 1)
}
