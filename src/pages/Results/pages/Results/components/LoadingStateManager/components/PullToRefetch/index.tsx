import React, { useRef, useEffect, useState, useCallback } from "react"
import RefreshIcon from "@mui/icons-material/Refresh"
import "./styles.css"

interface PullToRefetchProps {
  onRefresh: () => Promise<void> | void
  threshold?: number
  children: React.ReactNode
}

const PullToRefetch: React.FC<PullToRefetchProps> = ({ onRefresh, threshold = 70, children }) => {
  const outerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const iconWrapperRef = useRef<HTMLDivElement>(null)

  const startY = useRef<number | null>(null)
  const pulling = useRef(false)
  const distance = useRef(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const updateIndicatorPosition = useCallback(() => {
    if (!outerRef.current || !indicatorRef.current) return
    const rect = outerRef.current.getBoundingClientRect()
    indicatorRef.current.style.top = `${rect.top + 40}px`
  }, [])

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
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
      if (startY.current === null || isRefreshing) return

      const delta = e.touches[0].clientY - startY.current
      if (delta > 0 && window.scrollY === 0) {
        pulling.current = true
        distance.current = Math.min(delta, threshold * 1.5)
        e.preventDefault()

        const progress = Math.min(distance.current / threshold, 1)

        // opacity animation
        if (indicatorRef.current) {
          indicatorRef.current.style.opacity = `${progress}`
        }

        // translate content
        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${distance.current}px)`
        }

        // rotate icon proportionally to pull
        if (iconWrapperRef.current && !isRefreshing) {
          const rotateDeg = (distance.current / threshold) * 360 // 0 to 360°
          iconWrapperRef.current.style.transform = `rotate(${rotateDeg}deg)`
        }
      }
    },
    [isRefreshing, threshold],
  )

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return

    if (distance.current >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      if (iconWrapperRef.current) iconWrapperRef.current.style.transform = `rotate(0deg)`
      await onRefresh()
      setIsRefreshing(false)
    }

    if (contentRef.current && indicatorRef.current && iconWrapperRef.current) {
      contentRef.current.style.transition = "transform 0.3s ease"
      indicatorRef.current.style.transition = "opacity 0.3s ease"
      iconWrapperRef.current.style.transition = "transform 0.3s ease"

      contentRef.current.style.transform = "translateY(0)"
      indicatorRef.current.style.opacity = "0"
      iconWrapperRef.current.style.transform = `rotate(0deg)`

      setTimeout(() => {
        if (contentRef.current) contentRef.current.style.transition = "none"
        if (indicatorRef.current) indicatorRef.current.style.transition = "none"
        if (iconWrapperRef.current) iconWrapperRef.current.style.transition = "none"
      }, 300)
    }

    pulling.current = false
    distance.current = 0
    startY.current = null
  }, [isRefreshing, onRefresh, threshold])

  useEffect(() => {
    updateIndicatorPosition()
    const touchEndHandler = () => void handleTouchEnd()

    window.addEventListener("scroll", updateIndicatorPosition)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", touchEndHandler)

    return () => {
      window.removeEventListener("scroll", updateIndicatorPosition)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", touchEndHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshing])

  return (
    <div ref={outerRef} className="pull-to-refetch">
      <div ref={indicatorRef} className="pull-to-refetch-indicator">
        <div
          ref={iconWrapperRef}
          className={`refresh-icon-wrapper ${isRefreshing ? "spinning" : ""}`}
        >
          <RefreshIcon style={{ fontSize: 24, color: "#555" }} />
        </div>
      </div>

      <div ref={contentRef} className="pull-to-refetch-content">
        {children}
      </div>
    </div>
  )
}

export default PullToRefetch
