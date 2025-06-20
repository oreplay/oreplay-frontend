import { RESULT_STATUS, RESULT_STATUS_TEXT } from "./constants.ts"
import { RunnerModel } from "../../../shared/EntityTypes.ts"
import { TFunction } from "i18next"
import { ProcessedRunnerModel } from "../components/VirtualTicket/shared/EntityTypes.ts"

export function parseResultStatus(status: string): string {
  switch (status) {
    case RESULT_STATUS.ok:
      return RESULT_STATUS_TEXT.ok
    case RESULT_STATUS.dns:
      return RESULT_STATUS_TEXT.dns
    case RESULT_STATUS.dnf:
      return RESULT_STATUS_TEXT.dnf
    case RESULT_STATUS.mp:
      return RESULT_STATUS_TEXT.mp
    case RESULT_STATUS.disqualified:
      return RESULT_STATUS_TEXT.disqualified
    case RESULT_STATUS.ot:
      return RESULT_STATUS_TEXT.ot
    case RESULT_STATUS.nc:
      return RESULT_STATUS_TEXT.nc
    default:
      return "unknown" + status
  }
}

export function getPositionOrNc(
  runner: ProcessedRunnerModel,
  t: TFunction<"translation", undefined>,
): string {
  const status = parseResultStatus(runner.stage.status_code as string)
  if (status === RESULT_STATUS_TEXT.nc) {
    return t("ResultsStage.statusCodes.nc")
  }
  return runner.stage.position ? `${runner.stage.position}.` : ""
}

/**
 * Assign each status code a number with the priority it should appear on result
 * @param status A valid RUNNER_STATUS
 * @param position Position of the runner. It is used to place runners that have not finished after the finished oned
 */
function statusOrder(status: string | null, position: bigint) {
  switch (status) {
    case RESULT_STATUS.ok:
      if (position == BigInt(0)) {
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

/**
 * Order a list of runners by their position
 * @param runnersList List of runners to be ordered
 */
export function orderedRunners(runnersList: RunnerModel[]) {
  // Order splits
  runnersList.forEach((runner) => {
    if (runner.stage) {
      runner.stage.splits.sort((a, b) => {
        const ordA = a.order_number
        const ordB = b.order_number

        if (!ordA) return 1 // Place 'a' after 'b' if 'a' has no position
        if (!ordB) return -1 // Place 'b' after 'a' if 'b' has no position

        return Number(ordA - ordB)
      })
    }
  })

  // Order runners
  return runnersList.sort((a, b) => {
    // Order by status
    const statusA = statusOrder(a.stage?.status_code, a.stage?.position)
    const statusB = statusOrder(b.stage?.status_code, b.stage?.position)

    if (statusA !== undefined && statusB !== undefined && statusA !== statusB) {
      return statusA - statusB // Smaller status comes first
    }

    // TODO: Propely refactor this function to save logic and work with overalls as well
    if (
      a.overalls != null &&
      b.overalls != null &&
      a.overalls.overall.position != null &&
      b.overalls.overall.position != null
    ) {
      return a.overalls.overall.position - b.overalls.overall.position
    }

    // If statuses are the same and not "ok", order by runner.last_name
    const statusCodeA = a.stage?.status_code
    const statusCodeB = b.stage?.status_code

    const lastNameA = a.full_name?.toLowerCase()
    const lastNameB = b.full_name?.toLowerCase()
    if (statusCodeA !== RESULT_STATUS.ok && statusCodeA === statusCodeB) {
      return lastNameA.localeCompare(lastNameB) // Alphabetical order by last name
    }

    // Fallback to position comparison
    const posA = Number(a.stage?.position)
    const posB = Number(b.stage?.position)

    if (posA == 0 && posB != 0) {
      return 1 // Place 'a' after 'b' if 'a' has no position
    }
    if (posA != 0 && posB == 0) {
      return -1 // Place 'b' after 'a' if 'b' has no position
    }
    if (posA == 0 && posB == 0) {
      // use start time if available
      const startTimeA = a.stage?.start_time
      const startTimeB = b.stage?.start_time
      if (startTimeA == null && startTimeB != null) {
        return 1 // Place 'a' after 'b' if 'a' has no startTime
      }
      if (startTimeA != null && startTimeB == null) {
        return -1 // Place 'b' after 'a' if 'b' has no startTime
      }
      if (startTimeA != null && startTimeB != null) {
        return startTimeB.localeCompare(startTimeA)
      } else {
        // none of the got start time: alphabetical order
        return lastNameA.localeCompare(lastNameB) // Alphabetical order by last name
      }
    }

    return posA - posB // Compare positions numerically
  })
}

/**
 * Sort a runner list by their class. Sorting is done in place
 * @param runnersList Runners to be ordered
 */
export function orderRunnersByClass(runnersList: RunnerModel[]) {
  return runnersList.sort((a, b) => {
    const runnerClassA = a.class.short_name
    const runnerClassB = b.class.short_name

    return runnerClassA.localeCompare(runnerClassB)
  })
}
