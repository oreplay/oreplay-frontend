import { describe, expect, it } from "vitest"
import { buildLegFixture, buildTeamFixture } from "./relayFixtures.ts"
import {
  findLeg,
  legAsRunner,
  legNumbersOf,
  legRunnersOf,
  teamNamesByLegRunnerId,
} from "./relayLegs.ts"

const TEAM_START = "2025-10-26T09:00:00.000+00:00"
const WAITING_LEG = { finish_time: null, online_splits: [], start_time: null }

const twoLegTeam = buildTeamFixture("A", TEAM_START, [
  buildLegFixture(1, WAITING_LEG),
  buildLegFixture(2, WAITING_LEG),
])
const oneLegTeam = buildTeamFixture("B", TEAM_START, [buildLegFixture(1, WAITING_LEG)])

describe("findLeg", () => {
  it("finds the runner of a leg by its number", () => {
    expect(findLeg(twoLegTeam, 2)?.id).toBe("A-leg-2")
  })

  it("finds nothing for a leg the team does not have", () => {
    expect(findLeg(oneLegTeam, 2)).toBeUndefined()
  })
})

describe("legAsRunner", () => {
  it("gives the leg runner the team's class and no team members", () => {
    const leg = findLeg(twoLegTeam, 1)!

    const runner = legAsRunner(twoLegTeam, leg)

    expect(runner.id).toBe(leg.id)
    expect(runner.class).toBe(twoLegTeam.class)
    expect(runner.runners).toBeNull()
  })
})

describe("legNumbersOf", () => {
  it("lists every leg of the team with the most legs", () => {
    expect(legNumbersOf([oneLegTeam, twoLegTeam])).toEqual([1, 2])
  })

  it("lists no leg without teams", () => {
    expect(legNumbersOf([])).toEqual([])
  })
})

describe("legRunnersOf", () => {
  it("collects the runners of one leg from the teams that have it", () => {
    const runners = legRunnersOf([oneLegTeam, twoLegTeam], 2)

    expect(runners.map((runner) => runner.id)).toEqual(["A-leg-2"])
    expect(runners[0].class).toBe(twoLegTeam.class)
  })
})

describe("teamNamesByLegRunnerId", () => {
  it("maps each runner of the leg to their team's name", () => {
    const names = teamNamesByLegRunnerId([oneLegTeam, twoLegTeam], 1)

    expect([...names]).toEqual([
      ["B-leg-1", oneLegTeam.full_name],
      ["A-leg-1", twoLegTeam.full_name],
    ])
  })
})
