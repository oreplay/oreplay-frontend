import {
  ProcessedRunnerResultModel,
  ProcessedSplitModel,
} from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { formatScoreAsInteger } from "../../../../../../../../../shared/Functions.tsx"

export const ROGAINE_TICKET_TAB = { Controls: "controls", Splits: "splits" } as const
export type RogaineTicketTab = (typeof ROGAINE_TICKET_TAB)[keyof typeof ROGAINE_TICKET_TAB]

/**
 * Bonus and penalty points of a rogaine result, written "+40 / -20".
 *
 * @param result The team's result.
 * @returns The text, or an empty string while the team has neither points nor a finish.
 */
export function bonusPenaltyText(result: ProcessedRunnerResultModel): string {
  if (!hasScore(result)) return ""
  return `+${formatScoreAsInteger(result.points_bonus)} / ${formatScoreAsInteger(result.points_penalty)}`
}

/**
 * Whether a rogaine result has figures worth showing: final points or a finish.
 *
 * @param result The team's result.
 * @returns `false` while the team has neither, so its points read empty instead of zero.
 */
export function hasScore(result: ProcessedRunnerResultModel): boolean {
  return !!result.points_final || !!result.finish_time
}

/**
 * Final points of a rogaine result.
 *
 * @param result The team's result.
 * @returns The points, or an empty string while the team has neither points nor a finish.
 */
export function pointsText(result: ProcessedRunnerResultModel): string {
  return hasScore(result) ? formatScoreAsInteger(result.points_final) : ""
}

/**
 * Codes of the controls a team punched.
 *
 * @param splits The team's splits; `null` when it has none.
 * @returns The station of every split that has one, in punching order.
 */
export function punchedControls(splits: ProcessedSplitModel[] | null): bigint[] {
  return (splits ?? [])
    .map((split) => split.control?.station)
    .filter((station) => !!station)
    .map((station) => BigInt(station as string))
}

/**
 * Element id of a panel of the rogaine ticket, so its tab can point at it.
 *
 * @param tab The tab that shows the panel.
 * @returns An id unique on the page.
 */
export function rogaineTicketPanelId(tab: RogaineTicketTab): string {
  return `rogaine-ticket-panel-${tab}`
}

/**
 * Element id of a tab of the rogaine ticket, so its panel can be labelled by it.
 *
 * @param tab The tab.
 * @returns An id unique on the page.
 */
export function rogaineTicketTabId(tab: RogaineTicketTab): string {
  return `rogaine-ticket-tab-${tab}`
}
