import { PatchRankingSettingsBody, Ranking } from "./types/v1api"
import {
  parseOverallSettings,
  serializeOverallSettings,
} from "./overallSettings.ts"
import { parseStatusScores, serializeStatusScores } from "./statusScores.ts"

/**
 * Normalize a nullable numeric column to `number | null`, keeping `0` and `null`
 * distinct. Coerces with `Number` so a decimal-string `"0.0000"` (how the
 * backend may serialize the column) becomes `0`, not a string that fails to
 * match the select's `0` option.
 */
function toNullableNumber(value: number | null | undefined): number | null {
  return value === null || value === undefined ? null : Number(value)
}

/**
 * Editable state of the ranking settings form. `statusScores` and
 * `overallSettings` are kept as positional arrays matching `STATUS_SCORE_FIELDS`
 * / `OVERALL_SETTINGS_FIELDS`; `null` means "empty / no override".
 */
export interface RankingSettingsFormState {
  title: string
  scoringAlgorithm: string
  maxPoints: number | null
  roundPrecision: number
  ncTrue: number | null
  ncFalse: number | null
  statusScores: (number | null)[]
  overallSettings: (number | null)[]
}

export function initRankingSettingsForm(
  ranking: Ranking,
): RankingSettingsFormState {
  return {
    title: ranking.title ?? "",
    scoringAlgorithm: ranking.scoring_algorithm,
    maxPoints: ranking.max_points,
    roundPrecision: ranking.round_precision,
    ncTrue: toNullableNumber(ranking.nc_true),
    ncFalse: toNullableNumber(ranking.nc_false),
    statusScores: parseStatusScores(ranking.status_scores),
    overallSettings: parseOverallSettings(ranking.overall_settings),
  }
}

/**
 * The PATCH endpoint expects the full entity; resend it with the edited fields
 * overlaid. `overall_settings`/`status_scores` are strings on the body, so they
 * are serialized. The generated body types `nc_*` as non-nullable numbers, but
 * the columns are nullable and the "empty" choice must clear them — so we pass
 * `null` through (cast to satisfy the generated type).
 */
export function toRankingPatchBody(
  ranking: Ranking,
  state: RankingSettingsFormState,
): PatchRankingSettingsBody {
  return {
    id: ranking.id,
    title: state.title,
    event_id: ranking.event_id,
    stage_id: ranking.stage_id,
    excluded_class_names: ranking.excluded_class_names ?? "",
    max_points: state.maxPoints ?? 0,
    nc_true: state.ncTrue as number,
    nc_false: state.ncFalse as number,
    round_precision: state.roundPrecision,
    scoring_algorithm: state.scoringAlgorithm,
    status_scores: serializeStatusScores(state.statusScores),
    overall_settings: serializeOverallSettings(state.overallSettings),
  }
}
