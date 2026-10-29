import { QueryClient } from "react-query"
import { LastDates } from "../../../domain/types/v1api"
import { Data, EventDetailModel } from "../../../shared/EntityTypes.ts"
import { withStageLastDates } from "../shared/stageLastDates.ts"

/**
 * React Query key of an event's detail, shared by every reader of the event (and its stages'
 * official state) so one refetch updates them all.
 * @param id Event id.
 * @returns The query key.
 */
export function getEventDetailQueryKey(id: string) {
  return ["eventDetail", id] as const
}

/**
 * Stores a stage's last dates in the cached event detail, so the stage's live and official status
 * follow every results refresh instead of waiting for the event detail to be refetched. Nothing is
 * cached when the event detail was never fetched, and the cache is left alone when the dates did
 * not change.
 * @param queryClient Client whose cache holds the event detail.
 * @param eventId Event the stage belongs to.
 * @param stageId Stage the dates belong to.
 * @param lastDates When the stage last had each kind of event.
 */
export function updateCachedStageLastDates(
  queryClient: QueryClient,
  eventId: string,
  stageId: string,
  lastDates: LastDates,
): void {
  const queryKey = getEventDetailQueryKey(eventId)
  const cachedEvent = queryClient.getQueryData<Data<EventDetailModel>>(queryKey)
  if (!cachedEvent) {
    return
  }
  const updatedEvent = withStageLastDates(cachedEvent, stageId, lastDates)
  if (updatedEvent !== cachedEvent) {
    queryClient.setQueryData(queryKey, updatedEvent)
  }
}
