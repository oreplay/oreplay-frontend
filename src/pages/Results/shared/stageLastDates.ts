import { LastDates } from "../../../domain/types/v1api"
import { Data, EventDetailModel } from "../../../shared/EntityTypes.ts"

const LAST_DATE_FIELDS = ["cleared", "final", "results", "start_list"] as const

/**
 * Tells whether two sets of a stage's last dates report the same moments.
 * @param current Dates already known; absent when the stage had none.
 * @param incoming Dates just received.
 * @returns `true` when every date matches, treating null and absent alike.
 */
function areSameLastDates(current: LastDates | undefined, incoming: LastDates): boolean {
  return LAST_DATE_FIELDS.every((field) => (current?.[field] ?? null) === (incoming[field] ?? null))
}

/**
 * Replaces one stage's last dates inside an event detail, so fresher dates (e.g. the ones the
 * results endpoint returns) reach everything that reads the stage from the event.
 * @param event Event detail holding the stage.
 * @param stageId Stage whose dates are replaced.
 * @param lastDates When the stage last had each kind of event.
 * @returns A new event detail with the stage's dates replaced, or the same `event` object when the
 * stage is not in it or its dates are already these, so callers can skip needless updates.
 */
export function withStageLastDates(
  event: Data<EventDetailModel>,
  stageId: string,
  lastDates: LastDates,
): Data<EventDetailModel> {
  const stage = event.data.stages.find((candidate) => candidate.id === stageId)
  if (!stage || areSameLastDates(stage.last_dates, lastDates)) {
    return event
  }
  const stages = event.data.stages.map((candidate) =>
    candidate.id === stageId ? { ...candidate, last_dates: lastDates } : candidate,
  )
  return { ...event, data: { ...event.data, stages } }
}
