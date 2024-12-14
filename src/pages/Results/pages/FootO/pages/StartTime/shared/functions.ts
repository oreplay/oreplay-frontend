import {ProcessedRunnerModel} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts";

/**
 * This function orders runners in a class by their start times. The original
 * array is copied to avoid its mutation.
 * @param runnersList A list of runners to be ordered
 */
export function orderRunnersByStartTime (runnersList:ProcessedRunnerModel[]):ProcessedRunnerModel[] {

  // a shallow copy is made first to avoid mutating the original data
  return [...runnersList].sort((a, b) => {
    const dateA = new Date(a.runner_results[0]?.start_time).getTime();
    const dateB = new Date(b.runner_results[0]?.start_time).getTime();

    return dateA - dateB; // Compare timestamps
  });
}