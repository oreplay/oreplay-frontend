import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

/**
 * Tells whether a runner has an online course to draw.
 *
 * @param runner Runner to check.
 * @returns `true` when the runner has at least one online split.
 */
export default function hasOnlineControls(runner: ProcessedRunnerModel): boolean {
  const onlineSplits = runner.stage.online_splits ?? []
  return onlineSplits.length > 0
}
