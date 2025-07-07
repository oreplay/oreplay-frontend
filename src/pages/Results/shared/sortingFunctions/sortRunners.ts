import { RESULT_STATUS, RESULT_STATUS_TEXT } from "../constants.ts"
import { RunnerModel } from "../../../../shared/EntityTypes.ts"
import runnerCompareFunctions from "./compareFunctions.ts"

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

/**
 * This is a helper function to compute how two objects compare given a list of compare functions
 * that define suborders
 * @param a The first element of the comparison
 * @param b The second element of the comparison
 * @param compareFunctionList The return value of each of the functions should be a number whose
 * sign indicates the relative order of the two elements: negative if `a` is less than `b`, positive
 * if `a` is greater than `b`, and zero if they are equal. `NaN` is treated as 0.
 */
export function multiLevelCompare<T>(
  a: T,
  b: T,
  compareFunctionList: ((a: T, b: T) => number)[],
): number {
  let compareResult = 0
  for (let i = 0; i < compareFunctionList.length && compareResult == 0; ++i) {
    compareResult = compareFunctionList[i](a, b)
  }

  return compareResult
}

/**
 * Sort a list of runners
 * @param runnersList List of runners to be ordered
 */
export function orderedRunners(runnersList: RunnerModel[]) {
  return runnersList.sort((a, b) => {
    return multiLevelCompare(a, b, [
      runnerCompareFunctions.byStageStatus,
      runnerCompareFunctions.byStagePosition,
      runnerCompareFunctions.byOverallPosition,
      (a, b) => -runnerCompareFunctions.byStartTime(a, b), // reverse
      runnerCompareFunctions.byName,
    ])
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
