import { StageModel } from "../../../../../../../../../shared/EntityTypes.ts"

export const NO_STAGE_SELECTED = ""

export function defaultStageId(stages: StageModel[]): string {
  return stages.length === 1 ? stages[0].id : NO_STAGE_SELECTED
}

export function selectedStageId(stages: StageModel[], chosenStageId: string): string {
  const isChosenStillAvailable = stages.some((stage) => stage.id === chosenStageId)
  return isChosenStillAvailable ? chosenStageId : defaultStageId(stages)
}
