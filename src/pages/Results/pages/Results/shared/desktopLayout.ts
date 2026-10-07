export const DESKTOP_RESULT_TABS_BAR_HEIGHT_PX = 59

/**
 * Distance from the top of the page at which content of a results tab has to stick so it stays
 * visible. On desktop the result tabs bar is itself pinned to the top, so anything sticky goes
 * right below it; on mobile the navigation sits at the bottom and nothing covers the top.
 *
 * @param isMobileDevice Whether the page is shown on a mobile device.
 * @returns The sticky `top` offset in pixels.
 */
export function resultsStickyTopPx(isMobileDevice: boolean): number {
  return isMobileDevice ? 0 : DESKTOP_RESULT_TABS_BAR_HEIGHT_PX
}
