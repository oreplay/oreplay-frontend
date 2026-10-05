import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useOnlineStatus } from "./useOnlineStatus.ts"

function goOnline(isOnline: boolean) {
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(isOnline)
  window.dispatchEvent(new Event(isOnline ? "online" : "offline"))
}

describe("useOnlineStatus", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("reports the current connectivity", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false)

    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(false)
  })

  it("follows connectivity changes", () => {
    const { result } = renderHook(() => useOnlineStatus())

    act(() => goOnline(false))
    expect(result.current).toBe(false)

    act(() => goOnline(true))
    expect(result.current).toBe(true)
  })
})
