import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

/**
 * Whether the results of a relay class or club do not come from a relay: no team has any leg
 * runner, yet some of them have raced. That is what the upload of an individual race to a relay
 * stage looks like, and the relay results cannot be computed from it.
 *
 * A list of vacant teams only, such as the club that groups the vacant entries, is still relay
 * data: those teams have no members either, but none of them has a start or finish time.
 *
 * @param teams The teams of the class or club; an empty list is not flagged.
 * @returns `true` when the organizer needs to upload relay results instead.
 */
export function isNonRelayData(teams: ProcessedRunnerModel[]): boolean {
  return teams.every(hasNoMembers) && teams.some(hasRaced)
}

/**
 * Whether a team has no leg runner.
 *
 * @param team The team; `runners` may be `null`, `undefined` or empty.
 * @returns `true` when the team has no members.
 */
function hasNoMembers(team: ProcessedRunnerModel): boolean {
  return !team.runners || team.runners.length === 0
}

/**
 * Whether a team has a start or a finish time of its own.
 *
 * @param team The team.
 * @returns `true` when the team has started or finished.
 */
function hasRaced(team: ProcessedRunnerModel): boolean {
  return team.stage.start_time !== null || team.stage.finish_time !== null
}
