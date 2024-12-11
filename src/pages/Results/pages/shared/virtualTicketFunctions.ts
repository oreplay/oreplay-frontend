import {RunnerModel} from "../../../../shared/EntityTypes.ts";

import {
  ProcessedRunnerModel,
  ProcessedRunnerResultModel,
  ProcessedSplitModel
} from "./EntityTypes.ts";
import {orderedRunners} from "../../shared/functions.ts";
import {DateTime} from "luxon";

/**
 * Create a processed runners from runners
 *
 * Runners are ordered and the time and cumulative time of their splits is computed if possible
 *
 * @param runners runners to process
 */
export function processRunnerData(runners: RunnerModel[]): ProcessedRunnerModel[] {
  runners = orderedRunners(runners)

  return runners.map((runner):ProcessedRunnerModel => {
    const processedRunnerResultList = runner.runner_results.map((result):ProcessedRunnerResultModel => {

      const processedSplit = result.splits.map((split,index,array):ProcessedSplitModel=>{

        let time:null|number = null
        let cumulative_time: null|number = null

        if (result.start_time && result.finish_time) {
          const start_time = DateTime.fromISO(result.start_time)
          const reading_time = DateTime.fromISO(split.reading_time)

          cumulative_time = reading_time.diff(start_time).as('seconds')

          if (index==0) {
            time = cumulative_time
          } else {
            const prev_reading_time = DateTime.fromISO(array[index-1].reading_time)
            time = reading_time.diff(prev_reading_time).as('seconds')
          }

        }

        return {
          ...split,
          time: time,
          time_behind: null,
          position: null,
          cumulative_time: cumulative_time,
          cumulative_behind: null,
          cumulative_position: null
        }
      })

      if (result.splits.length > 0 && result.start_time && result.finish_time) {
        const finish_time = DateTime.fromISO(result.finish_time)
        // @ts-expect-error linter doesn't know that the length of splits is at least 1
        const prev_reading_time = DateTime.fromISO(result.splits.at(-1).reading_time)
        processedSplit.push(
          {
            id: `${runner.id}-finishSplit`,
            reading_time: result.finish_time,
            order_number: Infinity,
            points: BigInt(0),
            time: finish_time.diff(prev_reading_time).as('seconds'), //time in seconds for this split
            time_behind: null, //time behind best runner in seconds for this split
            position: null, // position in this split
            cumulative_time: Number(result.time_seconds), //time in seconds since start
            cumulative_behind: null, //time in seconds behind the best runner
            cumulative_position: null, //position from start
            control: null
          }
        )
      }

      return ({
        ...result,
        splits: processedSplit
      })
    })
    return ({
      ...runner,
      runner_results: processedRunnerResultList
    })
  });
}
