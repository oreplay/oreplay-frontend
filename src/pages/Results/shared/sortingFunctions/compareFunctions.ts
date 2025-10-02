import { RunnerModel } from "../../../../shared/EntityTypes.ts"
import {
  ProcessedRunnerModel,
  RadioSplitModel,
} from "../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../constants.ts"
import { runnerService } from "../../../../domain/services/RunnerService.ts"
import { DateTime } from "luxon"

/**
 * This helper functions assigns each status code a number with the priority it should appear on result
 * @param status A valid RUNNER_STATUS
 */
function statusOrder(status: string | null) {
  switch (status) {
    case RESULT_STATUS.ok:
      return 0
    case RESULT_STATUS.ot:
      return 1
    case RESULT_STATUS.mp:
      return 3
    case RESULT_STATUS.nc:
      return 0
    case RESULT_STATUS.dnf:
      return 4
    case RESULT_STATUS.dsq:
      return 5
    case RESULT_STATUS.dns:
      return 6
    default:
      return 10
  }
}

function byStatus(aStatusCode: string | null, bStatusCode: string | null) {
  const statusA = statusOrder(aStatusCode)
  const statusB = statusOrder(bStatusCode)

  if (statusA !== undefined && statusB !== undefined) {
    return statusA - statusB // Smaller status comes first
  } else if (!statusA) {
    return 1
  } else {
    return -1
  }
}

function byStageStatus(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const aStatus = a.stage?.status_code
  const bStatus = b.stage?.status_code

  return byStatus(aStatus, bStatus)
}

/**
 * Helper function for sorting. Compare two runners according to their position.
 * If two runners have the same position but one is not competing, the non-competing
 * is placed at the bottom.
 * @param a First runner of the comparison
 * @param b Second runner of the comparison
 * @param isANC
 * @param isBNC
 */
function byPosition(
  a: number | null | undefined,
  b: number | null | undefined,
  isANC: boolean,
  isBNC: boolean,
): number {
  if (!!a && !!b) {
    if (a === b) {
      return byIsNC(isANC, isBNC)
    } else {
      return a - b
    }
  } else if (a) {
    return -1
  } else if (b) {
    return 1
  } else {
    return 0
  }
}

/**
 * Helper function for sorting. Compare two runners according to their position.
 * If two runners have the same position but one is not competing, the non-competing
 * is placed at the bottom
 *
 * @param a First runner of the comparison
 * @param b Second runner of the comparison
 */
function byStagePosition(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const posA = a.stage?.position
  const posB = b.stage?.position

  if (posA !== 0 && posB !== 0) {
    return byPosition(posA, posB, runnerService.isNC(a), runnerService.isNC(b))
  } else if (posA === 0 && posB === 0) {
    return 0
  } else if (posA === 0) {
    return 1
  } else if (posB === 0) {
    return -1
  } else {
    return 0
  }
}

/**
 * Helper function for sorting. Compare two runners according to their overall position.
 * If two runners have the same position but one is not competing, the non-competing
 * is placed at the bottom
 * @param a
 * @param b
 */
function byOverallPosition(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const aPosition = a.overalls?.overall.position
  const bPosition = b.overalls?.overall.position

  return byPosition(aPosition, bPosition, runnerService.isNC(a), runnerService.isNC(b))
}

/**
 * Helper function for sorting. Compare two runners according to their full name. Runners are sorted
 * in alphabetical order
 * @param a First runner of the comparison
 * @param b Second runner of the comparison
 */
function byName(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const nameA = a.full_name.toLowerCase()
  const nameB = b.full_name.toLowerCase()

  return nameA.localeCompare(nameB)
}

/**
 * Helper function for sorting. Compare two runners according to their start time
 *
 * If `ascending = true` runners are sorted by ascending start time
 * If `ascending = false` runners are sorted by descending start time
 * Runners without start time go to the end in any case
 * @param a First runner of the comparison
 * @param b Second runner of the comparison
 * @param ascending
 */
function byStartTime(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
  ascending: boolean = true,
): number {
  const startTimeA = a.stage?.start_time
  const startTimeB = b.stage?.start_time

  if (!!startTimeA && !!startTimeB) {
    return ascending ? startTimeA.localeCompare(startTimeB) : startTimeB.localeCompare(startTimeA)
  } else if (startTimeA) {
    return -1
  } else if (startTimeB) {
    return 1
  } else {
    return 0
  }
}

/**
 * Helper function for sorting. Compare two runners according to being not competing (NC). NC goes
 * to the end
 * @param isANC is the first runner in the comparison NC
 * @param isBNC is the second runner in the comparison NC
 */
function byIsNC(isANC: boolean, isBNC: boolean): number {
  if (isANC && isBNC) {
    return 0
  } else if (isANC) {
    return 1
  } else if (isBNC) {
    return -1
  } else {
    return 0
  }
}

/**
 * Extract the index of the online control the runner is running to. It returns
 * -1 if it is not running towards any online control (it has not finished or started)
 * or if no online controls are being used
 * @param splitList
 */
