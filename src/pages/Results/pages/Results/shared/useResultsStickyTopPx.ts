import { resultsStickyTopPx } from "./desktopLayout.ts"
import { useIsMobileDevice } from "./useIsMobileDevice.ts"

/**
 * Sticky `top` offset for content of a results tab on the current device.
 *
 * @returns The offset in pixels: below the result tabs bar on desktop, zero on mobile.
 */
export default function useResultsStickyTopPx(): number {
  return resultsStickyTopPx(useIsMobileDevice())
}
