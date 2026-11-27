import {
  ProcessedRunnerModel,
  ProcessedTeamRunnerModel,
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"

/**
 * Finds the runner of one leg of a team.
 *
 * @param team Relay team.
 * @param legNumber Number of the leg, from 1.
 * @returns The leg's runner, or `undefined` when the team has no runner for that leg.
 */
export function findLeg(
  team: ProcessedRunnerModel,
  legNumber: number,
): ProcessedTeamRunnerModel | undefined {
  return team.runners?.find((leg) => leg.leg_number === legNumber)
}

/**
 * Sees the runner of a leg as a runner of the team's class, since a leg has no class of its own.
 * That lets the individual results helpers (online course, best times, sorting) work on one leg.
 *
 * @param team Team the leg belongs to.
 * @param leg Runner of the leg.
 * @returns The leg's runner, with the team's class and no team members.
 */
export function legAsRunner(
  team: ProcessedRunnerModel,
  leg: ProcessedTeamRunnerModel,
): ProcessedRunnerModel {
  return { ...leg, class: team.class, runners: null }
}

/**
 * Lists the legs of a relay, from the team with the most legs.
 *
 * @param teams Teams of the relay.
 * @returns The leg numbers, from 1; empty when no team has runners.
 */
export function legNumbersOf(teams: ProcessedRunnerModel[]): number[] {
  const legCount = Math.max(0, ...teams.map((team) => team.runners?.length ?? 0))
  return Array.from({ length: legCount }, (_, index) => index + 1)
}

/**
 * Collects the runners of one leg across every team, each seen as a runner of its team's class.
 *
 * @param teams Teams of the relay.
 * @param legNumber Number of the leg, from 1.
 * @returns One runner per team that has that leg.
 */
export function legRunnersOf(teams: ProcessedRunnerModel[], legNumber: number) {
  return teams.flatMap((team) => {
    const leg = findLeg(team, legNumber)
    return leg ? [legAsRunner(team, leg)] : []
  })
}

/**
 * Maps the runners of one leg to the name of their team, to show it under each runner.
 *
 * @param teams Teams of the relay.
 * @param legNumber Number of the leg, from 1.
 * @returns The team name by the id of the leg's runner.
 */
export function teamNamesByLegRunnerId(
  teams: ProcessedRunnerModel[],
  legNumber: number,
): ReadonlyMap<string, string> {
  return new Map(
    teams.flatMap((team) => {
      const leg = findLeg(team, legNumber)
      return leg ? [[leg.id, team.full_name] as const] : []
    }),
  )
}
