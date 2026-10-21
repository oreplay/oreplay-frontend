import { StageModel } from "../../../../../shared/EntityTypes.ts"
import { parseWebsiteUrl } from "../../../shared/websiteUrl.ts"
import { STAGE_DESTINATION, STAGE_TYPE_DATABASE_ID } from "./constants.ts"

export type StageDestination =
  | { kind: typeof STAGE_DESTINATION.ExternalResults; url: string }
  | { kind: typeof STAGE_DESTINATION.MissingExternalResults }
  | { kind: typeof STAGE_DESTINATION.StageResults }

export function getStageDestination(stage: StageModel): StageDestination {
  if (!isTrailOStage(stage.stage_type.id)) {
    return { kind: STAGE_DESTINATION.StageResults }
  }
  const externalUrl = parseWebsiteUrl(stage.external_url)
  if (!externalUrl) {
    return { kind: STAGE_DESTINATION.MissingExternalResults }
  }
  return { kind: STAGE_DESTINATION.ExternalResults, url: externalUrl.toString() }
}

/**
 * Whether a stage is Trail-O, whose results are published on TOP or Jaruori instead of O-Replay.
 *
 * @param stageTypeId Type of the stage; `null` or `undefined` while a new stage has none yet.
 * @returns `true` only for the Trail-O stage type.
 */
export function isTrailOStage(stageTypeId: string | null | undefined): boolean {
  return stageTypeId === STAGE_TYPE_DATABASE_ID.TrailO
}
