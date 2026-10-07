import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"
import {
  ProcessedRunnerModel,
  ProcessedSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../../../../shared/constants.ts"
import { parseResultStatus } from "../../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { hasChipDownload } from "../../../../../../../shared/functions.ts"
import {
  FINISH_LEG_ID,
  getRunnerTimeLossInfo,
  RunnerTimeLossInfo,
  TimeLossResults,
} from "../../../../../shared/timeLossAnalysis.ts"

export const NO_CLEAN_TIME_LABEL = "--"

const STATUSES_WITHOUT_CLEAN_TIME = [
  RESULT_STATUS_TEXT.mp,
  RESULT_STATUS_TEXT.dnf,
  RESULT_STATUS_TEXT.dsq,
  RESULT_STATUS_TEXT.dns,
  RESULT_STATUS_TEXT.ot,
]

export function calculateTotalLossTime(
  runner: ProcessedRunnerModel,
  timeLossResults: TimeLossResults | null,
): number {
  if (!timeLossResults) return 0

  const legIds = [...runner.stage.splits.map((split) => split.control?.id), FINISH_LEG_ID]
  const totalLoss = legIds.reduce((total, legId) => {
    const timeLossInfo = legId ? getRunnerTimeLossInfo(timeLossResults, runner.id, legId) : null
    return total + (timeLossInfo?.timeLoss ?? 0)
  }, 0)

  return Math.max(0, totalLoss)
}

export function getRunnerCleanTimeLabel(
  runner: ProcessedRunnerModel,
  timeLossResults: TimeLossResults | null,
): string {
  const raceTime = runner.stage.time_seconds
  const hasRaceTime = raceTime > 0
  if (!hasRaceTime) return ""
  if (STATUSES_WITHOUT_CLEAN_TIME.includes(getRunnerStatus(runner))) return NO_CLEAN_TIME_LABEL

  const cleanTime = raceTime - calculateTotalLossTime(runner, timeLossResults)
  return cleanTime > 0 ? parseSecondsToMMSS(cleanTime) : NO_CLEAN_TIME_LABEL
}

export function getRunnerStatus(runner: ProcessedRunnerModel): string {
  return parseResultStatus(runner.stage.status_code ?? "")
}

export function getSplitTimeLoss(
  runner: ProcessedRunnerModel,
  split: ProcessedSplitModel,
  timeLossResults: TimeLossResults | null,
): RunnerTimeLossInfo | null {
  if (!timeLossResults || !split.control?.id) return null
  return getRunnerTimeLossInfo(timeLossResults, runner.id, split.control.id)
}

export function isRunnerNotCompeting(runner: ProcessedRunnerModel): boolean {
  return Boolean(runner.is_nc) || getRunnerStatus(runner) === RESULT_STATUS_TEXT.nc
}

export function isRunnerOkOrNotCompeting(runner: ProcessedRunnerModel): boolean {
  const status = getRunnerStatus(runner)
  return status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
}

export function showsRunnerTimeBehind(runner: ProcessedRunnerModel): boolean {
  return (
    isRunnerOkOrNotCompeting(runner) && runner.stage.finish_time != null && hasChipDownload(runner)
  )
}
