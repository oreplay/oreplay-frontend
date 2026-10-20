import React, { useRef } from "react"
import PullToRefetchIndicator from "./components/PullToRefetchIndicator.tsx"
import { usePullToRefetch } from "./shared/usePullToRefetch.ts"

interface PullToRefetchProps {
  onRefresh: () => Promise<unknown>
  children: React.ReactNode
}

/**
 * Lets touch users refresh by pulling the content down from the top of the page, as in native
 * apps. Mouse users are unaffected: only touch events drive it.
 * @param props.onRefresh - Refetches the data; the indicator spins until its promise settles.
 * @param props.children - The content that is pulled down.
 */
export default function PullToRefetch({ onRefresh, children }: PullToRefetchProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const { distance, isPulling, isRefreshing } = usePullToRefetch(areaRef, onRefresh)
  const easing = isPulling ? "" : "transition-transform duration-300 ease-out"
  const contentStyle = distance > 0 ? { transform: `translateY(${distance}px)` } : undefined

  return (
    <div ref={areaRef} className="relative h-full">
      <PullToRefetchIndicator
        distance={distance}
        isPulling={isPulling}
        isRefreshing={isRefreshing}
      />
      <div className={`h-full ${easing}`} style={contentStyle}>
        {children}
      </div>
    </div>
  )
}
