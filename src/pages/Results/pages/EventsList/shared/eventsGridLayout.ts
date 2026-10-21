export const DESKTOP_EVENTS_ROWS_PER_PAGE = 4
export const EVENTS_GRID_COLUMNS = { xs: 1, sm: 2, md: 3 } as const
export const MOBILE_EVENTS_PAGE_SIZE = 10

export type EventsGridBreakpoints = { sm: number; md: number }

/**
 * Computes how many events a desktop page holds: a fixed number of full rows of the grid at the
 * given viewport width, so the last row is never left half empty.
 *
 * @param viewportWidth Window width in pixels.
 * @param breakpoints Viewport widths in pixels where the grid switches to two and three columns.
 * @returns Number of events per page.
 */
export function desktopEventsPageSize(
  viewportWidth: number,
  breakpoints: EventsGridBreakpoints,
): number {
  return DESKTOP_EVENTS_ROWS_PER_PAGE * eventsGridColumnCount(viewportWidth, breakpoints)
}

/**
 * Picks the number of grid columns the events grid shows at a viewport width, mirroring the MUI
 * breakpoints the grid's `gridTemplateColumns` is declared with.
 *
 * @param viewportWidth Window width in pixels.
 * @param breakpoints Viewport widths in pixels where the grid switches to two and three columns.
 * @returns Number of columns.
 */
export function eventsGridColumnCount(
  viewportWidth: number,
  breakpoints: EventsGridBreakpoints,
): number {
  if (viewportWidth >= breakpoints.md) {
    return EVENTS_GRID_COLUMNS.md
  }
  if (viewportWidth >= breakpoints.sm) {
    return EVENTS_GRID_COLUMNS.sm
  }
  return EVENTS_GRID_COLUMNS.xs
}
