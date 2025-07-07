import { RunnerModel } from "../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../constants.ts"

/**
 * This helper functions assigns each status code a number with the priority it should appear on result
 * @param status A valid RUNNER_STATUS
 * @param position Position of the runner. It is used to place runners that have not finished after the finished oned
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
      return 4
    case RESULT_STATUS.disqualified:
      return 5
    case RESULT_STATUS.dnf:
      return 6
    case RESULT_STATUS.dns:
      return 7
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

function byPosition(a: number | null | undefined, b: number | null | undefined): number {
  if (a && b) {
    return a - b
  } else if (a) {
    return -1
  } else if (b) {
    return 1
  } else {
    return 0
  }
}

function byStagePosition(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const posA = a.stage?.position
  const posB = b.stage?.position

  if (posA !== 0 && posB !== 0) {
    return byPosition(posA, posB)
  } else {
    if (posA === 0) {
      return 1
    } else if (posB === 0) {
      return -1
    } else {
      return 0
    }
  }
}

function byOverallPosition(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const aPosition = a.overalls?.overall.position
  const bPosition = b.overalls?.overall.position

  return byPosition(aPosition, bPosition)
}

function byName(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const nameA = a.full_name.toLowerCase()
  const nameB = b.full_name.toLowerCase()

  return nameA.localeCompare(nameB)
}

function byStartTime(
  a: RunnerModel | ProcessedRunnerModel,
  b: RunnerModel | ProcessedRunnerModel,
): number {
  const startTimeA = a.stage?.start_time
  const startTimeB = b.stage?.start_time

  if (startTimeA && startTimeB) {
    return startTimeA.localeCompare(startTimeB)
  } else if (startTimeA) {
    return -1
  } else if (startTimeB) {
    return 1
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
}

export default runnerCompareFunctions
