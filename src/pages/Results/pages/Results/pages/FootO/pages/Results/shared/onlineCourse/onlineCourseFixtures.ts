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

export function buildFinishSplit(cumulativeSeconds: number | null): RadioSplitModel {
  return { ...createMissingRadioFinish(), cumulative_time: cumulativeSeconds }
}

export function buildOnlineSplit(
  station: number,
  orderNumber: number,
  cumulativeSeconds: number | null,
): RadioSplitModel {
  return { ...createMissingRadioSplit(station, orderNumber), cumulative_time: cumulativeSeconds }
}

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
