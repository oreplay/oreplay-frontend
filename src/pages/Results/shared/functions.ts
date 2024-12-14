import {RESULT_STATUS, RESULT_STATUS_TEXT} from "./constants.ts";
import {RunnerModel} from "../../../shared/EntityTypes.ts";
import { TFunction } from 'i18next'
import {ProcessedRunnerModel} from "../components/VirtualTicket/shared/EntityTypes.ts";

export function parseResultStatus(status: string): string {

  switch(status) {
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

export function getPositionOrNc(runner: ProcessedRunnerModel, t: TFunction<"translation",undefined>): string {
  const status = parseResultStatus(runner.runner_results[0].status_code as string)
  if (status === RESULT_STATUS_TEXT.nc) {
    return t('ResultsStage.statusCodes.nc')
  }
  return runner.runner_results[0].position ? `${runner.runner_results[0].position}.` : ""
}

/**
 * Assign each status code a number with the priority it should appear on result
 * @param status A valid RUNNER_STATUS
 */
function statusOrder(status:string|null) {
  switch (status) {
    case RESULT_STATUS.ok:
      return 0
    case RESULT_STATUS.ot:
      return 1
    case RESULT_STATUS.mp:
      return 2
    case RESULT_STATUS.disqualified:
      return 3
    case RESULT_STATUS.dnf:
      return 4
    case RESULT_STATUS.dns:
      return 5
    case RESULT_STATUS.nc:
      return 6
    default:
      return 10
  }
}

/**
 * Order a list of runners by their position
 * @param runnersList List of runners to be ordered
 */
export function orderedRunners (runnersList:RunnerModel[])  {

  // Order splits
  runnersList.forEach((runner)=>{
    runner.runner_results.forEach(runnerResult=>{
      runnerResult.splits.sort((a,b)=>{
        const ordA = a.order_number
        const ordB = b.order_number

        if (!ordA) return 1 // Place 'a' after 'b' if 'a' has no position
        if (!ordB) return -1 // Place 'b' after 'a' if 'b' has no position

        return Number(ordA-ordB)
      })
    })
  })

  // Order runners
  return runnersList.sort((a, b) => {

    // Order by status
    const statusA = statusOrder(a.runner_results[0]?.status_code)
    const statusB = statusOrder(b.runner_results[0]?.status_code)

    if (statusA !== undefined && statusB !== undefined && statusA !== statusB) {
      return statusA - statusB; // Smaller status comes first
    }

    // Fallback to position comparison
    const posA = Number(a.runner_results[0]?.position)
    const posB = Number(b.runner_results[0]?.position)

    if (posA === undefined) return 1; // Place 'a' after 'b' if 'a' has no position
    if (posB === undefined) return -1; // Place 'b' after 'a' if 'b' has no position
    return posA - posB; // Compare positions numerically
  });
}