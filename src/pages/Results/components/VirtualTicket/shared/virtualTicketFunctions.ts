import { RunnerModel } from "../../../../../shared/EntityTypes.ts"

import {
  ProcessedRunnerModel,
  ProcessedRunnerResultModel,
  ProcessedSplitModel,
} from "./EntityTypes.ts"
import { DateTime } from "luxon"
import { hasChipDownload, isRunnerNC } from "../../../pages/Results/shared/functions.ts"
import { getCourseFromRunner } from "../../../pages/Results/pages/FootO/pages/Splits/components/FootOSplitsTable/shared/footOSplitsTablefunctions.ts"

/**
 * Create a processed runners from runners
 *
 * Runners are ordered and the time and cumulative time of their splits is computed if possible
 *
 * @param runners runners to process
 */
export function processRunnerData(runners: RunnerModel[]): ProcessedRunnerModel[] {
  return runners.map((runner): ProcessedRunnerModel => {
    const runnerResults = []
    if (runner.stage) {
      runnerResults.push(runner.stage) // TODO refactor
    }
    const processedRunnerResultList = runnerResults.map((result): ProcessedRunnerResultModel => {
      const start_time = result.start_time ? DateTime.fromISO(result.start_time) : null

      const processedSplit = result.splits.map((split, index, array): ProcessedSplitModel => {
        let time: null | number = null
        let cumulative_time: null | number = null

        if (result.start_time && split.reading_time) {
          const reading_time = DateTime.fromISO(split.reading_time)
          cumulative_time = start_time ? reading_time.diff(start_time).as("seconds") : null

          // first split
          if (index == 0) {
            time = cumulative_time
            // second to last-1 splits
          } else {
            const prev_reading_time_string = array[index - 1].reading_time
            if (prev_reading_time_string) {
              time = reading_time.diff(DateTime.fromISO(prev_reading_time_string)).as("seconds")
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
          cumulative_position: null,
        }
      })

      // finish split
      // TODO: handle the case were the missing punch is due to not punching the finish line
      if (result.splits.length > 0 && result.start_time && result.finish_time) {
        const finish_time = DateTime.fromISO(result.finish_time)
        // @ts-expect-error linter doesn't know that the length of splits is at least 1
        const prev_reading_time_string = result.splits.at(-1).reading_time
        processedSplit.push({
          id: `${runner.id}-finishSplit`,
          reading_time: result.finish_time,
          order_number: Infinity,
          points: 0,
          time: prev_reading_time_string
            ? finish_time.diff(DateTime.fromISO(prev_reading_time_string)).as("seconds")
            : null, //time in seconds for this split
          time_behind: null, //time behind best runner in seconds for this split
          position: null, // position in this split
          cumulative_time: prev_reading_time_string ? Number(result.time_seconds) : null, //time in seconds since start
          cumulative_behind: null, //time in seconds behind the best runner
          cumulative_position: null, //position from start
          control: null,
          is_intermediate: true, // Finish is always an online control
        })
      }

      return {
        ...result,
        splits: processedSplit,
      }
    })
    return {
      ...runner,
      stage: processedRunnerResultList[0],
    }
  })
}

export function calculatePositionsAndBehindsFootO(
  runners: ProcessedRunnerModel[],
  excludeNC: boolean = true,
): ProcessedRunnerModel[] {
  if (runners.length > 0) {
    const splits = getCourseFromRunner(runners)

    // Generate time matrices for splits
    const timesTable = splits.map((_, index) => {
      return runners.map((runner) => {
        // Compute for runner with coherent splits and download
        if (runner.stage.splits[index] && hasChipDownload(runner)) {
          // handle NC
          if (isRunnerNC(runner) && excludeNC) {
            return null
          } else {
            return runner.stage.splits[index].time
          }
        } else {
          return null
        }
      })
    })
    timesTable.forEach((splitList) => {
      splitList.sort((a, b) => {
        // Handle cases where time is null
        if (a === null && b === null) return 0 // Both are null, consider equal
        if (a === null) return 1 // Place `null` times after valid times
        if (b === null) return -1 // Place valid times before `null`

        // Both times are numbers, compare them
        return a - b
      })
    })

    // Generate time matrices for cumulative splits
    const cumulativeTable = splits.map((_, index) => {
      return runners.map((runner) => {
        // only map times if the runner is ok
        const missingPunchFrom = runner.stage.splits.findIndex((split) => split.time === null)

        // Exclude runners without download
        if (
          runner.stage.splits[index] &&
          hasChipDownload(runner) &&
          (missingPunchFrom === -1 || missingPunchFrom > index)
        ) {
          // handle nc
          if (isRunnerNC(runner) && excludeNC) {
            return null
          } else {
            return runner.stage.splits[index].cumulative_time
          }
        } else {
          return null
        }
      })
    })
    cumulativeTable.forEach((splitList) => {
      splitList.sort((a, b) => {
        // Handle cases where time is null
        if (a === null && b === null) return 0 // Both are null, consider equal
        if (a === null) return 1 // Place `null` times after valid times
        if (b === null) return -1 // Place valid times before `null`

        // Both times are numbers, compare them
        return a - b
      })
    })

    // update runners
    return runners.map((runner): ProcessedRunnerModel => {
      // only compute for runners with downloads
      if (hasChipDownload(runner)) {
        try {
          const isNC = isRunnerNC(runner)
          const newSplits = runner.stage.splits.map((split, index, splitsArray) => {
            const bestTime: number | null = timesTable[index][0]
            const best_cumulative: number | null = cumulativeTable[index][0]
            if (bestTime !== null && best_cumulative !== null) {
              const missingPunchFrom = splitsArray.findIndex((split) => split.time === null)
              const position = findPositionInTimesTable(
                timesTable,
                split.time,
                index,
                isNC,
                excludeNC,
              )
              const cumulativePosition = findPositionInTimesTable(
                cumulativeTable,
                split.cumulative_time,
                index,
                isNC,
                excludeNC,
              )

              // Check when cumulative differences should be meaningful
              const cumulative_difference =
                split.cumulative_time !== null &&
                (missingPunchFrom === -1 || missingPunchFrom > index)

              return {
                ...split,
                time_behind: split.time !== null ? split.time - bestTime : null,
                position: split.time !== null ? position : null,
                cumulative_behind:
                  cumulative_difference && split.cumulative_time
                    ? split.cumulative_time - best_cumulative
                    : null,
                cumulative_position: cumulative_difference ? cumulativePosition : null,
              }
            } else {
              return split
            }
          })
          return {
            ...runner,
            stage: {
              ...runner.stage,
              splits: newSplits,
            },
          }
        } catch (error) {
          // if an error happens return the runner without updating it
          console.error(
            "Error updating runner in `calculatePositionsAndBehindsFootO`." +
              ` Runner ${runner.id}, ${runner.full_name} could not be updated.\n\n`,
            error,
          )
          return runner
        }

        // No download, no update
      } else {
        return runner
      }
    })
  } else {
    return []
  }
}

/**
 * Compute the position of a runner's split from a timesTable of all splits
 *
 * @param timesTable The outer list is the station in the course, the inner list is the split in that station for all runners
 * @param time Time of the runner in that station
 * @param index Index of the station
 * @param isNC Whether the runner is "no classify" or not
 * @param excludeNC Whether "no classify" runners are being excluded from computations
 */
function findPositionInTimesTable(
  timesTable: (number | null)[][],
  time: number | null,
  index: number,
  isNC: boolean,
  excludeNC: boolean,
) {
  // handle missing time
  if (time === null) {
    return null
  }

  // handle nc
  if (isNC && excludeNC) {
    // Time is not in timesTable, so we find how good we are compared to classify runners.
    const allSplits = timesTable[index]
    let position = allSplits.length
    for (let i = 0; i < allSplits.length; i++) {
      const thisSplit = allSplits[i]
      if (thisSplit && time <= thisSplit) {
        position = i + 1
        break
      }
    }

    return position
  } else {
    // Time must be in the timesTable
    return timesTable[index].indexOf(time) + 1
  }
}
