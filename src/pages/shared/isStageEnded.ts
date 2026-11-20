import { StageModel } from "../../shared/EntityTypes.ts"

/**
 * Tells whether a stage's results are official: the backend reports when they were last made final
 * and clears that date when they are made provisional again.
 * @param stage The stage to check, or `undefined` when it is not loaded or not found.
 * @returns `true` when the stage has a final date.
 */
export function isStageEnded(stage?: StageModel): boolean {
  return Boolean(stage?.last_dates?.final)
}

/**
 * Tells whether the stage with the given id has official results.
 * @param stages The stages to search, usually every stage of the event.
 * @param stageId Id of the stage to check.
 * @returns `true` when the stage is listed and its results are official.
 */
export function isStageEndedById(stages: StageModel[], stageId: string): boolean {
  return isStageEnded(stages.find((candidate) => candidate.id === stageId))
}
