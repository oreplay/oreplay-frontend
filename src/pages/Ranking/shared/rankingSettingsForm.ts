import {
  PatchRankingSettingsBody,
  PostListRankingSettingsBody,
  Ranking,
} from "../../../domain/types/v1api"
import {
  DEFAULT_OVERALL_SETTINGS,
  parseOverallSettings,
  serializeOverallSettings,
} from "./overallSettings.ts"
import { DEFAULT_STATUS_SCORES, parseStatusScores, serializeStatusScores } from "./statusScores.ts"
import { DEFAULT_SCORING_ALGORITHM } from "./scoringAlgorithm.ts"
import { ROUND_DOWN_TO_INTEGER } from "./roundPrecision.ts"
import { formatClassNames, parseClassNames } from "./classNames.ts"

const DEFAULT_MAX_POINTS = 100
const DEFAULT_FLAGGED_NC_SCORE = 0

function toNullableNumber(value: number | null | undefined): number | null {
  return value === null || value === undefined ? null : Number(value)
}

export interface RankingSettingsFormState {
  title: string
  includedClassNames: string
  scoringAlgorithm: string
  maxPoints: number | null
  roundPrecision: number
  ncTrue: number | null
  ncFalse: number | null
  statusScores: (number | null)[]
  overallSettings: (number | null)[]
}

/** The event/stage a ranking body points at — all `toRankingBody` reads from its source. */
export interface RankingBodyContext {
  event_id: string
  stage_id: string
  excluded_class_names?: string | null
}

export function initRankingSettingsForm(ranking: Ranking): RankingSettingsFormState {
  return {
    title: ranking.title ?? "",
    includedClassNames: formatClassNames(ranking.included_class_names),
    scoringAlgorithm: ranking.scoring_algorithm,
    maxPoints: ranking.max_points,
    roundPrecision: ranking.round_precision,
    ncTrue: toNullableNumber(ranking.nc_true),
    ncFalse: toNullableNumber(ranking.nc_false),
    statusScores: parseStatusScores(ranking.status_scores),
    overallSettings: parseOverallSettings(ranking.overall_settings),
  }
}

export function defaultRankingSettingsForm(): RankingSettingsFormState {
  return {
    title: "",
    includedClassNames: "",
    scoringAlgorithm: DEFAULT_SCORING_ALGORITHM,
    maxPoints: DEFAULT_MAX_POINTS,
    roundPrecision: ROUND_DOWN_TO_INTEGER,
    ncTrue: DEFAULT_FLAGGED_NC_SCORE,
    ncFalse: null,
    statusScores: [...DEFAULT_STATUS_SCORES],
    overallSettings: [...DEFAULT_OVERALL_SETTINGS],
  }
}

export function toRankingBody(
  context: RankingBodyContext,
  state: RankingSettingsFormState,
  id: string,
): PatchRankingSettingsBody
export function toRankingBody(
  context: RankingBodyContext,
  state: RankingSettingsFormState,
): PostListRankingSettingsBody
export function toRankingBody(
  context: RankingBodyContext,
  state: RankingSettingsFormState,
  id?: string,
): PatchRankingSettingsBody | PostListRankingSettingsBody {
  return {
    ...(id === undefined ? {} : { id }),
    title: state.title,
    event_id: context.event_id,
    stage_id: context.stage_id,
    excluded_class_names: context.excluded_class_names ?? "",
    included_class_names: parseClassNames(state.includedClassNames),
    max_points: state.maxPoints ?? 0,
    nc_true: state.ncTrue as number,
    nc_false: state.ncFalse as number,
    round_precision: state.roundPrecision,
    scoring_algorithm: state.scoringAlgorithm,
    status_scores: serializeStatusScores(state.statusScores),
    overall_settings: serializeOverallSettings(state.overallSettings),
  }
}

export function isRankingSettingsFormComplete(state: RankingSettingsFormState): boolean {
  return (
    state.title.trim().length > 0 && state.scoringAlgorithm.length > 0 && state.maxPoints !== null
  )
}
