import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

export default function hasOnlineControls(runner: ProcessedRunnerModel): boolean {
  const onlineSplits = runner.stage.online_splits ?? []
  return onlineSplits.length > 0
}
