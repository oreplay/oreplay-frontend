import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

export interface StageLeaderData {
  stageId: string
  bestTime?: number
  bestPoints?: number
}

/**
 * Calculate the best time and points for each stage across all runners
 * Only consider valid times and positions
 */
export function calculateStageLeaders(runners: ProcessedRunnerModel[]): StageLeaderData[] {
  if (!runners || runners.length === 0) return []

  const stageMap = new Map<string, { bestTime?: number; bestPoints?: number }>()

  // Iterate through all runners and their stage results
  runners.forEach((runner) => {
    runner.overalls?.parts?.forEach((stage) => {
      // Use stage_order as the key instead of stage.id to group properly
      const stageKey = stage.stage_order ? `stage_${stage.stage_order}` : stage.id
      const existing = stageMap.get(stageKey) || {}

      // Update best time (lower is better) - only consider valid times and positions > 0
      if (stage.time_seconds && stage.time_seconds > 0 && stage.position && stage.position > 0) {
        if (!existing.bestTime || stage.time_seconds < existing.bestTime) {
          existing.bestTime = stage.time_seconds
        }
      }

      // Update best points (higher is better)
      if (stage.points_final !== null && stage.points_final !== undefined) {
        if (existing.bestPoints === undefined || stage.points_final > existing.bestPoints) {
          existing.bestPoints = stage.points_final
        }
      }

      stageMap.set(stageKey, existing)
    })
  })

  // Convert map to array
  return Array.from(stageMap.entries()).map(([stageId, data]) => ({
    stageId,
    bestTime: data.bestTime,
    bestPoints: data.bestPoints,
  }))
}
