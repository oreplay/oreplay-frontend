export const MIN_FITTING_LINES = 1

/**
 * Counts how many whole lines of text fit in a box, so a line clamp can fill the box without
 * cutting a line in half.
 *
 * @param availableHeightPx Height of the box, in CSS pixels.
 * @param lineHeightPx Height of one line of text, in CSS pixels.
 * @returns The number of whole lines that fit, never fewer than {@link MIN_FITTING_LINES}, which
 *   is also returned when either measure is not a positive finite number (e.g. not laid out yet).
 */
export function fittingLineCount(availableHeightPx: number, lineHeightPx: number): number {
  const isMeasurable =
    Number.isFinite(availableHeightPx) && Number.isFinite(lineHeightPx) && lineHeightPx > 0
  if (!isMeasurable) return MIN_FITTING_LINES

  return Math.max(MIN_FITTING_LINES, Math.floor(availableHeightPx / lineHeightPx))
}
