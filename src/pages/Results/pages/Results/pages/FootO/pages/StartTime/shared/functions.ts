import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

/**
 * This function orders runners in a class by their start times. The original
 * array is copied to avoid its mutation.
 * @param runnersList A list of runners to be ordered
 */
export function orderRunnersByStartTime(
  runnersList: ProcessedRunnerModel[],
): ProcessedRunnerModel[] {
  // Make a shallow copy to avoid mutating the original data
  return [...runnersList].sort((a, b) => {
    const startTimeA = a.runner_results[0]?.start_time
    const startTimeB = b.runner_results[0]?.start_time

    // Handle cases where both start_time values are null/undefined
    if ((startTimeA == null && startTimeB == null) || startTimeA == startTimeB) {
      const lastNameA = a.last_name.toLowerCase() || ""
      const lastNameB = b.last_name.toLowerCase() || ""
      return lastNameA.localeCompare(lastNameB) // Alphabetical order
    }

    // Handle cases where only one start_time is null/undefined
    if (startTimeA == null) {
      return 1 // Place a at the bottom
    }
    if (startTimeB == null) {
      return -1 // Place b at the bottom
    }

    // Otherwise, compare the valid timestamps
    const dateA = new Date(startTimeA).getTime()
    const dateB = new Date(startTimeB).getTime()
    return dateA - dateB
  })
}
