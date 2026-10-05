import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { BACK_ONLINE_DISPLAY_MS } from "./connectionBar.ts"
import { useConnectionBar } from "./useConnectionBar.ts"

describe("useConnectionBar", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("stays hidden while online", () => {
    const { result } = renderHook(({ isOnline }) => useConnectionBar(isOnline), {
      initialProps: { isOnline: true },
    })

    expect(result.current.isVisible).toBe(false)

    act(() => {
      vi.advanceTimersByTime(BACK_ONLINE_DISPLAY_MS)
    })

    expect(result.current.isVisible).toBe(false)
  })

  it("shows back online after reconnecting and hides it after a while", () => {
    const { result, rerender } = renderHook(({ isOnline }) => useConnectionBar(isOnline), {
      initialProps: { isOnline: true },
    })

    rerender({ isOnline: false })
    expect(result.current).toEqual({ kind: "offline", isVisible: true })

    rerender({ isOnline: true })
    expect(result.current).toEqual({ kind: "backOnline", isVisible: true })

    act(() => {
      vi.advanceTimersByTime(BACK_ONLINE_DISPLAY_MS)
    })
    expect(result.current).toEqual({ kind: "backOnline", isVisible: false })
  })

  it("keeps the offline bar if the connection drops again before hiding", () => {
    const { result, rerender } = renderHook(({ isOnline }) => useConnectionBar(isOnline), {
      initialProps: { isOnline: false },
    })

    rerender({ isOnline: true })
    rerender({ isOnline: false })
    act(() => {
      vi.advanceTimersByTime(BACK_ONLINE_DISPLAY_MS)
    })

    expect(result.current).toEqual({ kind: "offline", isVisible: true })
  })
})
