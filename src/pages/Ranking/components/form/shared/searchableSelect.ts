import type { SearchableSelectOption } from "../SearchableSelect.tsx"

/** Pixel height of the option list's `max-h-56` (14rem) cap. */
export const DROPDOWN_MAX_HEIGHT = 224

const OPTION_HEIGHT = 40
const LIST_VERTICAL_PADDING = 8

/**
 * Estimates how tall the open option list renders, capped at its maximum height.
 * @param optionCount - number of options shown in the list
 * @returns the expected list height in pixels
 */
export function estimatedListHeight(optionCount: number): number {
  return Math.min(optionCount * OPTION_HEIGHT + LIST_VERTICAL_PADDING, DROPDOWN_MAX_HEIGHT)
}

/**
 * Decides whether the option list opens upward: only when it doesn't fit below the field and
 * there is more room above, so near the bottom of the page it overlays content instead of
 * growing the page.
 * @param fieldRect - viewport rectangle of the field the list is attached to
 * @param viewportHeight - inner height of the window, in pixels
 * @param optionCount - number of options shown in the list
 * @returns true when the list should open above the field
 */
export function shouldDropUp(
  fieldRect: Pick<DOMRect, "top" | "bottom">,
  viewportHeight: number,
  optionCount: number,
): boolean {
  const spaceBelow = viewportHeight - fieldRect.bottom
  return spaceBelow < estimatedListHeight(optionCount) && fieldRect.top > spaceBelow
}

/**
 * Picks the options to list for the current query. With server-side search the parent has
 * already filtered them, so they are shown as they are.
 * @param options - every option the field received
 * @param query - text typed in the field; empty matches everything
 * @param serverSearch - true when the parent filters the options itself
 * @returns the options whose label contains the query, ignoring case
 */
export function visibleOptions(
  options: SearchableSelectOption[],
  query: string,
  serverSearch: boolean,
): SearchableSelectOption[] {
  if (serverSearch) return options
  const needle = query.toLowerCase()
  return options.filter((option) => option.label.toLowerCase().includes(needle))
}
