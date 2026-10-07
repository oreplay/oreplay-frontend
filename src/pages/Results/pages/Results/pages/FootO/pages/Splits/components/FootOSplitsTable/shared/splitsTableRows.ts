import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { runnerService } from "../../../../../../../../../../../domain/services/RunnerService.ts"
import {
  ProcessedRunnerModel,
  ProcessedSplitModel,
  RadioSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../../../shared/functions.ts"
import { getOnlineSplits } from "./footOSplitsTableFunctions.ts"

export type SplitsTableRow = {
  runner: ProcessedRunnerModel
  splits: readonly ProcessedSplitModel[]
}

export function buildSplitsTableRows(
  runners: readonly ProcessedRunnerModel[],
  onlyRadios: boolean,
  radiosList: OnlineControlModel[],
): SplitsTableRow[] {
  return runners.map((runner) => ({
    runner,
    splits: onlyRadios
      ? getOnlineSplits(runner.stage.splits, radiosList, runner.stage.start_time)
      : runner.stage.splits,
  }))
}

export function getSplitsTableRowKey(row: SplitsTableRow): string {
  return row.runner.id
}

export function isRadioSplit(split: ProcessedSplitModel): split is RadioSplitModel {
  return "is_next" in split
}

export function selectRunnersForSplitsTable(
  runners: readonly ProcessedRunnerModel[],
  onlyRadios: boolean,
): ProcessedRunnerModel[] {
  const startedRunners = runners.filter((runner) => !runnerService.isDNS(runner))
  return onlyRadios ? startedRunners : startedRunners.filter((runner) => hasChipDownload(runner))
}
