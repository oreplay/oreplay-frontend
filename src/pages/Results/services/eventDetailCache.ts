import { QueryClient } from "react-query"
import { Data, EventDetailModel, StateLog } from "../../../shared/EntityTypes.ts"
import { withStageLastLogs } from "../shared/stageLastLogs.ts"

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
 * Stores a stage's latest state logs in the cached event detail, so the stage's live and official
 * status follow every results refresh instead of waiting for the event detail to be refetched.
 * Nothing is cached when the event detail was never fetched, and the cache is left alone when the
 * logs did not change.
 * @param queryClient Client whose cache holds the event detail.
 * @param eventId Event the stage belongs to.
 * @param stageId Stage the logs belong to.
 * @param lastLogs The stage's latest state logs, oldest first.
 */
export function updateCachedStageLastLogs(
  queryClient: QueryClient,
  eventId: string,
  stageId: string,
  lastLogs: StateLog[],
): void {
  const queryKey = getEventDetailQueryKey(eventId)
  const cachedEvent = queryClient.getQueryData<Data<EventDetailModel>>(queryKey)
  if (!cachedEvent) {
    return
  }
  const updatedEvent = withStageLastLogs(cachedEvent, stageId, lastLogs)
  if (updatedEvent !== cachedEvent) {
    queryClient.setQueryData(queryKey, updatedEvent)
  }
}
