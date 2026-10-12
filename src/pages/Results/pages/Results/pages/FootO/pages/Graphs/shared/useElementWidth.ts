import { useLayoutEffect, useState } from "react"

/**
 * Tracks the width of an element, keeping it up to date when the element is resized. The element
 * may be mounted later than the component that calls the hook.
 *
 * @returns The callback ref to attach to the element and its current width in pixels, `0` while
 * the element is not mounted.
 */
export default function useElementWidth<Element extends HTMLElement>(): [
  (element: Element | null) => void,
  number,
] {
  const [element, setElement] = useState<Element | null>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (!element) return

    const updateWidth = () => setWidth(element.clientWidth)
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return [setElement, width]
}
