import {
  ControlModel,
  RunnerModel,
  SplitModel,
} from "../../../../../../../../../../../shared/EntityTypes.ts"
import {
  ProcessedRunnerModel,
  ProcessedSplitModel,
  RadioSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { DateTime } from "luxon"

type CourseControlModel = {
  control: ControlModel | null
  order_number: bigint | number | null // TODO: It can't be null
}

export function getCourseFromRunner(
  runnerList: RunnerModel[] | ProcessedRunnerModel[],
): CourseControlModel[] {
  let courseControlList: CourseControlModel[] = []

  for (let i = 0; i < runnerList.length; i++) {
    const splitList = runnerList[i].overall.splits

    if (splitList) {
      try {
        courseControlList = getCourseFromSplits(splitList)
        break
      } catch (e) {
        console.error(e)
      }
    }
  }
  return courseControlList
}

export function getCourseFromSplits(
  splitsList: SplitModel[] | ProcessedSplitModel[],
): CourseControlModel[] {
  const splitListCopy = [...splitsList]

  return splitListCopy
    .map((split): CourseControlModel => {
      return {
        control: split.control,
        order_number: split.order_number,
      }
    })
    .filter((control) => control.order_number != null)
}

export function getOnlineControlsCourseFromClassSplits(
  splitsList: SplitModel[] | ProcessedSplitModel[],
): CourseControlModel[] {
  // parse controls
  const controlList = getCourseFromSplits(splitsList)

  // Add finish
  controlList.push({
    control: null,
    order_number: Infinity,
  })

  return controlList
}

/**
 * Get online splits from a Processed Splits list and compute the next online control
 * @param splitList List of ProcessedSplitModel to extract online controls from
 * @param startTime ISO string startTime of the runner
 */
export function getOnlineSplits(
  splitList: ProcessedSplitModel[],
  startTime: string | null,
): RadioSplitModel[] {
  // Extract splits that are radio controls
  const Splits = splitList.filter((split) => split.is_intermediate)

  // Convert them to RadioSplitModel
  const RadioSplits = Splits.map((split): RadioSplitModel => ({ ...split, is_next: null }))

  // Find the next radio split
  let prevTimeString = startTime
  for (let i = 0; i < RadioSplits.length; i++) {
    const split = RadioSplits[i]
    if (split.reading_time === null && prevTimeString !== null) {
      split.is_next = DateTime.fromISO(prevTimeString)
      break
    } else {
      prevTimeString = split.reading_time
    }
  }

  // Return radio splits
  return RadioSplits
}