function extractOnlineSplitRunningTowards(splitList: RadioSplitModel[]): number {
  return splitList.findIndex((split) => split.is_next != null)
}

/**
 * Helper function for sorting. Compare two runners considering the control they are running towards
 * @param a First runner in the comparison
 * @param b Second runner in the comparison
 * @param now Actual time
 */
function byControlRunningTowards(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now: DateTime<true>,
): number {
  const onlineSplitsA = a.stage.online_splits
  const onlineSplitsB = b.stage.online_splits

  const startTimeA = a.stage.start_time ? DateTime.fromISO(a.stage.start_time) : null
  const startTimeB = b.stage.start_time ? DateTime.fromISO(b.stage.start_time) : null

  // Using online splits
  if (onlineSplitsA && onlineSplitsB && startTimeA && startTimeB) {
    const aRunningTo = extractOnlineSplitRunningTowards(onlineSplitsA)
    const bRunningTo = extractOnlineSplitRunningTowards(onlineSplitsB)

    // One of them is not running anywhere
    if (aRunningTo == -1 || bRunningTo == -1) {
      return 0
    }

    // A runs towards a control B already punched
    if (aRunningTo < bRunningTo) {
      const cumulativeTimeA = now.diff(startTimeA)
      const splitB = onlineSplitsB.at(aRunningTo)!

      if (splitB.cumulative_time) {
        if (cumulativeTimeA.as("seconds") < splitB.cumulative_time) {
          // A is doing better => we cannot compare
          return 0
        } else {
          // A is already doing worst
          return 1
        }
      }
      // B runs to a control A already punched
    } else if (aRunningTo > bRunningTo) {
      const cumulativeTimeB = now.diff(startTimeB)
      const splitA = onlineSplitsA.at(bRunningTo)!

      if (splitA.cumulative_time) {
        if (cumulativeTimeB.as("seconds") < splitA.cumulative_time) {
          // B is doing better
          return 0
        } else {
          // B is already doing worst
          return -1
        }
      }
    }
    // A and B run to the same control (they are equal)
  }

  // Not using online splits or any of the prev conditions failed
  return 0
}

function byLastCommonOnlineControl(a: ProcessedRunnerModel, b: ProcessedRunnerModel): number {
  const onlineSplitsA = a.stage.online_splits
  const onlineSplitsB = b.stage.online_splits

  if (onlineSplitsA && onlineSplitsB && onlineSplitsA.length > 0 && onlineSplitsB.length > 0) {
    for (let i = onlineSplitsA.length - 1; i >= 0; i--) {
      // Here we assume onlineSplitsA.length === onlineSplitsB.length

      const splitA = onlineSplitsA.at(i)!
      const splitB = onlineSplitsB.at(i)!

      if (splitA.cumulative_time && splitB.cumulative_time) {
        return splitA.cumulative_time - splitB.cumulative_time
      }
    }
  }

  return 0
}

/**
 * Helper function for sorting. Compare two runners considering that the finished runners goes first
 * @param a First runner in comparison
 * @param b Second runner in comparison
 */
function byFinishedStatus(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const finishedA = runnerService.hasFinished(a)
  const finishedB = runnerService.hasFinished(b)

  if (finishedA && finishedB) {
    return 0
  }
  if (finishedA) {
    return -1
  }
  if (finishedB) {
    return 1
  }
  return 0
}

function byStartedStatus(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
  now?: DateTime<true>,
): number {
  const aStarted = runnerService.hasStarted(a, now)
  const bStarted = runnerService.hasStarted(b, now)

  if (aStarted && bStarted) {
    return 0
  } else if (aStarted) {
    // b did no
    return -1
  } else if (bStarted) {
    // a did not
    return 1
  } else {
    // none started
    return 0
  }
}

function byTime(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const aTimeSeconds = a.stage.time_seconds
  const bTimeSeconds = b.stage.time_seconds
  return aTimeSeconds - bTimeSeconds
}

function haveBothFinished(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): boolean {
  const finishedA = runnerService.hasFinished(a)
  const finishedB = runnerService.hasFinished(b)

  return finishedA && finishedB
}

/**
 * Check if both runners have started
 * @param a First runner
 * @param b Second runner
 * @param now Current time, if not provided `DateTime.now()` is invoked
 */
function haveBothStarted(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
  now?: DateTime<true>,
): boolean {
  const aStarted = runnerService.hasStarted(a, now)
  const bStarted = runnerService.hasStarted(b, now)

  return aStarted && bStarted
}

const runnerCompareFunctions = {
  byStagePosition,
  byStageStatus,
  byOverallPosition,
  byName,
  byStartTime,
  byControlRunningTowards,
  byLastCommonOnlineControl,
  byFinishedStatus,
  byStartedStatus,
  byTime,
  haveBothFinished,
  haveBothStarted,
}
export default runnerCompareFunctions
