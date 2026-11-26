import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

/**
 * Whether the results of a totals class or club do not come from a totals stage: some runner has
 * no overall result. That is what the upload of a single race to a totals stage looks like, and
 * the totals cannot be shown from it.
 *
 * @param runners The runners of the class or club; an empty list is not flagged.
 * @returns `true` when the organizer needs to upload totals results instead.
 */
export function isNonTotalsData(runners: ProcessedRunnerModel[]): boolean {
  return runners.some(hasNoOverall)
}

/**
 * Whether a runner lacks the overall result of the totals.
 *
 * @param runner The runner; `overalls` may be `null`.
 * @returns `true` when the runner has no overall result.
 */
function hasNoOverall(runner: ProcessedRunnerModel): boolean {
  return !runner.overalls?.overall
}
