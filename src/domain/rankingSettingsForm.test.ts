import { describe, expect, it } from "vitest"
import { Ranking } from "./types/v1api"
import {
  initRankingSettingsForm,
  toRankingPatchBody,
} from "./rankingSettingsForm.ts"

const ranking = {
  id: "r1",
  event_id: "e1",
  stage_id: "s1",
  scoring_algorithm: "algo",
  max_points: 100,
  round_precision: 0,
  nc_true: 5,
  nc_false: null,
  status_scores: "[null,0,10,10,0,10]",
  overall_settings: {
    totalCircuitRaces: 9,
    maxRacesCounted: 5,
    organizerScoringFraction: 0.3,
    minPointsAsOrg: 50,
  },
  excluded_class_names: null,
  status_scores_: undefined,
  created: "",
  modified: "",
  _links: {} as Ranking["_links"],
} as Ranking

describe("ranking settings form", () => {
  it("initialises positional state from the ranking", () => {
    const state = initRankingSettingsForm(ranking)
    expect(state.statusScores).toEqual([null, 0, 10, 10, 0, 10])
    expect(state.overallSettings).toEqual([9, 5, 0.3, 50])
    expect(state.ncTrue).toBe(5)
    expect(state.ncFalse).toBeNull()
  })

  it("serializes edits back into the patch body", () => {
    const state = initRankingSettingsForm(ranking)
    const body = toRankingPatchBody(ranking, {
      ...state,
      maxPoints: 200,
      statusScores: [null, 1, 2, 3, 4, 5],
    })
    expect(body.max_points).toBe(200)
    expect(body.status_scores).toBe("[null,1,2,3,4,5]")
    expect(body.overall_settings).toBe(
      JSON.stringify({
        totalCircuitRaces: 9,
        maxRacesCounted: 5,
        organizerScoringFraction: 0.3,
        minPointsAsOrg: 50,
      }),
    )
    expect(body.nc_true).toBe(5)
    // Empty nc is sent through as null (clears the nullable column), not 0.
    expect(body.nc_false).toBeNull()
  })
})
