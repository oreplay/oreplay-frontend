import {RunnerModel} from "../../../../../../../shared/EntityTypes.ts";

export function orderRunnersByStartTime (runnersList:RunnerModel[]):RunnerModel[] {

  return runnersList.sort((a, b) => {
    const dateA = new Date(a.runner_results[0]?.start_time).getTime();
    const dateB = new Date(b.runner_results[0]?.start_time).getTime();

    return dateA - dateB; // Compare timestamps
  });
}