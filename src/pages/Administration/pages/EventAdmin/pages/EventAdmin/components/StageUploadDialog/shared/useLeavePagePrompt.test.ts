import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useLeavePagePrompt } from "./useLeavePagePrompt.ts"

const isLeavingPrompted = () => {
  const leaving = new Event("beforeunload", { cancelable: true })
  window.dispatchEvent(leaving)
  return leaving.defaultPrevented
}

describe("useLeavePagePrompt", () => {
  it("asks the browser to confirm leaving while active", () => {
    renderHook(() => useLeavePagePrompt(true))

    expect(isLeavingPrompted()).toBe(true)
  })

  it("lets the page go while inactive", () => {
    renderHook(() => useLeavePagePrompt(false))

    expect(isLeavingPrompted()).toBe(false)
  })

  it("stops asking once it is no longer active", () => {
    const { rerender } = renderHook(({ isActive }) => useLeavePagePrompt(isActive), {
      initialProps: { isActive: true },
    })

    rerender({ isActive: false })

    expect(isLeavingPrompted()).toBe(false)
  })

  it("stops asking once unmounted", () => {
    const { unmount } = renderHook(() => useLeavePagePrompt(true))

    unmount()

    expect(isLeavingPrompted()).toBe(false)
  })
})
