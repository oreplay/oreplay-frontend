import { useLayoutEffect, useRef } from "react"
import syncColumnWidths from "./syncColumnWidths.ts"

export default function useColumnWidthSync<
  SourceRow extends HTMLElement,
  TargetColumns extends HTMLElement,
>(columnCount: number) {
  const sourceRowRef = useRef<SourceRow | null>(null)
  const targetColumnsRef = useRef<TargetColumns | null>(null)

  useLayoutEffect(() => {
    if (!sourceRowRef.current || !targetColumnsRef.current) return
    return syncColumnWidths(sourceRowRef.current, targetColumnsRef.current)
  }, [columnCount])

  return { sourceRowRef, targetColumnsRef }
}
