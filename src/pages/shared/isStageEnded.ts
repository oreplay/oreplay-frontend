import { StageModel, StateLogConst } from "../../shared/EntityTypes.ts"

export function isStageEnded(stage?: StageModel): boolean {
  return Boolean(stage?.last_logs?.some((log) => log.state === StateLogConst.ENDED))
}

export function isStageEndedById(stages: StageModel[], stageId: string): boolean {
  return isStageEnded(stages.find((candidate) => candidate.id === stageId))
}
