import { DateTime, Duration } from "luxon"
import { StageModel } from "../../../../../shared/EntityTypes.ts"
import { isStageEnded } from "../../../../shared/isStageEnded.ts"

export const LIVE_UPDATE_WINDOW = Duration.fromObject({ minutes: 15 })

/**
 * Parses one of the dates the backend reports for a stage: its start or its latest events.
 * @param date ISO date-time; null or absent when unknown or when that event never happened.
 * @returns The parsed moment, or `null` when there is no date or it cannot be parsed.
 */
function parseStageDate(date?: string | null): DateTime | null {
  if (!date) {
    return null
  }
  const parsed = DateTime.fromISO(date)
  return parsed.isValid ? parsed : null
}

/**
 * Picks the most recent of some moments.
 * @param moments Moments to compare; `null` entries are skipped.
 * @returns The latest moment, or `null` when every entry is `null`.
 */
function latestOf(moments: (DateTime | null)[]): DateTime | null {
  const known = moments.filter((moment): moment is DateTime => moment !== null)
  return DateTime.max(...known) ?? null
}

/**
 * Finds when the stage last received live results, so viewers can tell whether it is still being
 * updated. Stages that were cleared after their latest upload, or made official, have no live
 * status.
 * @param stage Stage whose last dates are read.
 * @returns The moment of the latest start list or results upload, or `null` when the stage has no
 * upload, it was cleared at or after it, it is official, or the dates cannot be parsed.
 */
export function getStageLastUpdate(stage: StageModel): DateTime | null {
  const lastUpload = latestOf([
    parseStageDate(stage.last_dates?.start_list),
    parseStageDate(stage.last_dates?.results),
  ])
  const cleared = parseStageDate(stage.last_dates?.cleared)
  const isClearedSinceUpload = lastUpload !== null && cleared !== null && cleared >= lastUpload
  if (!lastUpload || isClearedSinceUpload || isStageEnded(stage)) {
    return null
  }
  return lastUpload
}

/**
 * Tells whether a stage has started, so its live status is not shown while only the start list is
 * up.
 * @param stageStart Stage start as an ISO date-time; null or absent when unknown.
 * @param now Current moment.
 * @returns `true` once the start is reached, and also when the start is unknown or cannot be
 * parsed, so a missing start never hides the live status.
 */
export function hasStageStarted(stageStart: string | null | undefined, now: DateTime): boolean {
  const start = parseStageDate(stageStart)
  return start === null || now >= start
}

/**
 * Tells whether a stage is live: it received results within the last {@link LIVE_UPDATE_WINDOW}.
 * @param lastUpdate Moment of the stage's latest upload.
 * @param now Current moment; an update dated after it (clock skew) counts as live.
 * @returns `true` while the latest upload is recent enough.
 */
export function isStageLive(lastUpdate: DateTime, now: DateTime): boolean {
  return now.diff(lastUpdate).toMillis() < LIVE_UPDATE_WINDOW.toMillis()
}
