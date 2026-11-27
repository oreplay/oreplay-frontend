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
import { legAsRunner, legNumbersOf, legRunnersOf } from "./relayLegs.ts"

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
 * Tells whether a leg runner is out on the course: started and not finished yet.
 *
 * @param legRunner Runner of the leg, seen as a runner of the team's class.
 * @param now The current moment.
 * @returns `true` while the leg is being run.
 */
export function isLegOnCourse(legRunner: ProcessedRunnerModel, now: DateTime<true>): boolean {
  return runnerService.hasStarted(legRunner, now) && !runnerService.hasFinished(legRunner)
}

/**
 * Computes the team time at one online split of a leg: the time from the team's start to the start
 * of the leg, plus the leg time at the split.
 *
 * @param team Relay team.
 * @param leg Runner of the leg.
 * @param splitIndex Position of the online split in the leg's course.
 * @returns The team time in seconds, or `null` when the leg has no reading there or the team or
 * the leg has no start time.
 */
export function teamSecondsAtOnlineSplit(
  team: ProcessedRunnerModel,
  leg: ProcessedTeamRunnerModel,
  splitIndex: number,
): number | null {
  const legSeconds = leg.stage.online_splits?.[splitIndex]?.cumulative_time ?? null
  const teamStart = team.stage.start_time
  const legStart = leg.stage.start_time
  if (legSeconds === null || !teamStart || !legStart) return null

  const secondsToLegStart = DateTime.fromISO(legStart)
    .diff(DateTime.fromISO(teamStart))
    .as("seconds")
  return secondsToLegStart + legSeconds
}
