import { RunnerModel } from "../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../constants.ts"
import { runnerService } from "../../../../domain/services/RunnerService.ts"

/**
 * This helper functions assigns each status code a number with the priority it should appear on result
 * @param status A valid RUNNER_STATUS
 * @param position Position of the runner
 */
function statusOrder(status: string | null, position: number | null) {
  switch (status) {
    case RESULT_STATUS.ok:
      if (position == 0) {
        return 2
      } else {
        return 0
      }
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

function byStatus(
  aStatusCode: string | null,
  bStatusCode: string | null,
  aPosition: number | null,
  bPosition: number | null,
) {
  const statusA = statusOrder(aStatusCode, aPosition)
  const statusB = statusOrder(bStatusCode, bPosition)

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
  const aPosition = a.stage?.position
  const bPosition = b.stage?.position

  return byStatus(aStatus, bStatus, aPosition, bPosition)
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
      return runnerCompareFunctions.byIsNC(isANC, isBNC)
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

const runnerCompareFunctions = {
  byStagePosition: byStagePosition,
  byStageStatus: byStageStatus,
  byOverallPosition: byOverallPosition,
  byName: byName,
  byStartTime: byStartTime,
  byIsNC: byIsNC,
}

export default runnerCompareFunctions
