import React, { useRef, useEffect, useState, useCallback } from "react"

interface PullToRefetchProps {
  onRefresh: () => Promise<void> | void
  threshold?: number
  children: React.ReactNode
}

const PullToRefetch: React.FC<PullToRefetchProps> = ({ onRefresh, threshold = 70, children }) => {
  const outerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  const startY = useRef<number | null>(null)
  const pulling = useRef(false)
  const distance = useRef(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update indicator position relative to outer div
  const updateIndicatorPosition = useCallback(() => {
    if (!outerRef.current || !indicatorRef.current) return
    const rect = outerRef.current.getBoundingClientRect()
    indicatorRef.current.style.top = `${rect.top + threshold / 2}px` // 40px below outer div top
  }, [threshold])

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      // should be changed to useEffectEvent in react 19
      if (window.scrollY === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY
      } else {
        startY.current = null
      }
    },
    [isRefreshing],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      // should be changed to useEffectEvent in react 19
      if (startY.current === null || isRefreshing) return

      const delta = e.touches[0].clientY - startY.current
      if (delta > 0 && window.scrollY === 0) {
        pulling.current = true
        distance.current = Math.min(delta, threshold * 1.5)
        e.preventDefault() // stop native scroll at top

        const progress = Math.min(distance.current / threshold, 1)

        if (indicatorRef.current) {
          indicatorRef.current.style.opacity = `${progress}`
          indicatorRef.current.textContent =
            distance.current > threshold ? "↻ Release to refresh" : "⬇ Pull to refresh"
        }

        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${distance.current}px)`
        }
      }
    },
    [isRefreshing, threshold],
  )

  const handleTouchEnd = useCallback(async () => {
    // should be changed to useEffectEvent in react 19
    if (!pulling.current) return

    if (distance.current >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      if (indicatorRef.current) indicatorRef.current.textContent = "🔄 Refreshing..."
      await onRefresh()
      setIsRefreshing(false)
    }

    if (indicatorRef.current && contentRef.current) {
      indicatorRef.current.style.transition = "opacity 0.3s ease"
      contentRef.current.style.transition = "transform 0.3s ease"

      contentRef.current.style.transform = `translateY(0)`
      indicatorRef.current.style.opacity = "0"

      setTimeout(() => {
        if (contentRef.current) contentRef.current.style.transition = "none"
        if (indicatorRef.current) indicatorRef.current.style.transition = "none"
      }, 300)
    }

    pulling.current = false
    distance.current = 0
    startY.current = null
  }, [isRefreshing, onRefresh, threshold])

  useEffect(() => {
    updateIndicatorPosition()
    window.addEventListener("scroll", updateIndicatorPosition)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", () => void handleTouchEnd())

    return () => {
      window.removeEventListener("scroll", updateIndicatorPosition)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", () => void handleTouchEnd())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshing])

  return (
    <div ref={outerRef} style={{ position: "relative" }}>
      {/* Indicator fixed relative to outer div */}
      <div
        ref={indicatorRef}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#555",
          fontSize: "14px",
          pointerEvents: "none",
          opacity: 0,
          transform: "translateY(0)",
          willChange: "opacity, top",
          transition: "opacity 0.2s ease",
        }}
      >
        ⬇ Pull to refresh
      </div>

      {/* Content that moves on pull */}
      <div ref={contentRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  )
}

export default PullToRefetch
