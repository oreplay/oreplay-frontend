import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { multiLevelCompare } from "../../../../../../../shared/sortingFunctions/sortRunners.ts"
import runnerCompareFunctions from "../../../../../../../shared/sortingFunctions/compareFunctions.ts"

/**
 * This function sorts runners in a class by their start times. Sorting is done
 * in place
 * @param runnersList A list of runners to be ordered
 */
export function sortRunnersByStartTime(
  runnersList: ProcessedRunnerModel[],
): ProcessedRunnerModel[] {
  return runnersList.sort((a, b) => {
    return multiLevelCompare(a, b, [
      runnerCompareFunctions.byStartTime,
      runnerCompareFunctions.byName,
    ])
  })
}
