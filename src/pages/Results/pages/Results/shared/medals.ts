import { runnerService } from "../../../../../domain/services/RunnerService.ts"
import { UPLOAD_TYPES } from "./constants.ts"

export const MEDALS = ["gold", "silver", "bronze"] as const
export type Medal = (typeof MEDALS)[number]

type MedalCandidate = Parameters<typeof runnerService.isOK>[0]

export function canWinMedal(runner: MedalCandidate): boolean {
  const hasSplitsReading = runner.stage.upload_type === UPLOAD_TYPES.SPLIT_RESULT
  return hasSplitsReading && runnerService.isOK(runner)
}

export function medalForPosition(
  position: number | bigint | null,
  isMedalEligible: boolean,
): Medal | null {
  if (position === null || !isMedalEligible) return null

  const medalIndex = Number(position) - 1
  const isMedalPosition = Number.isInteger(medalIndex) && medalIndex >= 0
  return isMedalPosition && medalIndex < MEDALS.length ? MEDALS[medalIndex] : null
}
