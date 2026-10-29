import { describe, expect, it } from "vitest"
import { QueryClient } from "react-query"
import { Data, EventDetailModel, StateLog, StateLogConst } from "../../../shared/EntityTypes.ts"
import { getEventDetailQueryKey, updateCachedStageLastLogs } from "./eventDetailCache.ts"

const EVENT_ID = "event-1"
const STAGE_ID = "stage-1"
const UPLOADED: StateLog = { state: StateLogConst.RESULT, created: "2026-10-29T09:00:00.000Z" }
const ENDED: StateLog = { state: StateLogConst.ENDED, created: "2026-10-29T10:00:00.000Z" }

/**
 * Builds an event detail response with one stage carrying the given logs.
 * @param logs The stage's state logs, oldest first.
 * @returns The response, with only the stage being meaningful.
 */
const buildEvent = (logs: StateLog[]): Data<EventDetailModel> => ({
  data: { stages: [{ id: STAGE_ID, last_logs: logs }] } as EventDetailModel,
})

/**
 * Reads the cached event detail.
 * @param queryClient Client holding the cache.
 * @returns The cached event detail, or `undefined` when there is none.
 */
const readCachedEvent = (queryClient: QueryClient) =>
  queryClient.getQueryData<Data<EventDetailModel>>(getEventDetailQueryKey(EVENT_ID))

describe("updateCachedStageLastLogs", () => {
  it("stores the stage's new logs in the cached event detail", () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(getEventDetailQueryKey(EVENT_ID), buildEvent([UPLOADED]))
    updateCachedStageLastLogs(queryClient, EVENT_ID, STAGE_ID, [UPLOADED, ENDED])
    expect(readCachedEvent(queryClient)?.data.stages[0].last_logs).toEqual([UPLOADED, ENDED])
  })

  it("keeps the cached event detail when the logs did not change", () => {
    const queryClient = new QueryClient()
    const event = buildEvent([UPLOADED])
    queryClient.setQueryData(getEventDetailQueryKey(EVENT_ID), event)
    updateCachedStageLastLogs(queryClient, EVENT_ID, STAGE_ID, [{ ...UPLOADED }])
    expect(readCachedEvent(queryClient)).toBe(event)
  })

  it("caches nothing when the event detail was never fetched", () => {
    const queryClient = new QueryClient()
    updateCachedStageLastLogs(queryClient, EVENT_ID, STAGE_ID, [UPLOADED])
    expect(queryClient.getQueryCache().find(getEventDetailQueryKey(EVENT_ID))).toBeUndefined()
  })
})
