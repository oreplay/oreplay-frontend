import { ProcessedRunnerModel } from "../../pages/Results/components/VirtualTicket/shared/EntityTypes.ts"
import { TFunction } from "i18next"
import { RunnerModel } from "../../shared/EntityTypes.ts"

const getClubName = (
  runner: ProcessedRunnerModel,
  t: TFunction<"translation", undefined>,
): string => {
  const noClubMsg: string = t("ResultsStage.NoClubMsg")
  return runner.club ? runner.club.short_name : noClubMsg
}

const compareLegNumber = (a: RunnerModel, b: RunnerModel): number => {
  return (a?.overall?.leg_number || 0) - (b?.overall?.leg_number || 0)
}

const getClassName = (runner: ProcessedRunnerModel) => {
  return runner.class.short_name
}

export const runnerService = {
  getClubName,
  getClassName,
  compareLegNumber,
}
