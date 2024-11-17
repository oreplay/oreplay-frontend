import {RESULT_STATUS} from "./constants.ts";
import {RunnerModel} from "../../../shared/EntityTypes.ts";

export function parseResultStatus(status: string): string {

  switch(status) {
    case RESULT_STATUS.ok:
      return "ok"
    case RESULT_STATUS.dns:
      return "dns"
    case RESULT_STATUS.dnf:
      return "dnf"
    case RESULT_STATUS.mp:
      return "mp"
    case RESULT_STATUS.disqualified:
      return "disqualified"
    case RESULT_STATUS.ot:
      return "ot"
    default:
      return "unknown" + status
  }
}

/**
 * Order a list of runners by their position
 * @param runnersList List of runners to be ordered
 */
export function orderedRunners (runnersList:RunnerModel[])  {
  return runnersList.sort((a, b) => {
    const posA = a.runner_results[0]?.position
    const posB = b.runner_results[0]?.position
    if (!posA) return 1 // Place 'a' after 'b' if 'a' has no position
    if (!posB) return -1 // Place 'b' after 'a' if 'b' has no position
    return Number(posA - posB)
  });
}