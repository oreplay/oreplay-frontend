import { createElement, ReactNode } from "react"
import { renderHook } from "@testing-library/react"
import { QueryClient, QueryClientProvider, UseMutationOptions } from "react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { getEventDetailQueryKey } from "../../../../../../../../Results/services/eventDetailCache.ts"
import { useSetStageEnded } from "./useSetStageEnded.ts"

const EVENT_ID = "event-1"
const STAGE_ID = "stage-1"
const REQUEST_ERROR = new Error("Request failed")

const patchStages = vi.fn()
const showNotification = vi.fn()
const notifyError = vi.fn()

vi.mock("../../../../../../../../../infrastructure/repositories/stages/stages.ts", async () => {
  const { useMutation } = await import("react-query")
  return {
    usePatchStages: (options?: { mutation?: UseMutationOptions<unknown, unknown, unknown> }) =>
      useMutation(patchStages, options?.mutation),
  }
})
vi.mock("@toolpad/core/useNotifications", () => ({
  useNotifications: () => ({ show: showNotification }),
}))
vi.mock("../../../../../../../../../infrastructure/notifications/useNotifyError.ts", () => ({
  useNotifyError: () => notifyError,
}))

/**
 * Renders the hook with a query client whose invalidation is a spy.
 * @param invalidateQueries Stand-in for the client's `invalidateQueries`.
 * @returns The action built by the hook and the invalidation spy.
 */
function renderSetStageEnded(invalidateQueries: () => Promise<void>) {
  const queryClient = new QueryClient()
  const invalidateQueriesSpy = vi
    .spyOn(queryClient, "invalidateQueries")
    .mockImplementation(invalidateQueries)

  /**
   * Provides the spied query client.
   * @param props.children The hook under test.
   */
  function Wrapper(props: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, props.children)
  }

  const { result } = renderHook(() => useSetStageEnded(EVENT_ID), { wrapper: Wrapper })
  return { setStageEnded: result.current, invalidateQueriesSpy }
}

describe("useSetStageEnded", () => {
  beforeEach(() => {
    patchStages.mockReset()
    showNotification.mockClear()
    notifyError.mockClear()
  })

  it("sends the official state of the stage", async () => {
    patchStages.mockResolvedValue({})
    const { setStageEnded } = renderSetStageEnded(() => Promise.resolve())

    await setStageEnded(STAGE_ID, true)

    expect(patchStages).toHaveBeenCalledWith({
      eventID: EVENT_ID,
      stageID: STAGE_ID,
      data: { state_end: true },
    })
  })

  it("settles only after the event detail has been reloaded", async () => {
    patchStages.mockResolvedValue({})
    let finishReload = () => {}
    const { setStageEnded, invalidateQueriesSpy } = renderSetStageEnded(
      () => new Promise<void>((resolve) => (finishReload = resolve)),
    )
    let hasSettled = false

    const pending = setStageEnded(STAGE_ID, true).then(() => (hasSettled = true))
    await vi.waitFor(() => expect(invalidateQueriesSpy).toHaveBeenCalled())

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(getEventDetailQueryKey(EVENT_ID))
    expect(hasSettled).toBe(false)
    expect(showNotification).not.toHaveBeenCalled()

    finishReload()
    await pending

    expect(showNotification).toHaveBeenCalledOnce()
  })

  it("reports a failure and settles without rejecting", async () => {
    patchStages.mockRejectedValue(REQUEST_ERROR)
    const { setStageEnded, invalidateQueriesSpy } = renderSetStageEnded(() => Promise.resolve())

    await expect(setStageEnded(STAGE_ID, false)).resolves.toBeUndefined()

    expect(notifyError.mock.calls[0][0]).toBe(REQUEST_ERROR)
    expect(invalidateQueriesSpy).not.toHaveBeenCalled()
    expect(showNotification).not.toHaveBeenCalled()
  })
})
