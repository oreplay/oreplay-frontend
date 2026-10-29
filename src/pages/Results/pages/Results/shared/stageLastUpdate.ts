import { DateTime, Duration } from "luxon"
import { StageModel, StateLogConst } from "../../../../../shared/EntityTypes.ts"
import { isStageEnded } from "../../../../shared/isStageEnded.ts"

export const LIVE_UPDATE_WINDOW = Duration.fromObject({ minutes: 15 })

/**
 * Finds when the stage last received live results, so viewers can tell whether it is still being
 * updated. Stages that were cleared or made official have no live status.
 * @param stage Stage whose state logs are read; the latest log is the last one.
 * @returns The moment of the latest upload, or `null` when the stage has no logs, its latest log
 * clears it, it is official, or the log's date cannot be parsed.
 */
export function getStageLastUpdate(stage: StageModel): DateTime | null {
  const lastLog = stage.last_logs?.at(-1)
  if (!lastLog || lastLog.state === StateLogConst.CLEAR || isStageEnded(stage)) {
    return null
  }
  const lastUpdate = DateTime.fromISO(lastLog.created)
  return lastUpdate.isValid ? lastUpdate : null
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
