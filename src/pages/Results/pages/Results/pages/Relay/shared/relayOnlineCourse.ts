import { DateTime } from "luxon"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import {
  ProcessedRunnerModel,
  ProcessedTeamRunnerModel,
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import bestOnlineCumulativeSeconds from "../../FootO/pages/Results/shared/onlineCourse/bestOnlineCumulativeSeconds.ts"
import buildOnlineCourse from "../../FootO/pages/Results/shared/onlineCourse/buildOnlineCourse.ts"
import hasOnlineControls from "../../FootO/pages/Results/shared/onlineCourse/hasOnlineControls.ts"
import { OnlineCourse } from "../../FootO/pages/Results/shared/onlineCourse/onlineCourse.ts"
import { liveRelayTime } from "./functions.ts"
import { legAsRunner, legNumbersOf, legRunnersOf } from "./relayLegs.ts"

const NO_PREVIOUS_LEGS_SECONDS = 0

/**
 * Computes, for every leg of a relay, the best leg time at each of its online splits, so each leg
 * runner's online course shows how far behind the fastest runner of the same leg they are.
 *
 * @param teams Teams of the relay.
 * @returns The best time in seconds at every online split, finish included, by leg number.
 */
export function bestOnlineCumulativeSecondsByLeg(
  teams: ProcessedRunnerModel[],
): ReadonlyMap<number, (number | null)[]> {
  return new Map(
    legNumbersOf(teams).map((legNumber) => [
      legNumber,
      bestOnlineCumulativeSeconds(legRunnersOf(teams, legNumber)),
    ]),
  )
}

/**
 * Builds the online course of a leg runner, whether they are out on the course or finished.
 *
 * @param legRunner Runner of the leg, seen as a runner of the team's class.
 * @param bestCumulativeSeconds Best leg time at every online split of this leg, or `null` when
 * there is nothing to compare with, as in club view.
 * @param now The current moment.
 * @returns The course of the leg, or `null` when the leg has no online controls.
 */
export function buildLegOnlineCourse(
  legRunner: ProcessedRunnerModel,
  bestCumulativeSeconds: ReadonlyArray<number | null> | null,
  now: DateTime<true>,
): OnlineCourse | null {
  if (!hasOnlineControls(legRunner)) return null
  return buildOnlineCourse(
    legRunner,
    bestCumulativeSeconds,
    runnerService.hasStarted(legRunner, now),
  )
}

/**
 * Builds the online course drawn under a leg of a team's result row. Only the leg being run gets
 * one, so a team row shows where its runner is now and not the course of every leg.
 *
 * @param team Relay team.
 * @param leg Runner of the leg.
 * @param bestCumulativeSeconds Best leg time at every online split of this leg, or `null` when
 * there is nothing to compare with, as in club view.
 * @param now The current moment.
 * @returns The course of the leg, or `null` when the leg is not being run or has no online
 * controls.
 */
export function buildRunningLegOnlineCourse(
  team: ProcessedRunnerModel,
  leg: ProcessedTeamRunnerModel,
  bestCumulativeSeconds: ReadonlyArray<number | null> | null,
  now: DateTime<true>,
): OnlineCourse | null {
  const legRunner = legAsRunner(team, leg)
  return isLegOnCourse(legRunner, now)
    ? buildLegOnlineCourse(legRunner, bestCumulativeSeconds, now)
    : null
}

/**
 * Tells whether a leg has punched any online control, which shows the leg is being run even when
 * its start is not known yet, as before the previous leg's finish is read.
 *
 * @param legRunner Runner of the leg, seen as a runner of the team's class.
 * @returns `true` when one of its online splits has a punch time.
 */
function hasOnlineReading(legRunner: ProcessedRunnerModel): boolean {
  return (legRunner.stage.online_splits ?? []).some((split) => split.reading_time !== null)
}

/**
 * Tells whether a leg runner is out on the course: started, or seen at an online control, and not
 * finished yet.
 *
 * @param legRunner Runner of the leg, seen as a runner of the team's class.
 * @param now The current moment.
 * @returns `true` while the leg is being run.
 */
export function isLegOnCourse(legRunner: ProcessedRunnerModel, now: DateTime<true>): boolean {
  const isOut = runnerService.hasStarted(legRunner, now) || hasOnlineReading(legRunner)
  return isOut && !runnerService.hasFinished(legRunner)
}

/**
 * Finds the online split a leg runner is heading to: the one after the last they have punched.
 *
 * @param leg Runner of the leg.
 * @returns The index of the online split, `0` when the leg has punched none, and the number of
 * online splits once the finish is read.
 */
export function nextOnlineSplitIndex(leg: ProcessedTeamRunnerModel): number {
  const splits = leg.stage.online_splits ?? []
  const hasReadings = splits.map(
    (split) => split.cumulative_time !== null || split.reading_time !== null,
  )
  return hasReadings.lastIndexOf(true) + 1
}

/**
 * Computes the team time at one online split of a leg: the time of the previous legs, as the team
 * time counts it, plus the leg time at the split.
 *
 * @param team Relay team.
 * @param leg Runner of the leg.
 * @param splitIndex Position of the online split in the leg's course.
 * @returns The team time in seconds, or `null` when the leg has no time at the split or a previous
 * leg has no time.
 * @throws MissingTeamMembersError When the team has no members.
 */
export function teamSecondsAtOnlineSplit(
  team: ProcessedRunnerModel,
  leg: ProcessedTeamRunnerModel,
  splitIndex: number,
): number | null {
  const legSeconds = leg.stage.online_splits?.[splitIndex]?.cumulative_time ?? null
  const previousLegCount = leg.leg_number - 1
  const previousLegsSeconds =
    previousLegCount > 0
      ? liveRelayTime(team, undefined, previousLegCount)
      : NO_PREVIOUS_LEGS_SECONDS
  if (legSeconds === null || previousLegsSeconds === null) return null

  return previousLegsSeconds + legSeconds
}
