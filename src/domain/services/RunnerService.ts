import { ProcessedRunnerModel } from "../../pages/Results/components/VirtualTicket/shared/EntityTypes.ts"
import { TFunction } from "i18next"

const getClubName = (
  runner: ProcessedRunnerModel,
  t: TFunction<"translation", undefined>,
): string => {
  const noClubMsg: string = t("ResultsStage.NoClubMsg")
  return runner.club ? runner.club.short_name : noClubMsg
}

export const runnerService = {
  getClubName,
}
