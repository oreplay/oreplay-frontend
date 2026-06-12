import { useQuery, UseQueryResult } from "react-query"
import { ArrayRankingsNsRanking } from "./types.ts"

/*
 * Mock of the orval-generated `useGetListRankingList` hook.
 *
 * The signature matches the real one (a react-query hook resolving to
 * `ArrayRankingsNsRanking`), so when `@oreplay/api-client` is published the
 * Vite/tsconfig alias is removed and consumers keep importing the same name.
 */

const MOCK_RESPONSE: ArrayRankingsNsRanking = {
  data: [
    {
      id: "regional-2026",
      event_id: "evt-1",
      stage_id: "stg-1",
      scoring_algorithm: "top_n",
      max_points: 100,
      round_precision: 2,
      nc_true: 0,
      nc_false: null,
      status_scores: "default",
      excluded_class_names: "",
      created: "2026-01-10T10:00:00Z",
      modified: "2026-05-20T10:00:00Z",
      overall_settings: {
        maxRacesCounted: 6,
        minPointsAsOrg: 20,
        organizerScoringFraction: 0.8,
        totalCircuitRaces: 10,
      },
    },
    {
      id: "national-2026",
      event_id: "evt-2",
      stage_id: "stg-2",
      scoring_algorithm: "cumulative",
      max_points: 1000,
      round_precision: 0,
      nc_true: 0,
      nc_false: null,
      status_scores: "default",
      excluded_class_names: "",
      created: "2026-02-01T08:30:00Z",
      modified: "2026-06-01T08:30:00Z",
      overall_settings: {
        maxRacesCounted: 10,
      },
    },
  ],
}

export function useGetListRankingList(): UseQueryResult<
  ArrayRankingsNsRanking,
  unknown
> {
  return useQuery(
    ["/api/v1/rankings/"],
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return MOCK_RESPONSE
    },
    { refetchOnWindowFocus: false },
  )
}
