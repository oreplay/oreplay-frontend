import { RefObject, useLayoutEffect, useState } from "react"
import { ResultListLayout } from "./resultListLayoutContext.ts"
import { computeResultListHeight, RESULT_LIST_MIN_HEIGHT_PX } from "./resultListHeight.ts"

export default function useResultListSize(containerRef: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<ResultListLayout>({
    height: RESULT_LIST_MIN_HEIGHT_PX,
    width: 0,
  })

  useLayoutEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) {
        return
      }
      const listDocumentTop = containerRef.current.getBoundingClientRect().top + window.scrollY
      const height = computeResultListHeight(window.innerHeight, listDocumentTop)
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
  }, [containerRef])

  return size
}
