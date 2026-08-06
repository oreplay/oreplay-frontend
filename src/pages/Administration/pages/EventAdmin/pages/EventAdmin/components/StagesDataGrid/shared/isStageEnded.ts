import { StageModel, StateLogConst } from "../../../../../../../../../shared/EntityTypes.ts"

export function isStageEnded(stages: StageModel[], stageId: string): boolean {
  const stage = stages.find((candidate) => candidate.id === stageId)
  return Boolean(stage?.last_logs?.some((log) => log.state === StateLogConst.ENDED))
}
