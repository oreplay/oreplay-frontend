import {
  ProcessedParticipantModel,
  ProcessedRunnerModel,
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { DateTime } from "luxon"
import { ParticipantModel } from "../../../../../../../shared/EntityTypes.ts"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"

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

export function liveRelayTime(
  runner: ProcessedRunnerModel,
  now?: DateTime<true>,
  maxLeg?: number,
): number | null {
  // If the team already has time, use that time
  if (runner.stage.time_seconds !== null) {
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

  maxLeg = maxLeg !== undefined ? maxLeg - 1 : runner.runners.length - 1
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
