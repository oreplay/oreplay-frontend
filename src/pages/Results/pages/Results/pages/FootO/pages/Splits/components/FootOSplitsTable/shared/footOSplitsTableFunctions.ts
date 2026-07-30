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
import { NORMAL_CONTROL } from "../../../../../../../../../shared/constants.ts"
import { hasChipDownload } from "../../../../../../../shared/functions.ts"
import { captureException as sentryCaptureException, withScope } from "@sentry/react"

export type CourseControlModel = {
  control: ControlModel | null
  order_number: number | null // TODO: It can't be null
}

/**
 * Extract the course from a list of runners.
 *
 * If the course cannot be found an empty list will be returned
 * @param runnerList Runners to find the course
 */
export function getCourseFromRunner(
  runnerList: RunnerModel[] | ProcessedRunnerModel[],
): CourseControlModel[] {
  let courseControlList: CourseControlModel[] = []

  for (let i = 0; i < runnerList.length; i++) {
    const runner: ProcessedRunnerModel | RunnerModel = runnerList[i]
    const splitList = runner.stage.splits

    if (splitList && hasChipDownload(runner)) {
      //TODO: ADD a test that checks it works when mixing runners only with online splits and runners with full split list
      try {
        courseControlList = getCourseFromSplits(splitList)
        break
      } catch (e) {
        // TODO: Add sentry error tracing here
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
 * Helper function to create missing online controls
 * @param station Code of the control
 * @param orderNumber Order in which this online control is visited
 */
export function createMissingRadioSplit(
  station: number | null,
  orderNumber: number,
): RadioSplitModel {
  return {
    id: `missingRadio-${station}`,
    is_intermediate: true,
    reading_time: null,
    order_number: orderNumber,
    points: 0,
    control: station
      ? {
          id: `missingRadio-control-${station}`,
          station: station.toString(),
          control_type: NORMAL_CONTROL,
        }
      : null,
    time: null,
    time_behind: null,
    position: null,
    cumulative_time: null,
    cumulative_behind: null,
    cumulative_position: null,
    is_next: null,
  }
}

export function createMissingRadioFinish(): RadioSplitModel {
  return {
    id: `missingFinish`,
    is_intermediate: true,
    reading_time: null,
    order_number: Infinity,
    points: 0,
    control: null,
    time: null,
    time_behind: null,
    position: null,
    cumulative_time: null,
    cumulative_behind: null,
    cumulative_position: null,
    is_next: null,
  }
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
  const Splits = splitList.filter(
    (split) => (split.control ? onlineSplitStationsNumber.includes(split.control.station) : true), // `: true` picks the finish split
  )

  // Convert them to RadioSplitModel
  const radioSplits = Splits.map((split): RadioSplitModel => ({ ...split, is_next: null }))

  // Fill missing online controls from split list
  if (radioSplits.length == 0) {
    radioSplits.push(createMissingRadioFinish())
  }
  //// Regular controls
  for (let i = 0; i < radiosList.length; i++) {
    const radioInRunner = radioSplits.at(i)?.control
    const radioInList = radiosList.at(i)

    if (radioInRunner?.station !== radioInList?.station) {
      const missingRadio: RadioSplitModel = createMissingRadioSplit(
        radioInList?.station ? Number(radioInList.station) : null,
        i + 1,
      )

      radioSplits.splice(i, 0, missingRadio) //insert split
    }
  }

  // Find the next radio split (the one the runner is going towards)
  let prevTimeString: string | null | undefined
  for (let i = radioSplits.length - 1; i >= 0; i--) {
    prevTimeString = i - 1 >= 0 ? radioSplits.at(i - 1)?.reading_time : startTime

    const split = radioSplits[i]
    if (split.reading_time === null && prevTimeString) {
      split.is_next = DateTime.fromISO(prevTimeString)
      break
    } else {
      prevTimeString = split.reading_time
    }
  }

  // Error check
  if (radioSplits.length != radiosList.length + 1) {
    console.error(
      "The resulting number of online controls and the number of online controls defined for this class differ",
    )

    try {
      throw new Error(
        "The resulting number of online controls and the number of online controls defined for this class differ",
      )
    } catch (error) {
      withScope((scope) => {
        scope.setExtra("splitList", splitList)
        scope.setExtra("radioList", radiosList)
        scope.setExtra("origin", "getOnlineSplits")

        sentryCaptureException(error)
      })
    }

    // Return all online controls as missing
    const allMissingRadioSplits = radiosList.map((onlineControl, index) =>
      createMissingRadioSplit(Number(onlineControl.station), index + 1),
    )
    allMissingRadioSplits.push(createMissingRadioFinish())
    return allMissingRadioSplits
  }

  // Return radio splits
  return radioSplits
}
