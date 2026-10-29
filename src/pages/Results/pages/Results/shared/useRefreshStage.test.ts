import { createElement, ReactNode } from "react"
import { renderHook } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { describe, expect, it, vi } from "vitest"
import { ClassModel } from "../../../../../shared/EntityTypes.ts"
import { getEventDetailQueryKey } from "../../../services/eventDetailCache.ts"
import { useRefreshStage } from "./useRefreshStage.ts"

const ACTIVE_CLASS: ClassModel = { id: "class-1", long_name: "Men 21", short_name: "M21" }
const EVENT_ID = "event-1"

/**
 * Creates a query client whose refetch of queries is a spy, plus a wrapper providing it.
 * @param refetchQueries - Stand-in for the client's `refetchQueries`.
 * @returns The wrapper to render hooks with and the refetch spy.
 */
function createWrapper(refetchQueries: () => Promise<void>) {
  const queryClient = new QueryClient()
  const refetchQueriesSpy = vi
    .spyOn(queryClient, "refetchQueries")
    .mockImplementation(refetchQueries)

  /**
   * Provides the spied query client.
   * @param props.children - The hook under test.
   */
  function Wrapper(props: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, props.children)
  }

  return { Wrapper, refetchQueriesSpy }
}

/**
 * Renders the hook with spy reloads.
 * @param activeItem - The selected class, or `null` when none is.
 * @returns The refresh callback and the spies it should call.
 */
function renderRefreshStage(activeItem: ClassModel | null) {
  const refreshClassesClubs = vi.fn(() => Promise.resolve())
  const refetch = vi.fn(() => Promise.resolve())
  const { Wrapper, refetchQueriesSpy } = createWrapper(() => Promise.resolve())
  const { result } = renderHook(
    () =>
      useRefreshStage({
        activeItem,
        eventId: EVENT_ID,
        refreshClassesClubs,
        shownRunnersQuery: { refetch },
      }),
    { wrapper: Wrapper },
  )
  return { refresh: result.current, refreshClassesClubs, refetch, refetchQueriesSpy }
}

describe("useRefreshStage", () => {
  it("reloads the event detail, the class and club lists and the shown runners", async () => {
    const { refresh, refreshClassesClubs, refetch, refetchQueriesSpy } =
      renderRefreshStage(ACTIVE_CLASS)

    await refresh()

    expect(refetchQueriesSpy).toHaveBeenCalledWith(getEventDetailQueryKey(EVENT_ID))
    expect(refreshClassesClubs).toHaveBeenCalledOnce()
    expect(refetch).toHaveBeenCalledOnce()
  })

  it("leaves the runners alone when no class or club is selected", async () => {
    const { refresh, refreshClassesClubs, refetch, refetchQueriesSpy } = renderRefreshStage(null)

    await refresh()

    expect(refetchQueriesSpy).toHaveBeenCalledWith(getEventDetailQueryKey(EVENT_ID))
    expect(refreshClassesClubs).toHaveBeenCalledOnce()
    expect(refetch).not.toHaveBeenCalled()
  })

  it("settles only once every reload has finished", async () => {
    let finishEventDetail = () => {}
    const { Wrapper } = createWrapper(
      () =>
        new Promise<void>((resolve) => {
          finishEventDetail = resolve
        }),
    )
    const { result } = renderHook(
      () =>
        useRefreshStage({
          activeItem: ACTIVE_CLASS,
          eventId: EVENT_ID,
          refreshClassesClubs: () => Promise.resolve(),
          shownRunnersQuery: { refetch: () => Promise.resolve() },
        }),
      { wrapper: Wrapper },
    )
    const onSettled = vi.fn()

    const refreshing = result.current().then(onSettled)
    await Promise.resolve()
    expect(onSettled).not.toHaveBeenCalled()

    finishEventDetail()
    await refreshing
    expect(onSettled).toHaveBeenCalledOnce()
  })
})
