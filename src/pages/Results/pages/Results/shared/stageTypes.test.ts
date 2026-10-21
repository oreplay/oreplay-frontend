import { describe, expect, it } from "vitest"
import { StageModel } from "../../../../../shared/EntityTypes.ts"
import { STAGE_DESTINATION, STAGE_TYPE_DATABASE_ID } from "./constants.ts"
import { getStageDestination, isTrailOStage } from "./stageTypes.ts"

const TRAIL_O_RESULTS_URL = "https://top.yq.cz/results/123"

function buildStage(stageTypeId: string, externalUrl: string | null): StageModel {
  return {
    id: "stage-id",
    description: "Stage",
    external_url: externalUrl,
    last_logs: [],
    stage_type: { id: stageTypeId, description: "Trail-O" },
    start: null,
  }
}

describe("getStageDestination", () => {
  it("sends a Trail-O stage to its external results", () => {
    const stage = buildStage(STAGE_TYPE_DATABASE_ID.TrailO, TRAIL_O_RESULTS_URL)
    expect(getStageDestination(stage)).toEqual({
      kind: STAGE_DESTINATION.ExternalResults,
      url: TRAIL_O_RESULTS_URL,
    })
  })

  it("adds the protocol when the Trail-O results URL has none", () => {
    const stage = buildStage(STAGE_TYPE_DATABASE_ID.TrailO, "jaruori.es/results")
    expect(getStageDestination(stage)).toEqual({
      kind: STAGE_DESTINATION.ExternalResults,
      url: "https://jaruori.es/results",
    })
  })

  it("flags a Trail-O stage whose results URL is not set", () => {
    const missing = { kind: STAGE_DESTINATION.MissingExternalResults }
    expect(getStageDestination(buildStage(STAGE_TYPE_DATABASE_ID.TrailO, null))).toEqual(missing)
    expect(getStageDestination(buildStage(STAGE_TYPE_DATABASE_ID.TrailO, ""))).toEqual(missing)
  })

  it("opens the stage results for any other stage type, even with an external URL", () => {
    const stage = buildStage(STAGE_TYPE_DATABASE_ID.FootO, TRAIL_O_RESULTS_URL)
    expect(getStageDestination(stage)).toEqual({ kind: STAGE_DESTINATION.StageResults })
  })
})

describe("isTrailOStage", () => {
  it("is true for a Trail-O stage", () => {
    expect(isTrailOStage(STAGE_TYPE_DATABASE_ID.TrailO)).toBe(true)
  })

  it("is false for any other stage type", () => {
    expect(isTrailOStage(STAGE_TYPE_DATABASE_ID.FootO)).toBe(false)
    expect(isTrailOStage(STAGE_TYPE_DATABASE_ID.Totals)).toBe(false)
  })

  it("is false when the stage has no type yet", () => {
    expect(isTrailOStage(null)).toBe(false)
    expect(isTrailOStage(undefined)).toBe(false)
  })
})
