import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { usePendingRemoval } from "./usePendingRemoval.ts"

const deferred = () => {
  let resolve: (removed: boolean) => void = () => undefined
  const promise = new Promise<boolean>((done) => (resolve = done))
  return { promise, resolve }
}

describe("usePendingRemoval", () => {
  it("stays confirming until the removal resolves, then clears the pending item", async () => {
    const removal = deferred()
    const { result } = renderHook(() => usePendingRemoval(() => removal.promise))
    act(() => result.current.request("runner-1"))

    let confirmed: Promise<void> = Promise.resolve()
    act(() => {
      confirmed = result.current.confirm()
    })
    expect(result.current.isConfirming).toBe(true)
    expect(result.current.pending).toBe("runner-1")

    await act(async () => {
      removal.resolve(true)
      await confirmed
    })
    expect(result.current.isConfirming).toBe(false)
    expect(result.current.pending).toBeNull()
  })

  it("ignores a second confirm while the first is still running", async () => {
    const removal = deferred()
    const onRemove = vi.fn(() => removal.promise)
    const { result } = renderHook(() => usePendingRemoval(onRemove))
    act(() => result.current.request("runner-1"))

    let confirmed: Promise<void> = Promise.resolve()
    act(() => {
      confirmed = result.current.confirm()
    })
    await act(async () => {
      await result.current.confirm()
    })
    await act(async () => {
      removal.resolve(true)
      await confirmed
    })
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it("keeps the item pending when the removal fails", async () => {
    const { result } = renderHook(() => usePendingRemoval(() => Promise.resolve(false)))
    act(() => result.current.request("runner-1"))
    await act(async () => {
      await result.current.confirm()
    })
    expect(result.current.pending).toBe("runner-1")
    expect(result.current.isConfirming).toBe(false)
  })
})
