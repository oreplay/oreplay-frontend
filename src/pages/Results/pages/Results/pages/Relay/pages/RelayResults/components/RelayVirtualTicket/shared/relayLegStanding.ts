import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../../../../../../../../shared/constants.ts"
import { computeTeamStatus, liveRelayTime } from "../../../../../shared/functions.ts"
import { EMPTY_VALUE } from "../../../../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"
import {
  parseSecondsToMMSS,
  parseTimeBehind,
} from "../../../../../../../../../../../shared/Functions.tsx"

/**
 * How far a relay team is behind the fastest team of its class at the end of a leg.
 *
 * @param team The team.
 * @param classTeams Every team of the class; `null` while unknown.
 * @param leg Leg number, starting at one.
 * @returns Seconds behind, or `null` while the class is unknown or the team has not finished that
 * leg correctly.
 */
export function behindAtLeg(
  team: ProcessedRunnerModel,
  classTeams: ProcessedRunnerModel[] | null,
  leg: number,
): number | null {
  if (!classTeams || !hasFinishedLegCorrectly(team, leg)) return null

  const ownTime = teamTimeAtLeg(team, leg)
  const finishedTimes = classTeams
    .filter((classTeam) => hasFinishedLegCorrectly(classTeam, leg))
    .map((classTeam) => teamTimeAtLeg(classTeam, leg))
    .filter((time): time is number => time !== null)
  if (ownTime === null || finishedTimes.length === 0) return null

  return ownTime - Math.min(...finishedTimes)
}

/**
 * Whether every leg of a team up to the given one has finished with a correct result.
 *
 * @param team The team.
 * @param leg Leg number, starting at one.
 * @returns `false` for a team without that leg.
 */
export function hasFinishedLegCorrectly(team: ProcessedRunnerModel, leg: number): boolean {
  const legs = team.runners?.slice(0, leg)
  if (!legs || legs.length < leg) return false

  const allFinished = legs.every((member) => !!member.stage.finish_time)
  return allFinished && computeTeamStatus(team, leg) === RESULT_STATUS.ok
}

/**
 * Gap of a relay team to the fastest team of its class at the end of a leg, such as "+04:15".
 *
 * @param team The team.
 * @param classTeams Every team of the class; `null` while unknown.
 * @param leg Leg number, starting at one.
 * @returns The gap, or a dash while it is unknown.
 */
export function legBehindText(
  team: ProcessedRunnerModel,
  classTeams: ProcessedRunnerModel[] | null,
  leg: number,
): string {
  const behind = behindAtLeg(team, classTeams, leg)
  return behind === null ? EMPTY_VALUE : parseTimeBehind(behind)
}

/**
 * Time of a relay team at the end of a leg, such as "1:12:40".
 *
 * @param team The team.
 * @param leg Leg number, starting at one.
 * @returns The time, or a dash while the team has not reached that leg.
 */
export function legTeamTimeText(team: ProcessedRunnerModel, leg: number): string {
  const time = teamTimeAtLeg(team, leg)
  return time === null ? EMPTY_VALUE : parseSecondsToMMSS(time)
}

/**
 * Time of a relay team at the end of a leg, live while that leg is still running.
 *
 * @param team The team.
 * @param leg Leg number, starting at one.
 * @returns Seconds since the team's start, or `null` for a team without that leg or that has not
 * reached it.
 */
export function teamTimeAtLeg(team: ProcessedRunnerModel, leg: number): number | null {
  if (!team.runners || team.runners.length < leg) return null
  return liveRelayTime(team, undefined, leg)
}
