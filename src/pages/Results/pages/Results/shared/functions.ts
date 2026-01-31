import { RunnerModel, RunnerResultModel } from "../../../../../shared/EntityTypes.ts"
import {
  ProcessedRunnerModel,
  ProcessedRunnerResultModel,
} from "../../../components/VirtualTicket/shared/EntityTypes.ts"
import { UPLOAD_TYPES } from "./constants.ts"
import { RESULT_STATUS } from "../../../shared/constants.ts"

/** Check if a runner has a final result
 *
 * A result is considered final if the runner has downloaded the chip and has
 * gone throw code checks. It means, that the result came from a SplitTimes file
 * not an intermediate results file
 *
 * @param runner Runner we want to check
 */
export function hasChipDownload(
  runner: RunnerModel | ProcessedRunnerModel | RunnerResultModel | ProcessedRunnerResultModel,
): boolean {
  let uploadType: string
  if (isRunnerModel(runner)) uploadType = runner.stage.upload_type
  else {
    uploadType = runner.upload_type
  }

  switch (uploadType) {
    case UPLOAD_TYPES.START_TIMES:
      return false

    case UPLOAD_TYPES.ENTRY_LIST:
      return false

    case UPLOAD_TYPES.ONLINE_SPLITS:
      return false

    case UPLOAD_TYPES.SPLIT_RESULT:
      return true

    case UPLOAD_TYPES.FINAL_RESULT:
      return true

    default:
      throw new Error(`Unknown upload_type ${uploadType}`)
  }
}

/**
 * Auxiliary type predicative
 * @param runner
 */
function isRunnerModel(
  runner: RunnerModel | ProcessedRunnerModel | RunnerResultModel | ProcessedRunnerResultModel,
): runner is RunnerModel | ProcessedRunnerModel {
  return "stage" in runner
}

/**
 * Check if a runner has "no classify" status
 *
 * @param runner The runner to be checked
 */
export function isRunnerNC(runner: RunnerModel | ProcessedRunnerModel): boolean {
  return runner.stage?.status_code === RESULT_STATUS.nc || runner.is_nc //TODO: Handle ranking runners
}

/**
 * Find if a wrong IOF XML file created a result in any of this runners
 *
 * Wrong files are those that upload final results without splits
 * @param runnerList List of runners to check
 */
export function isWrongFileUploaded(runnerList: RunnerModel[] | ProcessedRunnerModel[]): boolean {
  const filteredRunners: (RunnerModel | ProcessedRunnerModel)[] = runnerList.filter(
    (runner) => runner.stage.upload_type === UPLOAD_TYPES.FINAL_RESULT,
  )

  return filteredRunners.length !== 0 && runnerList.length !== 0
}

/**
 * This is a helper function targeting development debugging for animations
 * @param array
 */
export function shuffleInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
