import { runnerService } from "../../../../../domain/services/RunnerService.ts"
import { ProcessedRunnerModel } from "../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS_TEXT } from "../../../shared/constants.ts"
import { parseResultStatus } from "../../../shared/sortingFunctions/sortRunners.ts"

export const RACE_POSITION_DISPLAYS = ["nc", "notOk", "pending", "position"] as const
export type RacePositionDisplay = (typeof RACE_POSITION_DISPLAYS)[number]

export const RACE_POSITION_PENDING_LABEL = "-"

export const RACE_POSITION_SLOT_MIN_WIDTH = "2.5ch"

export interface RacePosition {
  position: number | bigint | null
  statusCode: string | null
  isNC: boolean
}

const NOT_OK_STATUSES: readonly string[] = [
  RESULT_STATUS_TEXT.dnf,
  RESULT_STATUS_TEXT.dns,
  RESULT_STATUS_TEXT.dsq,
  RESULT_STATUS_TEXT.mp,
  RESULT_STATUS_TEXT.ot,
]

/**
 * Picks the horizontal alignment of the position slot's content: the dash and the cross are
 * symbols, so they sit centred in the slot, while numbers and "NC" are right-aligned so their dots
 * and last letters line up across rows.
 * @param display What the slot shows.
 * @returns A CSS `text-align` value.
 */
export function getRacePositionAlign(display: RacePositionDisplay): "center" | "end" {
  if (display === "notOk" || display === "pending") return "center"
  return "end"
}

/**
 * Picks the theme colour of the position slot: primary for "NC" and final positions, a dim grey
 * for the not-ok cross so it recedes, and secondary grey for provisional positions and the dash.
 * @param display What the slot shows.
 * @param hasDownload Whether the chip was downloaded, i.e. the result is final.
 * @returns An MUI palette path usable in `sx.color`.
 */
export function getRacePositionColor(
  display: RacePositionDisplay,
  hasDownload: boolean | undefined,
): string {
  if (display === "nc" || (display === "position" && hasDownload)) return "primary.main"
  if (display === "notOk") return "text.disabled"
  return "text.secondary"
}

/**
 * Picks what the position slot of a result row shows. A not-competitive runner shows "NC", a
 * runner whose status is known to be wrong (DNS, DNF, MP, DSQ, OT) shows a cross, a runner with a
 * position shows it, and everybody else (still running, not yet classified) shows a dash.
 * @param position Position in the classification; `null`, `0` or missing means not yet available.
 * @param statusCode Result status, either as the numeric API code (`"3"`) or its text (`"mp"`);
 * `null`/`undefined` means the status is not known yet.
 * @param isNC Whether the runner takes part out of competition.
 * @returns The kind of content the position slot must render.
 */
export function getRacePositionDisplay(
  position: number | bigint | null | undefined,
  statusCode: string | null | undefined,
  isNC: boolean | undefined,
): RacePositionDisplay {
  if (isNC) return "nc"
  if (isNotOkStatus(statusCode)) return "notOk"
  if (position) return "position"
  return "pending"
}

/**
 * Reads what a result row's position slot needs from a runner: the overall position and status on
 * multi-stage totals, the stage ones otherwise.
 * @param runner Runner shown in the row.
 * @returns Position, status code and not-competitive flag of the runner.
 */
export function getRunnerRacePosition(runner: ProcessedRunnerModel): RacePosition {
  const result = runner.overalls ? runner.overalls.overall : runner.stage
  return {
    position: result.position,
    statusCode: result.status_code,
    isNC: runnerService.isNC(runner),
  }
}

/**
 * Normalises a result status to its text form, accepting either the numeric API code or the text.
 * @param statusCode Numeric API code (`"3"`) or status text (`"mp"`); `null`/`undefined` stays so.
 * @returns The status text (`"mp"`), the input unchanged when unrecognised, or `null` when unknown.
 */
export function toResultStatusText(statusCode: string | null | undefined): string | null {
  if (statusCode == null) return null
  const statusTexts: readonly string[] = Object.values(RESULT_STATUS_TEXT)
  if (statusTexts.includes(statusCode)) return statusCode
  return parseResultStatus(statusCode)
}

/**
 * Tells whether a result status is known to be a non-valid result.
 * @param statusCode Numeric API code or status text; `null`/`undefined` is never not-ok.
 * @returns `true` for DNS, DNF, MP, DSQ and OT.
 */
function isNotOkStatus(statusCode: string | null | undefined): boolean {
  const statusText = toResultStatusText(statusCode)
  return statusText != null && NOT_OK_STATUSES.includes(statusText)
}
