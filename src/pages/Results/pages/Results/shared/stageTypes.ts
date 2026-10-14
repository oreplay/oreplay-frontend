import { STAGE_TYPE_DATABASE_ID } from "./constants.ts"

/**
 * Whether a stage is Trail-O, whose results are published on TOP or Jaruori instead of O-Replay.
 *
 * @param stageTypeId Type of the stage; `null` or `undefined` while a new stage has none yet.
 * @returns `true` only for the Trail-O stage type.
 */
export function isTrailOStage(stageTypeId: string | null | undefined): boolean {
  return stageTypeId === STAGE_TYPE_DATABASE_ID.TrailO
}
