import { RunnerModel } from "../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../components/VirtualTicket/shared/EntityTypes.ts"
import { UPLOAD_TYPES } from "./constants.ts"

/** Check if a runner has a final result
 *
 * A result is considered final if the runner has downloaded the chip and has
 * gone throw code checks. It means, that the result came from a SplitTimes file
 * not an intermediate results file
 *
 * @param runner Runner we want to check
 */
export function hasChipDownload(runner: RunnerModel | ProcessedRunnerModel): boolean {
  switch (runner.overall.upload_type) {
    case UPLOAD_TYPES.START_TIMES:
      return false

    case UPLOAD_TYPES.ONLINE_SPLITS:
      return false

    case UPLOAD_TYPES.FINAL_RESULT:
      return true

    default:
      throw new Error(`Unknown upload_type ${runner.overall.upload_type}`)
  }
}
