import { RefObject, useLayoutEffect, useState } from "react"
import { computeResultListHeight, RESULT_LIST_MIN_HEIGHT_PX } from "./resultListHeight.ts"

export default function useResultListHeight(containerRef: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(RESULT_LIST_MIN_HEIGHT_PX)

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current) {
        return
      }
      const listDocumentTop = containerRef.current.getBoundingClientRect().top + window.scrollY
      setHeight(computeResultListHeight(window.innerHeight, listDocumentTop))
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(document.body)
    window.addEventListener("resize", updateHeight)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateHeight)
    }
  }, [containerRef])

  return height
}
