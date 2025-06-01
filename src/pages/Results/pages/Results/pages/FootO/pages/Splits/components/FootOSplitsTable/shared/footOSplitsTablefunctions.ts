import {
  ControlModel,
  OnlineControlModel,
  RunnerModel,
  SplitModel,
} from "../../../../../../../../../../../shared/EntityTypes.ts"
import {
  ProcessedRunnerModel,
  ProcessedSplitModel,
  RadioSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { DateTime } from "luxon"

export type CourseControlModel = {
  control: ControlModel | null
  order_number: number | null // TODO: It can't be null
}

export function getCourseFromRunner(
  runnerList: RunnerModel[] | ProcessedRunnerModel[],
): CourseControlModel[] {
  let courseControlList: CourseControlModel[] = []

  for (let i = 0; i < runnerList.length; i++) {
    const runner: ProcessedRunnerModel | RunnerModel = runnerList[i]
    const splitList = runner.stage.splits

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

  return splitListCopy.map((split): CourseControlModel => {
    return {
      control: split.control,
      order_number: split.order_number,
    }
  })
}

export function getOnlineControlsCourseFromClassSplits(
  controlList: OnlineControlModel[],
): OnlineControlModel[] {
  const controlListCopy = [...controlList] // TODO: avoid copying, this function should be called only once. Move it to classes call?

  // Add finish
  controlListCopy.push({
    station: "Finish",
    id: "FinishOlineControl",
  })

  return controlListCopy
}

/**
 * Get online splits from a Processed Splits list and compute the next online control
 * @param splitList List of ProcessedSplitModel to extract online controls from
 * @param radiosList List of OnlineControlModel with the online controls
 * @param startTime ISO string startTime of the runner
 */
export function getOnlineSplits(
  splitList: ProcessedSplitModel[],
  radiosList: OnlineControlModel[],
  startTime: string | null,
): RadioSplitModel[] {
  // Extract splits that are radio controls
  const onlineSplitStationsNumber = radiosList.map((control) => control.station)
  const Splits = splitList.filter((split) =>
    split.control ? onlineSplitStationsNumber.includes(split.control.station) : true,
  )

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
