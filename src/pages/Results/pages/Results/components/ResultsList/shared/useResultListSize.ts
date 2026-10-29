import { RefObject, useLayoutEffect, useState } from "react"
import { ResultListLayout } from "./resultListLayoutContext.ts"
import { useIsMobileDevice } from "../../../../../shared/useIsMobileDevice.ts"
import {
  computeResultListHeight,
  RESULT_LIST_MIN_HEIGHT_PX,
  resultListBottomGapPx,
} from "./resultListHeight.ts"
import {
  measureCssLengthPx,
  SAFE_AREA_BOTTOM_BAR_INSET,
} from "../../../../../../../shared/safeArea.ts"

/**
 * Measures the results list so it fills the viewport below its own top edge, keeping the size up to
 * date when the window or the page content resizes.
 *
 * @param containerRef Element that holds the list; nothing is measured while it is not mounted.
 * @returns The height and width in pixels the list has available.
 */
export default function useResultListSize(containerRef: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<ResultListLayout>({
    height: RESULT_LIST_MIN_HEIGHT_PX,
    width: 0,
  })
  const isMobileDevice = useIsMobileDevice()

  useLayoutEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) {
        return
      }
      const listDocumentTop = containerRef.current.getBoundingClientRect().top + window.scrollY
      const bottomGap = resultListBottomGapPx(
        isMobileDevice,
        measureCssLengthPx(SAFE_AREA_BOTTOM_BAR_INSET),
      )
      const height = computeResultListHeight(window.innerHeight, listDocumentTop, bottomGap)
      const width = containerRef.current.clientWidth
      setSize((previous) =>
        previous.height === height && previous.width === width ? previous : { height, width },
      )
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(document.body)
    window.addEventListener("resize", updateSize)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateSize)
    }
  }, [containerRef, isMobileDevice])

  return size
}
