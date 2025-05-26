import { useEffect, useRef, useState, ComponentType, CSSProperties } from "react"
import { Stack } from "@mui/material"

interface ListSkeletonProps {
  SkeletonItem: ComponentType
  gap: string
  style?: CSSProperties
  className?: string
}

export default function ListSkeleton({ SkeletonItem, style, className, gap }: ListSkeletonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const skeletonRef = useRef<HTMLDivElement>(null)
  const [skeletonHeight, setSkeletonHeight] = useState<number | null>(null)
  const [skeletonCount, setSkeletonCount] = useState(0)

  // Measure the skeleton item height
  useEffect(() => {
    if (!skeletonRef.current) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry.contentRect.height > 0) {
        setSkeletonHeight(entry.contentRect.height)
      }
    })

    resizeObserver.observe(skeletonRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Once we have the height, calculate how many fit
  useEffect(() => {
    if (skeletonHeight && containerRef.current) {
      const containerHeight = containerRef.current.clientHeight
      console.log("ContainerHeight", containerHeight)
      const count = Math.floor(containerHeight / skeletonHeight)
      setSkeletonCount(count)
    }
  }, [skeletonHeight])

  return (
    <Stack
      ref={containerRef}
      style={{ height: "100%", overflow: "hidden", ...style }}
      className={className}
      direction="column"
      gap={gap}
    >
      {/* Render one item offscreen just to measure height */}
      {!skeletonHeight && (
        <div ref={skeletonRef} style={{ visibility: "hidden", position: "absolute" }}>
          <SkeletonItem />
        </div>
      )}

      {/* Render full list once height is known */}
      {skeletonHeight &&
        Array.from({ length: skeletonCount }).map((_, index) => <SkeletonItem key={index} />)}
    </Stack>
  )
}
