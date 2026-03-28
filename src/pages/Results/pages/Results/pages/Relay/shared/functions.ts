import {
  ProcessedParticipantModel,
  ProcessedRunnerModel,
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { DateTime } from "luxon"
import { ParticipantModel, RunnerModel } from "../../../../../../../shared/EntityTypes.ts"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import { maxBy } from "../../../../../../../utils/generalFunctions.ts"
import { RESULT_STATUS } from "../../../../../shared/constants.ts"

/**
 * Calculates the elapsed time (in seconds) for a participant in a stage.
 *
 * The function behaves as follows:
 * - If the participant has no `start_time`, it returns `null`.
 * - If the participant has a `finish_time`:
 *   - Returns `stage.time_seconds` if available.
 *   - Otherwise, computes the difference between `finish_time` and `start_time`.
 * - If the participant has started but not finished:
 *   - Computes the live elapsed time from `start_time` to `now`.
 *   - Uses the current time if `now` is not provided.
 * - Returns `null` if the current time is before the participant's start time.
 * @param runner Participant we want to compute time
 * @param now Current datetime. If not provided it is computed
 */
function liveParticipantTime(
  runner: ParticipantModel | ProcessedParticipantModel,
  now?: DateTime<true>,
): number | null {
  // Check if it has start time
  if (runner.stage.start_time == null) {
    return null
  }

  const runnerStart = DateTime.fromISO(runner.stage.start_time)

  // Check if it has finish time
  if (runner.stage.finish_time) {
    if (runner.stage.time_seconds !== null) {
      return runner.stage.time_seconds
    }
    const runnerFinish = DateTime.fromISO(runner.stage.finish_time)

    return runnerFinish.diff(runnerStart).as("seconds")
  }

  // It has start time but no finish time
  now = now ? now : DateTime.now()

  if (now >= runnerStart) {
    return now.diff(runnerStart).as("seconds")
  }
  return null
}

/**
 * Compute the time of a Relay team considering 2nd start
 *
 * If the relay time cannot be computed, then it returns `null`
 *
 * @param runner Team
 * @param now When we want to know the team's time
 * @param maxLeg Time for the first n legs (non-inclusive) maxLeg=2 mean only first leg
 */
export function liveRelayTime(
  runner: ProcessedRunnerModel,
  now?: DateTime<true>,
  maxLeg?: number,
): number | null {
  // If the team already has time, use that time
  if (maxLeg == undefined && runner.stage.time_seconds) {
    return runner.stage.time_seconds
  }

  // Sanitize
  if (!runner.runners || runner.runners.length == 0) {
    throw new Error("A relay runner is expected to have team members")
  }

  // Compute time
  let teamTime: number = 0
  let shouldReturn: boolean = false
  let legTime: number | null

  maxLeg = maxLeg !== undefined ? maxLeg : runner.runners.length
  for (let index = 0; index < maxLeg; index++) {
    legTime = liveParticipantTime(runner.runners[index], now)

    if (legTime !== null) {
      teamTime = teamTime + legTime
      shouldReturn = true
    }
  }

  // Return
  if (shouldReturn) {
    return teamTime
  } else {
    return null
  }
}

/**
 * Find the last leg that has finished. Index is returned
 * @param legsList
 */
export function findLastFinishedRelayLeg(legsList: ProcessedParticipantModel[]) {
  for (let leg = legsList.length - 1; leg >= 0; leg--) {
    if (runnerService.hasFinished(legsList[leg])) {
      return leg
    }
  }
  return -1
}

export function findLegsNumberRunning(
  runner: ProcessedRunnerModel,
  now?: DateTime<true>,
): number[] {
  now = now ? now : DateTime.now()

  // Sanitize
  if (!runner.runners || runner.runners.length == 0) {
    throw new Error("A relay runner is expected to have team members")
  }

  const legsRunning = runner.runners.filter(
    (leg) =>
      leg.stage.start_time !== null &&
      leg.stage.finish_time === null &&
      DateTime.fromISO(leg.stage.start_time) <= now,
  )

  return legsRunning.map((leg) => leg.leg_number)
}

export function computeTeamStatus(
  runner: ProcessedRunnerModel | RunnerModel,
  maxLeg?: number,
): string | null {
  const runnersOfInterest = runner.runners?.slice(0, maxLeg)
  if (!runnersOfInterest) {
    throw new Error(`The relay team runner has no team members. (maxLeg=${maxLeg})`)
  }

  const statuses = runnersOfInterest.map((runner) => runner.stage.status_code)
  if (statuses.includes(null)) {
    return null
  }

  // @ts-expect-error statuses becomes string[], this code is unreachable if null in statuses
  return maxBy(statuses, statusKey)
}

function statusKey(status: string) {
  switch (status) {
    case RESULT_STATUS.ok:
      return 0
    case RESULT_STATUS.ot:
      return 1
    case RESULT_STATUS.mp:
      return 2
    case RESULT_STATUS.dnf:
      return 3
    case RESULT_STATUS.dsq:
      return 4
    case RESULT_STATUS.dns:
      return 5
    case RESULT_STATUS.nc:
      return 6
    default:
      throw new Error(`Unknown status: ${status}`)
  }
}
