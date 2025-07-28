import {
  ProcessedParticipantModel,
  ProcessedRunnerModel,
} from "../../pages/Results/components/VirtualTicket/shared/EntityTypes.ts"
import { TFunction } from "i18next"
import { ParticipantModel, RunnerModel } from "../../shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../pages/Results/shared/constants.ts"
import { isRunnerNC } from "../../pages/Results/pages/Results/shared/functions.ts"

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

export const runnerService = {
  getClubName,
  getClassName,
  compareLegNumber,
  isDNS,
  isNC,
}
