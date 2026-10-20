import { act, fireEvent, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { PULL_DAMPING, PULL_THRESHOLD_PX } from "./pullGesture.ts"
import { usePullToRefetch } from "./usePullToRefetch.ts"

const START_X = 100
const START_Y = 100
const PAST_THRESHOLD_FINGER_PX = PULL_THRESHOLD_PX / PULL_DAMPING + 20
const SHORT_PULL_FINGER_PX = 40

let area: HTMLDivElement

/**
 * Renders the hook on a fresh pull area.
 * @param onRefresh - The refresh action under test.
 * @returns The hook's live result.
 */
function renderPull(onRefresh: () => Promise<unknown>) {
  return renderHook(() => usePullToRefetch({ current: area }, onRefresh)).result
}

/**
 * Plays a one-finger gesture on the pull area: touch, move by the given offsets, and lift.
 * @param deltaX - Horizontal travel, in px.
 * @param deltaY - Vertical travel, in px; positive is down.
 * @param release - Whether to lift the finger at the end.
 * @returns The `touchmove` event, to check whether it was cancelled.
 */
function swipe(deltaX: number, deltaY: number, release = true): Event {
  const touchMove = new Event("touchmove", { bubbles: true, cancelable: true })
  Object.defineProperty(touchMove, "touches", {
    value: [{ clientX: START_X + deltaX, clientY: START_Y + deltaY }],
  })
  act(() => {
    fireEvent.touchStart(area, { touches: [{ clientX: START_X, clientY: START_Y }] })
    area.dispatchEvent(touchMove)
  })
  if (release) {
    act(() => {
      fireEvent.touchEnd(area, { touches: [] })
    })
  }
  return touchMove
}

beforeEach(() => {
  area = document.createElement("div")
  document.body.appendChild(area)
})

afterEach(() => {
  area.remove()
})

describe("usePullToRefetch", () => {
  it("follows a downward pull with damping and cancels the page scroll", () => {
    const result = renderPull(() => Promise.resolve())

    const touchMove = swipe(0, SHORT_PULL_FINGER_PX, false)

    expect(result.current.distance).toBe(SHORT_PULL_FINGER_PX * PULL_DAMPING)
    expect(result.current.isPulling).toBe(true)
    expect(touchMove.defaultPrevented).toBe(true)
  })

  it("refreshes when released past the threshold, holding the content until it settles", async () => {
    let finishRefresh = () => {}
    const onRefresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishRefresh = resolve
        }),
    )
    const result = renderPull(onRefresh)

    swipe(0, PAST_THRESHOLD_FINGER_PX)

    expect(onRefresh).toHaveBeenCalledOnce()
    expect(result.current).toEqual({
      distance: PULL_THRESHOLD_PX,
      isPulling: false,
      isRefreshing: true,
    })

    await act(async () => {
      finishRefresh()
      await Promise.resolve()
    })
    expect(result.current).toEqual({ distance: 0, isPulling: false, isRefreshing: false })
  })

  it("springs back without refreshing when released before the threshold", () => {
    const onRefresh = vi.fn(() => Promise.resolve())
    const result = renderPull(onRefresh)

    swipe(0, SHORT_PULL_FINGER_PX)

    expect(onRefresh).not.toHaveBeenCalled()
    expect(result.current.distance).toBe(0)
  })

  it("recovers when the refresh fails", async () => {
    const result = renderPull(() => Promise.reject(new Error("offline")))

    swipe(0, PAST_THRESHOLD_FINGER_PX)
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current).toEqual({ distance: 0, isPulling: false, isRefreshing: false })
  })

  it("leaves horizontal swipes to the browser", () => {
    const onRefresh = vi.fn(() => Promise.resolve())
    const result = renderPull(onRefresh)

    const touchMove = swipe(80, 20)

    expect(touchMove.defaultPrevented).toBe(false)
    expect(result.current.distance).toBe(0)
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it("ignores pulls inside a list that is scrolled down", () => {
    const list = document.createElement("ul")
    area.appendChild(list)
    Object.defineProperty(list, "scrollTop", { value: 50 })
    const onRefresh = vi.fn(() => Promise.resolve())
    renderPull(onRefresh)

    act(() => {
      fireEvent.touchStart(list, { touches: [{ clientX: START_X, clientY: START_Y }] })
      fireEvent.touchMove(list, {
        touches: [{ clientX: START_X, clientY: START_Y + PAST_THRESHOLD_FINGER_PX }],
      })
      fireEvent.touchEnd(list, { touches: [] })
    })

    expect(onRefresh).not.toHaveBeenCalled()
  })

  it("does not start a second refresh while one is running", () => {
    const onRefresh = vi.fn(() => new Promise<void>(() => {}))
    renderPull(onRefresh)

    swipe(0, PAST_THRESHOLD_FINGER_PX)
    swipe(0, PAST_THRESHOLD_FINGER_PX)

    expect(onRefresh).toHaveBeenCalledOnce()
  })

  it("turns off the browser's own pull-to-refresh only while mounted", () => {
    const { unmount } = renderHook(() =>
      usePullToRefetch({ current: area }, () => Promise.resolve()),
    )
    expect(document.documentElement.style.overscrollBehaviorY).toBe("contain")

    unmount()
    expect(document.documentElement.style.overscrollBehaviorY).toBe("")
  })
})
