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
      const start_time = DateTime.fromISO(result.start_time)

      const processedSplit = result.splits.map((split,index,array):ProcessedSplitModel=>{

        let time:null|number = null
        let cumulative_time: null|number = null

        if (result.start_time && result.finish_time && split.reading_time) {
          const reading_time = DateTime.fromISO(split.reading_time)
          cumulative_time = reading_time.diff(start_time).as('seconds')

          // first split
          if (index==0) {
            time = cumulative_time
          // second to last-1 splits
          } else {
            const prev_reading_time_string = array[index-1].reading_time
            if (prev_reading_time_string) {
              time = reading_time.diff(DateTime.fromISO(prev_reading_time_string)).as('seconds')
            }
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

      // finish split
      // TODO: handle the case were the missing punch is due to not punching the finish line
      if (result.splits.length > 0 && result.start_time && result.finish_time) {
        const finish_time = DateTime.fromISO(result.finish_time)
        // @ts-expect-error linter doesn't know that the length of splits is at least 1
        const prev_reading_time_string = result.splits.at(-1).reading_time
        processedSplit.push(
          {
            id: `${runner.id}-finishSplit`,
            reading_time: result.finish_time,
            order_number: Infinity,
            points: BigInt(0),
            time: prev_reading_time_string ? finish_time.diff(DateTime.fromISO(prev_reading_time_string)).as('seconds') : null, //time in seconds for this split
            time_behind: null, //time behind best runner in seconds for this split
            position: null, // position in this split
            cumulative_time: prev_reading_time_string ?Number(result.time_seconds) : null, //time in seconds since start
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

export function calculatePositionsAndBehindsFootO(runners: ProcessedRunnerModel[]): ProcessedRunnerModel[] {

  if (runners.length > 0) {
    const splits = [...runners[0].runner_results[0].splits] ; // Clone the array to avoid mutation

    // Generate time matrices
    const timesTable = splits.map((_,index) => {
      return runners.map((runner)=>{
        if (runner.runner_results[0].splits[index]) {
          return {runnerId:runner.id, time: runner.runner_results[0].splits[index].time}
        } else {
          return {runnerId: runner.id, time:null}
        }
      })
    })
    timesTable.forEach((splitList)=>{
      splitList.sort((a,b)=>{
        const timeA = a.time
        const timeB = b.time

        // Handle cases where time is null
        if (timeA === null && timeB === null) return 0; // Both are null, consider equal
        if (timeA === null) return 1; // Place `null` times after valid times
        if (timeB === null) return -1; // Place valid times before `null`

        // Both times are numbers, compare them
        return timeA - timeB;
      })
    })
    console.log("times table",timesTable)

    // update runners
    return runners.map((runner)=>{
      if (runner.runner_results[0]) {
        const newSplits = runner.runner_results[0].splits.map((split,index)=>{
          const bestTime = timesTable[index][0].time
          if (bestTime) {
            return {
              ...split,
              time_behind : split.time? split.time-bestTime : null
            }
          } else {
            return split
          }
        })
        return {
          ...runner,
          runner_results: [
            {
              ...runner.runner_results[0],
              splits: newSplits
            }
          ]
        }
      } else {
        return runner
      }
    })
  } else {
    return []
  }
}