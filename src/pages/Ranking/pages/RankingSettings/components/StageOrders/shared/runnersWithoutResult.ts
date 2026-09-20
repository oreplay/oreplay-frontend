import { Participant } from "../../../../../../../domain/types/v1api"
import { RESULT_STATUS, RESULT_STATUS_TEXT } from "../../../../../../Results/shared/constants.ts"

const STATUSES_WITHOUT_RESULT: string[] = [
  RESULT_STATUS.ok,
  RESULT_STATUS.nc,
  RESULT_STATUS_TEXT.ok,
  RESULT_STATUS_TEXT.nc,
]

const hasResultStatus = (statusCode: number | string | null | undefined): boolean =>
  statusCode !== null &&
  statusCode !== undefined &&
  !STATUSES_WITHOUT_RESULT.includes(String(statusCode))

/**
 * A runner still in race carries no outcome yet: no finish time, no position and
 * a status that does not resolve the race (ok or nc). Mirrors
 * `runnerService.hasFinished`, except that nc without a finish time still counts
 * as in race.
 */
export function isRunnerWithoutResult(participant: Participant): boolean {
  const result = participant.stage
  if (!result) return true
  if (result.finish_time) return false
  if (result.position) return false
  return !hasResultStatus(result.status_code)
}

export function runnerWithoutResultLabel(participant: Participant): string {
  const className = participant.class?.short_name
  return className ? `${participant.full_name} (${className})` : participant.full_name
}

export function runnersWithoutResult(participants: Participant[]): string[] {
  return participants.filter(isRunnerWithoutResult).map(runnerWithoutResultLabel)
}
