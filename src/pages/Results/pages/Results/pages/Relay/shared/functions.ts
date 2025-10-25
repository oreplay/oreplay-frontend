import {
  ProcessedParticipantModel,
  ProcessedRunnerModel,
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { DateTime } from "luxon"
import {
  conditionalCompare,
  multiLevelCompare,
} from "../../../../../shared/sortingFunctions/sortRunners.ts"
import compareFunctions from "../../../../../shared/sortingFunctions/compareFunctions.ts"
import { ParticipantModel } from "../../../../../../../shared/EntityTypes.ts"
import { relayCompareFunctions } from "./relayCompareFunctions.ts"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"

function compareIfBothHaveFinished(a: ProcessedRunnerModel, b: ProcessedRunnerModel): number {
  return multiLevelCompare(a, b, [
    compareFunctions.byStagePosition,
    compareFunctions.byTime,
    compareFunctions.byNC,
  ])
}

function compareIfNotBothHaveFinished(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now?: DateTime<true>,
): number {
  return conditionalCompare(
    a,
    b,
    (a, b) => compareFunctions.haveBothStarted(a, b, now),
    (a, b) => compareIfBothHaveStarted(a, b, now),
    compareIfNotBothHaveStarted,
  )
}

function compareIfBothHaveStarted(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now?: DateTime<true>,
): number {
  return multiLevelCompare(a, b, [
    (a, b) => relayCompareFunctions.byLiveRelayTime(a, b, now),
    relayCompareFunctions.byLastCommonLegTime,
    compareFunctions.byFinishedStatus,
    (a, b) => compareFunctions.byStartTime(a, b, false),
  ])
}

function compareIfNotBothHaveStarted(a: ProcessedRunnerModel, b: ProcessedRunnerModel): number {
  return multiLevelCompare(a, b, [compareFunctions.byStartedStatus, compareFunctions.byStartTime])
}

export function sortRelayRunners(
  runners: ProcessedRunnerModel[],
  now?: DateTime<true>,
): ProcessedRunnerModel[] {
  now = now ? now : DateTime.now()

  return runners.sort((a, b) => {
    return multiLevelCompare(a, b, [
      compareFunctions.byStageStatus,
      (a, b) =>
        conditionalCompare(
          a,
          b,
          compareFunctions.haveBothFinished,
          compareIfBothHaveFinished,
          (a, b) => compareIfNotBothHaveFinished(a, b, now),
        ),
      compareFunctions.byName,
    ])
  })
}

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
