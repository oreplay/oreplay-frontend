export const SAFE_AREA_INSET_BOTTOM = "env(safe-area-inset-bottom)"
export const SAFE_AREA_INSET_LEFT = "env(safe-area-inset-left)"
export const SAFE_AREA_INSET_RIGHT = "env(safe-area-inset-right)"
export const SAFE_AREA_INSET_TOP = "env(safe-area-inset-top)"

export const HOME_INDICATOR_OVERLAP_PX = 20

export type SafeAreaInset =
  | typeof SAFE_AREA_INSET_BOTTOM
  | typeof SAFE_AREA_INSET_LEFT
  | typeof SAFE_AREA_INSET_RIGHT
  | typeof SAFE_AREA_INSET_TOP

/**
 * Turns a CSS pixel length into a number, so a computed style can feed layout arithmetic.
 *
 * @param cssLength A computed length such as `"34px"`; empty or unparsable values (a browser that
 *   does not resolve the property) count as no length at all.
 * @returns The length in pixels, `0` when it cannot be read.
 */
export function cssPixelsToNumber(cssLength: string): number {
  const pixels = parseFloat(cssLength)
  return Number.isFinite(pixels) ? pixels : 0
}

/**
 * Resolves a CSS length to pixels on the current device, for layout that has to be computed in
 * JavaScript but must match a length CSS uses (e.g. one built from the `SAFE_AREA_INSET_*`
 * constants).
 *
 * @param cssLength Any CSS length, including `env()`, `calc()` and `max()` expressions.
 * @returns The length in pixels; `0` when the browser cannot resolve it (e.g. no `env()` support).
 */
export function measureCssLengthPx(cssLength: string): number {
  const probe = document.createElement("div")
  probe.style.position = "fixed"
  probe.style.visibility = "hidden"
  probe.style.paddingTop = cssLength
  document.body.appendChild(probe)
  const pixels = cssPixelsToNumber(getComputedStyle(probe).paddingTop)
  probe.remove()
  return pixels
}

/**
 * Builds a CSS length that keeps an element a fixed distance away from the part of the screen the
 * device hides, so it is never covered by the notch, Dynamic Island or home indicator.
 *
 * @param safeAreaLength The hidden area to start from: a `SAFE_AREA_INSET_*` constant or a length
 *   derived from one, such as `overlapSafeArea`'s.
 * @param pixels Distance in pixels to keep beyond the hidden area.
 * @returns A `calc()` expression; on devices without hidden areas it equals `pixels`.
 */
export function offsetFromSafeArea(safeAreaLength: string, pixels: number): string {
  return `calc(${pixels}px + ${safeAreaLength})`
}

/**
 * Builds a CSS length for a hidden area that an element may partly cover. iOS reserves far more
 * room for the home indicator than the indicator itself takes, so a bottom bar that kept clear of
 * all of it would float visibly above the screen edge.
 *
 * @param inset Edge whose hidden area is reduced.
 * @param overlapPx Pixels of the hidden area the element is allowed to cover.
 * @returns A `max()` expression that never goes below `0px`, so devices without hidden areas are
 *   unaffected.
 */
export function overlapSafeArea(inset: SafeAreaInset, overlapPx: number): string {
  return `max(0px, ${inset} - ${overlapPx}px)`
}

export const SAFE_AREA_BOTTOM_BAR_INSET = overlapSafeArea(
  SAFE_AREA_INSET_BOTTOM,
  HOME_INDICATOR_OVERLAP_PX,
)
