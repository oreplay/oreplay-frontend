import {
  PatchRankingSettingsBody,
  PostListRankingSettingsBody,
  Ranking,
} from "./types/v1api"
import {
  parseOverallSettings,
  serializeOverallSettings,
} from "./overallSettings.ts"
import { parseStatusScores, serializeStatusScores } from "./statusScores.ts"

function toNullableNumber(value: number | null | undefined): number | null {
  return value === null || value === undefined ? null : Number(value)
}

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

export function toRankingPostBody(
  ranking: Ranking,
  state: RankingSettingsFormState,
): PostListRankingSettingsBody {
  return {
    event_id: ranking.event_id,
    stage_id: ranking.stage_id,
    max_points: state.maxPoints ?? 0,
    round_precision: state.roundPrecision,
    scoring_algorithm: state.scoringAlgorithm,
  }
}

export function isRankingSettingsFormComplete(
  state: RankingSettingsFormState,
): boolean {
  return (
    state.title.trim().length > 0 &&
    state.scoringAlgorithm.length > 0 &&
    state.maxPoints !== null
  )
}
