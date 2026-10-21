import { describe, expect, it } from "vitest"
import { ROGAINE_POINTS_TABLE_COLUMN_KIND } from "./rogainePointsTableColumns.ts"
import { buildRogaineRunnerFixture } from "./rogainePointsTableFixtures.ts"
import { getRogaineScoreLabel, hasRogaineScore } from "./rogainePointsTableRunner.ts"

const SCORED_RUNNER = buildRogaineRunnerFixture("anna", {
  pointsBonus: 20,
  pointsFinal: 150,
  pointsPenalty: -10,
})
const RUNNER_ON_COURSE = buildRogaineRunnerFixture("bea", { finishTime: null })

describe("hasRogaineScore", () => {
  it("is true for a runner who finished", () => {
    expect(hasRogaineScore(SCORED_RUNNER)).toBe(true)
  })

  it("is true for a runner with points but no finish time", () => {
    const runner = buildRogaineRunnerFixture("anna", { finishTime: null, pointsFinal: 40 })

    expect(hasRogaineScore(runner)).toBe(true)
  })

  it("is false for a runner still on the course", () => {
    expect(hasRogaineScore(RUNNER_ON_COURSE)).toBe(false)
  })
})

describe("getRogaineScoreLabel", () => {
  it("shows the bonus with a leading plus sign", () => {
    expect(getRogaineScoreLabel(SCORED_RUNNER, ROGAINE_POINTS_TABLE_COLUMN_KIND.Bonus)).toBe("+20")
  })

  it("shows the penalty", () => {
    expect(getRogaineScoreLabel(SCORED_RUNNER, ROGAINE_POINTS_TABLE_COLUMN_KIND.Penalty)).toBe(
      "-10",
    )
  })

  it("shows the final points", () => {
    expect(getRogaineScoreLabel(SCORED_RUNNER, ROGAINE_POINTS_TABLE_COLUMN_KIND.Points)).toBe("150")
  })

  it("is empty for a runner without a score yet", () => {
    expect(getRogaineScoreLabel(RUNNER_ON_COURSE, ROGAINE_POINTS_TABLE_COLUMN_KIND.Points)).toBe("")
  })
})
