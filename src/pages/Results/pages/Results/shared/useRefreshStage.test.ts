import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ClassModel } from "../../../../../shared/EntityTypes.ts"
import { useRefreshStage } from "./useRefreshStage.ts"

const ACTIVE_CLASS: ClassModel = { id: "class-1", long_name: "Men 21", short_name: "M21" }

/**
 * Renders the hook with spy reloads.
 * @param activeItem - The selected class, or `null` when none is.
 * @returns The refresh callback and the spies it should call.
 */
function renderRefreshStage(activeItem: ClassModel | null) {
  const refreshClassesClubs = vi.fn(() => Promise.resolve())
  const refetch = vi.fn(() => Promise.resolve())
  const { result } = renderHook(() =>
    useRefreshStage({ activeItem, refreshClassesClubs, shownRunnersQuery: { refetch } }),
  )
  return { refresh: result.current, refreshClassesClubs, refetch }
}

describe("useRefreshStage", () => {
  it("reloads the class and club lists and the shown runners", async () => {
    const { refresh, refreshClassesClubs, refetch } = renderRefreshStage(ACTIVE_CLASS)

    await refresh()

    expect(refreshClassesClubs).toHaveBeenCalledOnce()
    expect(refetch).toHaveBeenCalledOnce()
  })

  it("leaves the runners alone when no class or club is selected", async () => {
    const { refresh, refreshClassesClubs, refetch } = renderRefreshStage(null)

    await refresh()

    expect(refreshClassesClubs).toHaveBeenCalledOnce()
    expect(refetch).not.toHaveBeenCalled()
  })

  it("settles only once every reload has finished", async () => {
    let finishRunners = () => {}
    const refetch = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishRunners = resolve
        }),
    )
    const { result } = renderHook(() =>
      useRefreshStage({
        activeItem: ACTIVE_CLASS,
        refreshClassesClubs: () => Promise.resolve(),
        shownRunnersQuery: { refetch },
      }),
    )
    const onSettled = vi.fn()

    const refreshing = result.current().then(onSettled)
    await Promise.resolve()
    expect(onSettled).not.toHaveBeenCalled()

    finishRunners()
    await refreshing
    expect(onSettled).toHaveBeenCalledOnce()
  })
})
