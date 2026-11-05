import { afterEach, describe, expect, it } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useSelectedRunners } from "./useSelectedRunners.ts"
import { SELECTED_RUNNERS_STORAGE_KEY } from "./selectedRunners.ts"

const originalStorage = Object.getOwnPropertyDescriptor(window, "localStorage")

/**
 * Makes every access to `localStorage` throw, as browsers do when site data is blocked.
 */
function blockStorage() {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get() {
      throw new DOMException("Access is denied", "SecurityError")
    },
  })
}

describe("useSelectedRunners", () => {
  afterEach(() => {
    if (originalStorage) Object.defineProperty(window, "localStorage", originalStorage)
  })

  it("remembers the selection in the browser storage", () => {
    const { result } = renderHook(() => useSelectedRunners([]))
    act(() => result.current[1](["runner"]))

    expect(localStorage.getItem(SELECTED_RUNNERS_STORAGE_KEY)).toBe(JSON.stringify(["runner"]))
  })

  it("works without the browser storage, keeping the selection in memory", () => {
    blockStorage()

    const { result } = renderHook(() => useSelectedRunners([]))
    act(() => result.current[1](["runner"]))

    expect(result.current[0]).toEqual(["runner"])
  })
})
