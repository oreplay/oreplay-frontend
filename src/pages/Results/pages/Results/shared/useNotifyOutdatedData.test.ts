import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useNotifyOutdatedData } from "./useNotifyOutdatedData.ts"

const notifyError = vi.fn()

vi.mock("../../../../../infrastructure/notifications/useNotifyError.ts", () => ({
  useNotifyError: () => notifyError,
}))

const NETWORK_ERROR = new Error("Network Error")

/**
 * Renders the hook with a changeable outdated state.
 * @param isOutdated Initial outdated state.
 * @returns The hook's `rerender`, taking the next outdated state.
 */
function renderNotifyOutdatedData(isOutdated: boolean) {
  const { rerender } = renderHook(
    (props: { isOutdated: boolean }) => useNotifyOutdatedData(props.isOutdated, NETWORK_ERROR),
    { initialProps: { isOutdated } },
  )
  return (next: boolean) => rerender({ isOutdated: next })
}

describe("useNotifyOutdatedData", () => {
  beforeEach(() => notifyError.mockClear())

  it("notifies the error when the data becomes outdated", () => {
    const rerender = renderNotifyOutdatedData(false)

    rerender(true)

    expect(notifyError).toHaveBeenCalledOnce()
    expect(notifyError).toHaveBeenCalledWith(NETWORK_ERROR)
  })

  it("notifies only once while the data stays outdated", () => {
    const rerender = renderNotifyOutdatedData(true)

    rerender(true)
    rerender(true)

    expect(notifyError).toHaveBeenCalledOnce()
  })

  it("notifies again after a successful refresh and a new failure", () => {
    const rerender = renderNotifyOutdatedData(true)

    rerender(false)
    rerender(true)

    expect(notifyError).toHaveBeenCalledTimes(2)
  })

  it("does not notify while the data is current", () => {
    const rerender = renderNotifyOutdatedData(false)

    rerender(false)

    expect(notifyError).not.toHaveBeenCalled()
  })
})
