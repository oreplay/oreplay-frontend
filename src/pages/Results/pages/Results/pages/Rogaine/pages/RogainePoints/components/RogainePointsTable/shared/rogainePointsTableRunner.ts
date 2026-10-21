import { formatScoreAsInteger } from "../../../../../../../../../../../shared/Functions.tsx"
import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  ROGAINE_POINTS_TABLE_COLUMN_KIND,
  RogainePointsTableScoreColumn,
} from "./rogainePointsTableColumns.ts"

/**
 * Whether a runner already has a score to show: either some final points or a finish time.
 *
 * @param runner The runner to check.
 * @returns `false` for a runner still out on the course or who has not started.
 */
export function hasRogaineScore(runner: ProcessedRunnerModel): boolean {
  return Boolean(runner.stage.points_final || runner.stage.finish_time)
}

/**
 * Text of a score cell of the rogaine points table: bonus (with a leading `+`), penalty or
 * final points.
 *
 * @param runner The runner whose score is shown.
 * @param kind Which score the cell shows.
 * @returns The formatted score, or an empty string when the runner has no score yet.
 */
export function getRogaineScoreLabel(
  runner: ProcessedRunnerModel,
  kind: RogainePointsTableScoreColumn["kind"],
): string {
  if (!hasRogaineScore(runner)) return ""

  const result = runner.stage
  if (kind === ROGAINE_POINTS_TABLE_COLUMN_KIND.Bonus) {
    return `+${formatScoreAsInteger(result.points_bonus)}`
  }
  if (kind === ROGAINE_POINTS_TABLE_COLUMN_KIND.Penalty) {
    return formatScoreAsInteger(result.points_penalty)
  }
  return formatScoreAsInteger(result.points_final)
}
