import { beforeEach, describe, expect, it, vi } from "vitest"
import { DateTime } from "luxon"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { relayCompareFunctions } from "./relayCompareFunctions.ts"
import { captureExceptionOnce } from "./captureExceptionOnce.ts"
import { baseLegFixture, baseRelayRunnerFixture } from "./relayFixtures.ts"
import { liveRelayTime } from "./functions.ts"

vi.mock("./captureExceptionOnce.ts", () => ({ captureExceptionOnce: vi.fn() }))

vi.mock("./functions.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./functions.ts")>()
  return { ...actual, liveRelayTime: vi.fn(actual.liveRelayTime) }
})

const NOW = DateTime.fromISO("2025-10-26T10:00:00.000+00:00") as DateTime<true>

const teamWithoutMembers: ProcessedRunnerModel = {
  ...baseRelayRunnerFixture,
  id: "team-without-members",
  runners: [],
}

const teamWithNullMembers: ProcessedRunnerModel = {
  ...baseRelayRunnerFixture,
  id: "team-with-null-members",
  runners: null,
}

const runningTeam: ProcessedRunnerModel = {
  ...baseRelayRunnerFixture,
  id: "running-team",
  runners: [
    {
      ...baseLegFixture,
      stage: { ...baseLegFixture.stage, start_time: "2025-10-26T09:00:00.000+00:00" },
    },
  ],
}

describe("relayCompareFunctions", () => {
  beforeEach(() => {
    vi.mocked(captureExceptionOnce).mockClear()
  })

  it("byLiveRelayTime treats a team without members as a tie without reporting it", () => {
    expect(relayCompareFunctions.byLiveRelayTime(runningTeam, teamWithoutMembers, NOW)).toBe(0)
    expect(captureExceptionOnce).not.toHaveBeenCalled()
  })

  it("byLastCommonLegTime treats a team with null members as a tie without reporting it", () => {
    expect(relayCompareFunctions.byLastCommonLegTime(runningTeam, teamWithNullMembers)).toBe(0)
    expect(captureExceptionOnce).not.toHaveBeenCalled()
  })

  it("reports an unexpected error with the team ids only", () => {
    const error = new Error("unexpected")
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    vi.mocked(liveRelayTime).mockImplementationOnce(() => {
      throw error
    })

    expect(relayCompareFunctions.byLiveRelayTime(runningTeam, teamWithoutMembers, NOW)).toBe(0)
    expect(captureExceptionOnce).toHaveBeenCalledWith(
      error,
      "relayCompareFunctions.byLiveRelayTime",
      { teamA: runningTeam.id, teamB: teamWithoutMembers.id },
    )
  })
})
