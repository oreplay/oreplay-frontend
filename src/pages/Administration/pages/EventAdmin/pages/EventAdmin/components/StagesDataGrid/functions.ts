import { STAGE_TYPE_DATABASE_ID } from "../../../../../../../Results/pages/Results/shared/constants.ts"

const stageTypesWithoutStart = [STAGE_TYPE_DATABASE_ID.Totals]

export function isStartApplicable(stageTypeId: string | null) {
  return !stageTypeId || !stageTypesWithoutStart.includes(stageTypeId)
}
