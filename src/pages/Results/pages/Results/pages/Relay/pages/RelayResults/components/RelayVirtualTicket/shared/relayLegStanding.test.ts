import { describe, expect, it } from "vitest"
import {
  ProcessedRunnerModel,
  ProcessedTeamRunnerModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../../../../../../../../shared/constants.ts"
import { baseLegFixture, baseRelayRunnerFixture } from "../../../../../shared/relayFixtures.ts"
import {
  behindAtLeg,
  hasFinishedLegCorrectly,
  legBehindText,
  legTeamTimeText,
  teamTimeAtLeg,
} from "./relayLegStanding.ts"

/**
 * Leg that finished with the given time.
 *
 * @param legNumber Leg number, starting at one.
 * @param seconds Leg time.
 * @param statusCode Result status code of the leg.
 * @returns The leg.
 */
function leg(legNumber: number, seconds: number, statusCode: string = RESULT_STATUS.ok) {
  return {
    ...baseLegFixture,
    leg_number: legNumber,
    stage: { ...baseLegFixture.stage, time_seconds: seconds, status_code: statusCode },
  } as ProcessedTeamRunnerModel
}

/**
 * Team made of the given legs.
 *
 * @param id Team id.
 * @param legs The team's legs, in order.
 * @returns The team.
 */
function team(id: string, legs: ProcessedTeamRunnerModel[]): ProcessedRunnerModel {
  return { ...baseRelayRunnerFixture, id, runners: legs }
}

const FAST = team("fast", [leg(1, 600), leg(2, 700)])
const SLOW = team("slow", [leg(1, 650), leg(2, 900)])
const MISPUNCHED = team("mp", [leg(1, 500, RESULT_STATUS.mp), leg(2, 500)])

describe("teamTimeAtLeg", () => {
  it("adds the legs up to the given one", () => {
    expect(teamTimeAtLeg(SLOW, 2)).toBe(1550)
  })

  it("is unknown for a team without that leg", () => {
    expect(teamTimeAtLeg(team("short", [leg(1, 600)]), 2)).toBeNull()
  })
})

describe("hasFinishedLegCorrectly", () => {
  it("is true when every leg so far finished correctly", () => {
    expect(hasFinishedLegCorrectly(FAST, 2)).toBe(true)
  })

  it("is false after a mispunch", () => {
    expect(hasFinishedLegCorrectly(MISPUNCHED, 2)).toBe(false)
  })
})

describe("behindAtLeg", () => {
  const classTeams = [FAST, SLOW, MISPUNCHED]

  it("measures the gap to the fastest correct team at that leg", () => {
    expect(behindAtLeg(SLOW, classTeams, 1)).toBe(50)
    expect(behindAtLeg(SLOW, classTeams, 2)).toBe(250)
    expect(behindAtLeg(FAST, classTeams, 2)).toBe(0)
  })

  it("is unknown for a team that is not correct or while the class is unknown", () => {
    expect(behindAtLeg(MISPUNCHED, classTeams, 2)).toBeNull()
    expect(behindAtLeg(SLOW, null, 2)).toBeNull()
  })
})

describe("legBehindText / legTeamTimeText", () => {
  it("writes the gap and the team time at that leg", () => {
    expect(legBehindText(SLOW, [FAST, SLOW], 2)).toBe("+04:10")
    expect(legTeamTimeText(SLOW, 2)).toBe("25:50")
  })

  it("is a dash while unknown", () => {
    expect(legBehindText(SLOW, null, 2)).toBe("—")
    expect(legTeamTimeText(team("short", [leg(1, 600)]), 2)).toBe("—")
  })
})
