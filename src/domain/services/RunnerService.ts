import {
  ProcessedParticipantModel,
  ProcessedRunnerModel,
} from "../../pages/Results/components/VirtualTicket/shared/EntityTypes.ts"
import { TFunction } from "i18next"
import { ParticipantModel, RunnerModel } from "../../shared/EntityTypes.ts"
import { RESULT_STATUS, RESULT_STATUS_TEXT } from "../../pages/Results/shared/constants.ts"
import { isRunnerNC } from "../../pages/Results/pages/Results/shared/functions.ts"
import { DateTime } from "luxon"

const getClubName = (
  runner: ProcessedRunnerModel,
  t: TFunction<"translation", undefined>,
): string => {
  const noClubMsg: string = t("ResultsStage.NoClubMsg")
  return runner.club ? runner.club.short_name : noClubMsg
}

const compareLegNumber = (
  a: ParticipantModel | ProcessedParticipantModel,
  b: ParticipantModel | ProcessedParticipantModel,
): number => {
  return (a?.stage?.leg_number || 0) - (b?.stage?.leg_number || 0)
}

const getClassName = (runner: ProcessedRunnerModel) => {
  return runner.class.short_name
}

const isDNS = (runner: ProcessedParticipantModel | ParticipantModel) =>
  runner.stage?.status_code === RESULT_STATUS.dns //TODO: Handle ranking runners

const isNC = (runner: ProcessedRunnerModel | RunnerModel): boolean => {
  return isRunnerNC(runner) // TODO: Move this logic here
}

const isOK = (runner: ProcessedRunnerModel | RunnerModel) =>
  runner.stage.status_code === RESULT_STATUS.ok ||
  runner.stage.status_code === RESULT_STATUS_TEXT.ok ||
  runner.overalls?.overall.status_code === RESULT_STATUS.ok

/**
 * Check if a runner has finished
 * @param runner The runner we want to check
 */
function hasFinished(runner: RunnerModel | ProcessedRunnerModel): boolean {
  if (!runner.stage) return false
  return (
    !!runner.stage.finish_time ||
    runner.stage.position != 0 ||
    runner.stage.status_code !== RESULT_STATUS.ok
  )
}

/**
 * Check if a runner have started or not. If a runner doesn't have a start time it will be considered
 * that haven't started. If it hasFinished it will always be considered it started.
 * @param runner The runner we want to check
 * @param now The current time. If not provided `DateTime.now()` is invoked
 */
function hasStarted(runner: RunnerModel | ProcessedRunnerModel, now?: DateTime<true>): boolean {
  // Finished
  if (hasFinished(runner)) {
    return true
  }

  // Not finished
  if (runner.stage.start_time) {
    const usedNow = now !== undefined ? now : DateTime.now()

    return usedNow > DateTime.fromISO(runner.stage.start_time)
  }
  return false // If runner doesn't have start time it looks like never starts
}

export const runnerService = {
  getClubName,
  getClassName,
  compareLegNumber,
  isDNS,
  isNC,
  isOK,
  hasFinished,
  hasStarted,
}
