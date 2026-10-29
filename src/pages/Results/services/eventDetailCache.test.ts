import { describe, expect, it } from "vitest"
import { QueryClient } from "react-query"
import { LastDates } from "../../../domain/types/v1api"
import { Data, EventDetailModel } from "../../../shared/EntityTypes.ts"
import { getEventDetailQueryKey, updateCachedStageLastDates } from "./eventDetailCache.ts"

const EVENT_ID = "event-1"
const STAGE_ID = "stage-1"
const UPLOADED: LastDates = { results: "2026-10-29T09:00:00.000Z" }
const ENDED: LastDates = { ...UPLOADED, final: "2026-10-29T10:00:00.000Z" }

/**
 * Builds an event detail response with one stage carrying the given last dates.
 * @param lastDates When the stage last had each kind of event.
 * @returns The response, with only the stage being meaningful.
 */
const buildEvent = (lastDates: LastDates): Data<EventDetailModel> => ({
  data: { stages: [{ id: STAGE_ID, last_dates: lastDates }] } as EventDetailModel,
})

/**
 * Reads the cached event detail.
 * @param queryClient Client holding the cache.
 * @returns The cached event detail, or `undefined` when there is none.
 */
const readCachedEvent = (queryClient: QueryClient) =>
  queryClient.getQueryData<Data<EventDetailModel>>(getEventDetailQueryKey(EVENT_ID))

describe("updateCachedStageLastDates", () => {
  it("stores the stage's new dates in the cached event detail", () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(getEventDetailQueryKey(EVENT_ID), buildEvent(UPLOADED))
    updateCachedStageLastDates(queryClient, EVENT_ID, STAGE_ID, ENDED)
    expect(readCachedEvent(queryClient)?.data.stages[0].last_dates).toEqual(ENDED)
  })

  it("keeps the cached event detail when the dates did not change", () => {
    const queryClient = new QueryClient()
    const event = buildEvent(UPLOADED)
    queryClient.setQueryData(getEventDetailQueryKey(EVENT_ID), event)
    updateCachedStageLastDates(queryClient, EVENT_ID, STAGE_ID, { ...UPLOADED })
    expect(readCachedEvent(queryClient)).toBe(event)
  })

  it("caches nothing when the event detail was never fetched", () => {
    const queryClient = new QueryClient()
    updateCachedStageLastDates(queryClient, EVENT_ID, STAGE_ID, UPLOADED)
    expect(queryClient.getQueryCache().find(getEventDetailQueryKey(EVENT_ID))).toBeUndefined()
  })
})
