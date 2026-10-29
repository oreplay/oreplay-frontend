import { createElement, ReactNode } from "react"
import { act, renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider, useQuery } from "react-query"
import { describe, expect, it } from "vitest"
import { useOutdatedDataError } from "./useOutdatedDataError.ts"

const RUNNERS_KEY = ["event-1", "stage-1", "results", "classes", "class-1"]
const RUNNERS = ["Ana", "Luis"]
const NETWORK_ERROR = new Error("Network Error")

/**
 * Creates a wrapper providing the given query client.
 * @param queryClient The client the hooks under test use.
 * @returns The wrapper component.
 */
function createWrapper(queryClient: QueryClient) {
  /**
   * Provides the query client.
   * @param props.children The hook under test.
   */
  function Wrapper(props: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, props.children)
  }
  return Wrapper
}

/**
 * Renders a runners query already holding data, whose next refresh fails, next to the hook.
 * @returns The hook's result, with the query to refresh.
 */
function renderWithFailingRefresh() {
  const wrapper = createWrapper(new QueryClient())
  return renderHook(
    () => ({
      runnersQuery: useQuery(RUNNERS_KEY, () => Promise.reject(NETWORK_ERROR), {
        initialData: RUNNERS,
        retry: false,
        staleTime: Infinity,
      }),
      outdatedDataError: useOutdatedDataError(),
    }),
    { wrapper },
  )
}

describe("useOutdatedDataError", () => {
  it("reports nothing while the data on screen is current", () => {
    const { result } = renderWithFailingRefresh()

    expect(result.current.outdatedDataError).toBeUndefined()
  })

  it("reports the error when a query on screen fails to refresh", async () => {
    const { result } = renderWithFailingRefresh()

    await act(() => result.current.runnersQuery.refetch())

    await waitFor(() => expect(result.current.outdatedDataError).toBe(NETWORK_ERROR))
    expect(result.current.runnersQuery.data).toEqual(RUNNERS)
  })

  it("ignores a failed query that is not on screen", async () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(RUNNERS_KEY, RUNNERS)
    await queryClient
      .fetchQuery(RUNNERS_KEY, () => Promise.reject(NETWORK_ERROR))
      .catch(() => undefined)

    const { result } = renderHook(() => useOutdatedDataError(), {
      wrapper: createWrapper(queryClient),
    })

    expect(result.current).toBeUndefined()
  })
})
