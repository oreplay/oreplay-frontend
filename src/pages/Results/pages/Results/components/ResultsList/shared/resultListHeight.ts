import { MOBILE_FLOATING_BUTTON_BOTTOM_OFFSET_PX } from "../../../shared/mobileLayout.ts"

export const RESULT_LIST_DESKTOP_BOTTOM_GAP_PX = 0
export const RESULT_LIST_MIN_HEIGHT_PX = 320

/**
 * Height the results list takes so it ends right where the visible part of the page does.
 *
 * @param viewportHeight Height of the browser viewport in pixels.
 * @param listDocumentTop Distance in pixels from the top of the document to the top of the list.
 * @param bottomGap Pixels to leave free between the end of the list and the bottom of the viewport.
 * @returns The list height in whole pixels, never below `RESULT_LIST_MIN_HEIGHT_PX`.
 */
export function computeResultListHeight(
  viewportHeight: number,
  listDocumentTop: number,
  bottomGap: number,
) {
  const availableHeight = viewportHeight - listDocumentTop - bottomGap
  return Math.max(RESULT_LIST_MIN_HEIGHT_PX, Math.round(availableHeight))
}

/**
 * Space the results list leaves free at the bottom of the viewport. A mobile device pins its
 * navigation there, lifted above the area the device hides behind its home indicator, so the list
 * stops above both; on desktop nothing covers the bottom and the list reaches the very end of the
 * page.
 *
 * @param isMobileDevice Whether the page is shown on a mobile device.
 * @param safeAreaBottomPx Pixels the device hides at the bottom of the screen; `0` without one.
 * @returns The gap in pixels.
 */
export function resultListBottomGapPx(isMobileDevice: boolean, safeAreaBottomPx: number): number {
  return isMobileDevice
    ? MOBILE_FLOATING_BUTTON_BOTTOM_OFFSET_PX + safeAreaBottomPx
    : RESULT_LIST_DESKTOP_BOTTOM_GAP_PX
}
