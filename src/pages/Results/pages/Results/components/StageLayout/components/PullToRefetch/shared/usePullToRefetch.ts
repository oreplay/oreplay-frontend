import { RefObject, useEffect, useRef, useState } from "react"
import {
  dampPullDistance,
  hasPassedDirectionSlop,
  hasScrolledAncestor,
  isDownwardPull,
  isPullPastThreshold,
  PULL_THRESHOLD_PX,
} from "./pullGesture.ts"

export const PULL_PHASE = {
  Deciding: "deciding",
  Idle: "idle",
  Pulling: "pulling",
} as const

export type PullPhase = (typeof PULL_PHASE)[keyof typeof PULL_PHASE]

interface PullGesture {
  phase: PullPhase
  startX: number
  startY: number
}

export interface PullToRefetchState {
  distance: number
  isPulling: boolean
  isRefreshing: boolean
}

const IDLE_GESTURE: PullGesture = { phase: PULL_PHASE.Idle, startX: 0, startY: 0 }

/**
 * Stops the browser's own pull-to-refresh (a full page reload on Chrome for Android) from
 * competing with ours while the pull area is mounted.
 * @returns A function that restores the page's previous overscroll behaviour.
 */
function containRootOverscroll(): () => void {
  const rootStyle = document.documentElement.style
  const previous = rootStyle.overscrollBehaviorY
  rootStyle.overscrollBehaviorY = "contain"
  return () => {
    rootStyle.overscrollBehaviorY = previous
  }
}

/**
 * Tells whether a touch can start a pull: one finger, nothing refreshing yet, and both the page
 * and every scrollable element under the finger scrolled to their top.
 * @param event - The `touchstart` event.
 * @param area - The pull area's root element.
 * @param isRefreshing - Whether a refresh is already running.
 * @returns `true` when the gesture may become a pull.
 */
function canStartPull(event: TouchEvent, area: HTMLElement, isRefreshing: boolean): boolean {
  const isSingleFinger = event.touches.length === 1
  const isAtTop = window.scrollY <= 0 && !hasScrolledAncestor(event.target, area)
  return !isRefreshing && isSingleFinger && isAtTop
}

/**
 * Drives a pull-to-refetch gesture on an element: tracks a downward pull that starts at the top of
 * the page, and calls `onRefresh` when it is released past the threshold. Horizontal swipes,
 * upward scrolls and pulls inside a scrolled list are left to the browser. While the refresh runs
 * the content stays held at the threshold, and it springs back once `onRefresh` settles, whether
 * it resolved or rejected.
 * @param areaRef - The element whose touches are tracked; touches outside it (dialogs rendered in
 * a portal, for instance) never start a pull.
 * @param onRefresh - Refetches the data; the returned promise decides how long the indicator spins.
 * @returns The content's downward offset in px, whether a finger is pulling it, and whether a
 * refresh is in progress.
 */
export function usePullToRefetch(
  areaRef: RefObject<HTMLElement>,
  onRefresh: () => Promise<unknown>,
): PullToRefetchState {
  const [distance, setDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefreshRef = useRef(onRefresh)
  const gestureRef = useRef<PullGesture>(IDLE_GESTURE)
  const distanceRef = useRef(0)
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    const area = areaRef.current
    if (!area) {
      return
    }

    /**
     * Moves the content, keeping the ref the touch handlers read in sync with the state.
     * @param newDistance - The content's new downward offset, in px.
     */
    const moveContent = (newDistance: number) => {
      distanceRef.current = newDistance
      setDistance(newDistance)
    }

    /**
     * Forgets the current gesture.
     */
    const endGesture = () => {
      gestureRef.current = IDLE_GESTURE
      setIsPulling(false)
    }

    /**
     * Holds the content at the threshold while `onRefresh` runs, then lets it spring back.
     */
    const refresh = () => {
      isRefreshingRef.current = true
      setIsRefreshing(true)
      moveContent(PULL_THRESHOLD_PX)
      void onRefreshRef
        .current()
        .catch(() => undefined)
        .finally(() => {
          isRefreshingRef.current = false
          setIsRefreshing(false)
          moveContent(0)
        })
    }

    /**
     * Starts tracking a touch that may become a pull.
     * @param event - The `touchstart` event.
     */
    const handleTouchStart = (event: TouchEvent) => {
      if (!canStartPull(event, area, isRefreshingRef.current)) {
        gestureRef.current = IDLE_GESTURE
        return
      }
      const touch = event.touches[0]
      gestureRef.current = {
        phase: PULL_PHASE.Deciding,
        startX: touch.clientX,
        startY: touch.clientY,
      }
    }

    /**
     * Decides the gesture's direction once the finger has moved enough, then follows a pull.
     * @param event - The `touchmove` event; cancelled while pulling so the page does not scroll.
     */
    const handleTouchMove = (event: TouchEvent) => {
      const gesture = gestureRef.current
      if (gesture.phase === PULL_PHASE.Idle) {
        return
      }
      const touch = event.touches[0]
      const deltaX = touch.clientX - gesture.startX
      const deltaY = touch.clientY - gesture.startY

      if (gesture.phase === PULL_PHASE.Deciding) {
        if (!hasPassedDirectionSlop(deltaX, deltaY)) {
          return
        }
        if (!isDownwardPull(deltaX, deltaY)) {
          gestureRef.current = IDLE_GESTURE
          return
        }
        gestureRef.current = { ...gesture, phase: PULL_PHASE.Pulling }
        setIsPulling(true)
      }

      if (event.cancelable) {
        event.preventDefault()
      }
      moveContent(dampPullDistance(deltaY))
    }

    /**
     * Refreshes when a pull is released past the threshold, otherwise lets the content go back.
     */
    const handleTouchEnd = () => {
      const wasPulling = gestureRef.current.phase === PULL_PHASE.Pulling
      endGesture()
      if (!wasPulling) {
        return
      }
      if (isPullPastThreshold(distanceRef.current)) {
        refresh()
      } else {
        moveContent(0)
      }
    }

    /**
     * Abandons the pull when the browser takes the touch over (a system gesture, an alert…).
     */
    const handleTouchCancel = () => {
      const wasPulling = gestureRef.current.phase === PULL_PHASE.Pulling
      endGesture()
      if (wasPulling) {
        moveContent(0)
      }
    }

    const restoreRootOverscroll = containRootOverscroll()
    area.addEventListener("touchstart", handleTouchStart, { passive: true })
    area.addEventListener("touchmove", handleTouchMove, { passive: false })
    area.addEventListener("touchend", handleTouchEnd)
    area.addEventListener("touchcancel", handleTouchCancel)

    return () => {
      restoreRootOverscroll()
      area.removeEventListener("touchstart", handleTouchStart)
      area.removeEventListener("touchmove", handleTouchMove)
      area.removeEventListener("touchend", handleTouchEnd)
      area.removeEventListener("touchcancel", handleTouchCancel)
    }
  }, [areaRef])

  return { distance, isPulling, isRefreshing }
}
