import { DateTime } from "luxon"
import { ControlPunch, Participant } from "../../../../../../../domain/types/v1api"

/**
 * What one row of the punches list shows, with the optional fields of the API already resolved.
 */
export interface PunchRow {
  elapsedSeconds: number | null
  id: string
  participant: Participant
  readingTime: string
  teamMemberName: string | null
}

/**
 * Seconds from the start of whoever punched to the punch: the leg runner's own start for a relay,
 * since each leg has its start time.
 * @param startTime Start of the runner or team, as ISO 8601; missing when not known yet.
 * @param readingTime Time of the punch, as ISO 8601.
 * @returns Whole seconds, or `null` without a start or when the punch is before it (wrong data).
 */
export function getElapsedSeconds(
  startTime: string | undefined,
  readingTime: string,
): number | null {
  if (!startTime) {
    return null
  }
  const elapsed = DateTime.fromISO(readingTime).diff(DateTime.fromISO(startTime)).as("seconds")
  return elapsed < 0 ? null : Math.floor(elapsed)
}

/**
 * Builds the row of one punch: the team of a relay leg or the runner as the participant, since a
 * relay leg's runner has no class of its own, and the leg runner's name under the team.
 * @param punch One punch from the API.
 * @returns The row, or `null` when the punch has no split, no punch time or nobody attached.
 */
export function toPunchRow(punch: ControlPunch): PunchRow | null {
  const readingTime = punch.split?.reading_time
  const participant = punch.team ?? punch.runner
  if (!punch.split || !readingTime || !participant) {
    return null
  }
  const puncher = punch.runner ?? punch.team
  const teamMemberName = punch.team && punch.runner ? punch.runner.full_name : null
  return {
    elapsedSeconds: getElapsedSeconds(puncher?.stage?.start_time, readingTime),
    id: punch.split.id,
    participant,
    readingTime,
    teamMemberName,
  }
}

/**
 * Rows of the punches list, in the order the API sends them (newest first).
 * @param punches The page of punches from the API.
 * @returns One row per displayable punch; punches missing their split or participant are left out.
 */
export function toPunchRows(punches: ControlPunch[]): PunchRow[] {
  return punches.map(toPunchRow).filter((row): row is PunchRow => row !== null)
}
