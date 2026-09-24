import { RefObject, useEffect, useState } from "react"

const GRID_MIN_COLUMN_WIDTH_PX = 320
const MEDIUM_BREAKPOINT_PX = 768
const LARGE_BREAKPOINT_PX = 1024

function getColumnCount(viewportWidth: number) {
  if (viewportWidth < MEDIUM_BREAKPOINT_PX) {
    return 1
  }
  if (viewportWidth < LARGE_BREAKPOINT_PX) {
    return 2
  }
  return Math.max(1, Math.floor(viewportWidth / GRID_MIN_COLUMN_WIDTH_PX))
}

export default function useResultGridColumns(containerRef: RefObject<HTMLElement | null>) {
  const [columnCount, setColumnCount] = useState(() =>
    getColumnCount(typeof window === "undefined" ? LARGE_BREAKPOINT_PX : window.innerWidth),
  )

  useEffect(() => {
    const updateColumnCount = (width: number) => setColumnCount(getColumnCount(width))

    if (!containerRef.current) {
      updateColumnCount(window.innerWidth)
      return
    }

    const observer = new ResizeObserver(([entry]) => updateColumnCount(entry.contentRect.width))
    observer.observe(containerRef.current)
    updateColumnCount(containerRef.current.getBoundingClientRect().width)
    return () => observer.disconnect()
  }, [containerRef])

  return columnCount
}
