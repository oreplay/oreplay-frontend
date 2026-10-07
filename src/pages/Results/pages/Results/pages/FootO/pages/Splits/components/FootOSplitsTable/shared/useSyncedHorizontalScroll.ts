import { useEffect, useRef } from "react"
import syncHorizontalScroll from "./syncHorizontalScroll.ts"

export default function useSyncedHorizontalScroll<
  First extends HTMLElement,
  Second extends HTMLElement,
>() {
  const firstScrollerRef = useRef<First | null>(null)
  const secondScrollerRef = useRef<Second | null>(null)

  useEffect(() => {
    if (!firstScrollerRef.current || !secondScrollerRef.current) return
    return syncHorizontalScroll(firstScrollerRef.current, secondScrollerRef.current)
  }, [])

  return { firstScrollerRef, secondScrollerRef }
}
