import { RESULT_STATUS_TEXT } from "../../../shared/constants.ts"
import { parseResultStatus } from "../../../shared/sortingFunctions/sortRunners.ts"
import {
  parseSecondsToMMSS,
  parseStartTime,
  parseTimeBehind,
} from "../../../../../shared/Functions.tsx"
import {
  ProcessedRunnerModel,
  ProcessedRunnerResultModel,
  ProcessedSplitModel,
} from "./EntityTypes.ts"

export const EMPTY_SPLIT = "--"
export const EMPTY_VALUE = "—"

export const STATUS_CHIP_VARIANT = { Error: "error", Neutral: "neutral" } as const
export type StatusChipVariant = (typeof STATUS_CHIP_VARIANT)[keyof typeof STATUS_CHIP_VARIANT]

const INVALIDATED_TIME_STATUSES: readonly string[] = [
  RESULT_STATUS_TEXT.dnf,
  RESULT_STATUS_TEXT.dsq,
  RESULT_STATUS_TEXT.mp,
  RESULT_STATUS_TEXT.ot,
]
const BEST_POSITION = 1
const FINISH_ORDER_NUMBER = Infinity
const TEAM_MEMBER_SEPARATOR = " · "

/**
 * Time a ranked result is behind the winner, such as "+01:48".
 *
 * @param result The runner's result.
 * @returns The time behind, or a dash for a result that is not ranked.
 */
export function behindText(result: ProcessedRunnerResultModel): string {
  return isRankedResult(result) ? parseTimeBehind(result.time_behind) : EMPTY_VALUE
}

/**
 * Number of runners of a class that finished with an OK status, shown after the position as
 * "3 / 14". Runners still racing or with any other status are left out, since they hold no position.
 *
 * @param classRunners Every runner of the class, or `null` while they are not known.
 * @returns How many of them finished OK, or `null` when the list is not known.
 */
export function classSize(classRunners: readonly ProcessedRunnerModel[] | null): number | null {
  return classRunners ? classRunners.filter((runner) => hasFinishedOk(runner.stage)).length : null
}

/**
 * Whether a result is finished with an OK status, so it counts towards the class size.
 *
 * @param result The runner's result.
 * @returns `true` when the status is OK and there is a finish time.
 */
function hasFinishedOk(result: ProcessedRunnerResultModel): boolean {
  return isRankedResult(result) && result.finish_time !== null
}

/**
 * Whether a split or cumulative time was the fastest of the class at that control, which the
 * ticket marks in bold.
 *
 * @param position Position at that control; `null` when unknown.
 * @returns `true` only for the first position.
 */
export function isBestPosition(position: number | null): boolean {
  return position === BEST_POSITION
}

/**
 * Whether a punching order is the finish, which the processing appends as the last split.
 *
 * @param orderNumber Punched order of a split; `null` for an unexpected control.
 * @returns `true` only for the finish.
 */
export function isFinishOrder(orderNumber: number | bigint | null): boolean {
  return orderNumber === FINISH_ORDER_NUMBER
}

/**
 * Whether a split is a control the runner was expected to punch but did not.
 *
 * @param split Split to check. The finish is never a missed control.
 * @returns `true` when the control has no punch reading.
 */
export function isMissedSplit(split: ProcessedSplitModel): boolean {
  return split.reading_time === null && !isFinishOrder(split.order_number)
}

/**
 * Whether a result is ranked: it has a valid time and a position in the class.
 *
 * @param result The runner's result.
 * @returns `true` for a correct result, `false` for every other status (not competitive included).
 */
export function isRankedResult(result: ProcessedRunnerResultModel): boolean {
  return resultStatus(result) === RESULT_STATUS_TEXT.ok
}

/**
 * Whether a status voids a time the runner did run, so the ticket shows it struck through.
 *
 * @param status Status text, as returned by `parseResultStatus`.
 * @returns `true` for a mispunch, disqualification, retirement or overtime.
 */
export function isTimeInvalidated(status: string): boolean {
  return INVALIDATED_TIME_STATUSES.includes(status)
}

/**
 * Status text of a result.
 *
 * @param result The runner's result.
 * @returns One of `RESULT_STATUS_TEXT`, e.g. `mp` for a mispunch.
 */
export function resultStatus(result: ProcessedRunnerResultModel): string {
  return parseResultStatus(result.status_code as string)
}

/**
 * Time behind the leader and position at a control, written after the time as "+0:08 (4)".
 *
 * @param timeBehind Seconds behind the fastest runner; `null` when unknown.
 * @param position Position at that control; `null` when unknown.
 * @returns The text, or `null` when either value is unknown, so only the time is shown.
 */
export function splitStandingText(timeBehind: number | null, position: number | null) {
  if (timeBehind === null || position === null) return null
  return `${parseTimeBehind(timeBehind)} (${position})`
}

/**
 * Colour of the chip that shows a result status.
 *
 * @param status Status text, as returned by `parseResultStatus`.
 * @returns Red for a mispunch, neutral grey for every other status.
 */
export function statusChipVariant(status: string): StatusChipVariant {
  return status === RESULT_STATUS_TEXT.mp ? STATUS_CHIP_VARIANT.Error : STATUS_CHIP_VARIANT.Neutral
}

/**
 * Translation key of the full name of a status, such as "Did not start".
 *
 * @param status Status text, as returned by `parseResultStatus`.
 * @returns The key under `ResultsStage.VirtualTicket.Status`.
 */
export function statusLabelKey(status: string): string {
  return `ResultsStage.VirtualTicket.Status.${status}`
}

/**
 * Time of day of a punch, start or finish, such as "10:32:00".
 *
 * @param isoDateTime ISO date-time string; `null` when unknown.
 * @returns The time, or a dash when unknown.
 */
export function timeOfDayText(isoDateTime: string | null): string {
  return parseStartTime(isoDateTime) ?? EMPTY_VALUE
}

/**
 * Names of the members of a team, written on one line under the team's name.
 *
 * @param team The team.
 * @returns The names joined by a middle dot, or `null` for a runner without team members.
 */
export function teamMemberNames(team: ProcessedRunnerModel): string | null {
  if (!team.runners || team.runners.length === 0) return null
  return team.runners.map((member) => member.full_name).join(TEAM_MEMBER_SEPARATOR)
}

/**
 * Race time of a result that is not ranked, shown next to its status (struck through when the
 * status voided it).
 *
 * @param result The runner's result.
 * @returns The time, or `null` when the runner has no time to show.
 */
export function unrankedTimeText(result: ProcessedRunnerResultModel): string | null {
  return result.finish_time && result.time_seconds > 0
    ? parseSecondsToMMSS(result.time_seconds)
    : null
}
