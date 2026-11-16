import { RefObject, useLayoutEffect, useState } from "react"
import { fittingLineCount, MIN_FITTING_LINES } from "./fittingLineCount.ts"

/**
 * Measures how many whole lines of text fit in an element and keeps the count up to date while the
 * element is resized, so its text can be clamped to exactly the space it has.
 *
 * @param ref The element whose height bounds the text; it must take its height from its layout
 *   (e.g. a flex item that grows), not from its own content.
 * @param enabled Whether to measure at all; when false, no observer is attached.
 * @returns The number of lines that fit, or {@link MIN_FITTING_LINES} before the first measure or
 *   where `ResizeObserver` is not available.
 */
export function useFittingLineClamp(ref: RefObject<HTMLElement | null>, enabled: boolean): number {
  const [lines, setLines] = useState(MIN_FITTING_LINES)

  useLayoutEffect(() => {
    const element = ref.current
    if (!enabled || !element || typeof ResizeObserver === "undefined") return

    /**
     * Recomputes the fitting line count from the element's current height and line height.
     */
    const measure = () => {
      const lineHeightPx = parseFloat(getComputedStyle(element).lineHeight)
      setLines(fittingLineCount(element.clientHeight, lineHeightPx))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, enabled])

  return lines
}
