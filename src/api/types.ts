/*
 * Temporary local mirror of the ranking types that will come from
 * `@oreplay/api-client` (orval-generated from the backend OpenAPI spec).
 *
 * Kept byte-compatible with the generated `RankingsNsRanking` so swapping the
 * alias for the real package is a no-op for consumers.
 */

export interface RankingsNsRankingOverallSettings {
  maxRacesCounted?: number
  minPointsAsOrg?: number
  organizerScoringFraction?: number
  totalCircuitRaces?: number
}

export interface RankingsNsRanking {
  created: string
  event_id: string
  excluded_class_names: string
  id: string
  max_points: number
  modified: string
  nc_false?: string | null
  nc_true: number
  overall_settings: RankingsNsRankingOverallSettings
  round_precision: number
  scoring_algorithm: string
  stage_id: string
  status_scores: string
}

export interface ArrayRankingsNsRanking {
  data: RankingsNsRanking[]
}
