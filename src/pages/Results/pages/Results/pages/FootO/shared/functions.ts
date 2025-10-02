import { DateTime } from "luxon"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  conditionalCompare,
  multiLevelCompare,
} from "../../../../../shared/sortingFunctions/sortRunners.ts"
import { RunnerModel } from "../../../../../../../shared/EntityTypes.ts"
import compareFunctions from "../../../../../shared/sortingFunctions/compareFunctions.ts"

function compareIfBothHaveFinished(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  return multiLevelCompare(a, b, [
    compareFunctions.byStagePosition,
    (a, b) => compareFunctions.byStartTime(a, b, false),
    compareFunctions.byTime,
  ])
}

function compareIfBothHaveNotFinished(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now: DateTime<true>,
): number {
  return conditionalCompare(
    a,
    b,
    (a, b) => compareFunctions.haveBothStarted(a, b, now),
    (a, b) => compareIfBothHaveStarted(a, b, now),
    (a, b) => compareIfBothHaveNotStarted(a, b, now),
  )
}

function compareIfBothHaveStarted(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now: DateTime<true>,
): number {
  return multiLevelCompare(a, b, [
    (a, b) => compareFunctions.byControlRunningTowards(a, b, now),
    compareFunctions.byLastCommonOnlineControl,
    compareFunctions.byFinishedStatus,
    (a, b) => compareFunctions.byStartTime(a, b, false),
  ])
}

function compareIfBothHaveNotStarted(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now: DateTime<true>,
): number {
  return multiLevelCompare(a, b, [
    (a, b) => compareFunctions.byStartedStatus(a, b, now),
    compareFunctions.byStartTime,
  ])
}

export function sortFootORunners(
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
          (a, b) => compareIfBothHaveNotFinished(a, b, now),
        ),
      compareFunctions.byName,
    ])
  })
}
