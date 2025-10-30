import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  conditionalCompare,
  multiLevelCompare,
} from "../../../../../shared/sortingFunctions/sortRunners.ts"
import compareFunctions from "../../../../../shared/sortingFunctions/compareFunctions.ts"
import { DateTime } from "luxon"
import { relayCompareFunctions } from "./relayCompareFunctions.ts"

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
    (a, b) =>
      conditionalCompare(
        a,
        b,
        (a, b) => relayCompareFunctions.isSameLegRunning(a, b, now),
        compareIfSameLegIsRunning,
        compareIfNotSameLegIsRunning,
      ),
  ])
}

function compareIfNotBothHaveStarted(a: ProcessedRunnerModel, b: ProcessedRunnerModel): number {
  return multiLevelCompare(a, b, [compareFunctions.byStartedStatus, compareFunctions.byStartTime])
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function compareIfSameLegIsRunning(_a: ProcessedRunnerModel, _b: ProcessedRunnerModel): number {
  // TODO: Implement. This make online controls work

  return 0
}

function compareIfNotSameLegIsRunning(a: ProcessedRunnerModel, b: ProcessedRunnerModel): number {
  return multiLevelCompare(a, b, [
    relayCompareFunctions.byLastCommonLegTime,
    compareFunctions.byFinishedStatus,
    (a, b) => compareFunctions.byStartTime(a, b, false),
  ])
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

