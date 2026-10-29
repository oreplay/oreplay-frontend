import { Data, EventDetailModel, StateLog } from "../../../shared/EntityTypes.ts"

/**
 * Tells whether two lists of state logs hold the same logs in the same order.
 * @param current Logs already known.
 * @param incoming Logs just received.
 * @returns `true` when every log matches by state and date.
 */
function areSameLogs(current: StateLog[], incoming: StateLog[]): boolean {
  return (
    current.length === incoming.length &&
    current.every(
      (log, index) =>
        log.state === incoming[index].state && log.created === incoming[index].created,
    )
  )
}

/**
 * Replaces one stage's latest state logs inside an event detail, so fresher logs (e.g. the ones the
 * results endpoint returns) reach everything that reads the stage from the event.
 * @param event Event detail holding the stage.
 * @param stageId Stage whose logs are replaced.
 * @param lastLogs The stage's latest state logs, oldest first.
 * @returns A new event detail with the stage's logs replaced, or the same `event` object when the
 * stage is not in it or its logs are already these, so callers can skip needless updates.
 */
export function withStageLastLogs(
  event: Data<EventDetailModel>,
  stageId: string,
  lastLogs: StateLog[],
): Data<EventDetailModel> {
  const stage = event.data.stages.find((candidate) => candidate.id === stageId)
  if (!stage || areSameLogs(stage.last_logs, lastLogs)) {
    return event
  }
  const stages = event.data.stages.map((candidate) =>
    candidate.id === stageId ? { ...candidate, last_logs: lastLogs } : candidate,
  )
  return { ...event, data: { ...event.data, stages } }
}
