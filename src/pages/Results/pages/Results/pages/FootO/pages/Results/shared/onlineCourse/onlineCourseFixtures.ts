import {
  ProcessedRunnerModel,
  RadioSplitModel,
} from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../../../../../../../shared/constants.ts"
import {
  createMissingRadioFinish,
  createMissingRadioSplit,
} from "../../../Splits/components/FootOSplitsTable/shared/footOSplitsTableFunctions.ts"

interface RunnerFixture {
  finishTime?: string | null
  id?: string
  isNC?: boolean
  onlineSplits: RadioSplitModel[]
  position?: number
  startTime?: string | null
  statusCode?: string
}

/**
 * Builds the online split of the finish for tests.
 *
 * @param cumulativeSeconds Time since the start at the finish, or `null` without a reading.
 * @returns The finish split.
 */
export function buildFinishSplit(cumulativeSeconds: number | null): RadioSplitModel {
  return { ...createMissingRadioFinish(), cumulative_time: cumulativeSeconds }
}

/**
 * Builds the online split of a control for tests.
 *
 * @param station Station code of the control.
 * @param orderNumber Position of the control in the course, starting at 1.
 * @param cumulativeSeconds Time since the start at the control, or `null` without a reading.
 * @returns The online split.
 */
export function buildOnlineSplit(
  station: number,
  orderNumber: number,
  cumulativeSeconds: number | null,
): RadioSplitModel {
  return { ...createMissingRadioSplit(station, orderNumber), cumulative_time: cumulativeSeconds }
}

/**
 * Builds a runner for tests with only the fields the online course reads.
 *
 * @param fixture Online splits of the runner and, optionally, their result. By default the runner
 * has an OK status, no start time and has not finished.
 * @returns The runner.
 */
export function buildRunnerWithOnlineSplits({
  finishTime = null,
  id = "runner",
  isNC = false,
  onlineSplits,
  position = 0,
  startTime = null,
  statusCode = RESULT_STATUS.ok,
}: RunnerFixture): ProcessedRunnerModel {
  return {
    id,
    is_nc: isNC,
    overalls: null,
    stage: {
      finish_time: finishTime,
      online_splits: onlineSplits,
      position,
      start_time: startTime,
      status_code: statusCode,
    },
  } as ProcessedRunnerModel
}
