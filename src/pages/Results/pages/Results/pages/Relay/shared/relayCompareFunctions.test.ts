import { beforeEach, describe, expect, it, vi } from "vitest"
import { DateTime } from "luxon"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { relayCompareFunctions } from "./relayCompareFunctions.ts"
import { captureExceptionOnce } from "../../../shared/captureExceptionOnce.ts"
import {
  baseLegFixture,
  baseRelayRunnerFixture,
  buildLegFixture,
  buildRadioSplitFixture,
  buildTeamFixture,
} from "./relayFixtures.ts"
import { liveRelayTime } from "./functions.ts"

vi.mock("../../../shared/captureExceptionOnce.ts", () => ({ captureExceptionOnce: vi.fn() }))

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

  it("byNumberOfLegsFinished treats a team without members as a tie without reporting it", () => {
    expect(relayCompareFunctions.byNumberOfLegsFinished(runningTeam, teamWithoutMembers, NOW)).toBe(
      0,
    )
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

const TEAM_START = "2025-10-26T09:00:00.000+00:00"

/**
 * Builds a team whose first leg finished at `changeover` and whose second leg is out on the
 * course with the given leg times at the radio controls 40 and 42.
 *
 * @param id Identifier of the team.
 * @param changeover End of the first leg, as ISO 8601.
 * @param radioSeconds Leg times of the second leg at the controls 40 and 42.
 * @returns The team.
 */
function teamOnSecondLeg(id: string, changeover: string, radioSeconds: (number | null)[]) {
  const firstLegSeconds = DateTime.fromISO(changeover)
    .diff(DateTime.fromISO(TEAM_START))
    .as("seconds")
  return buildTeamFixture(id, TEAM_START, [
    buildLegFixture(1, {
      finish_time: changeover,
      online_splits: [],
      start_time: TEAM_START,
      time_seconds: firstLegSeconds,
    }),
    buildLegFixture(2, {
      finish_time: null,
      online_splits: [
        buildRadioSplitFixture("40", radioSeconds[0]),
        buildRadioSplitFixture("42", radioSeconds[1]),
      ],
      start_time: changeover,
    }),
  ])
}

describe("byLastCommonOnlineControl", () => {
  const earlierChangeoverSlowerRadio = teamOnSecondLeg(
    "A",
    "2025-10-26T09:30:00.000+00:00",
    [500, 1000],
  )
  const laterChangeoverFasterRadio = teamOnSecondLeg("B", "2025-10-26T09:31:00.000+00:00", [
    300,
    null,
  ])

  it("puts first the team with the better team time at the last control both punched", () => {
    expect(
      relayCompareFunctions.byLastCommonOnlineControl(
        laterChangeoverFasterRadio,
        earlierChangeoverSlowerRadio,
        NOW,
      ),
    ).toBeLessThan(0)
    expect(
      relayCompareFunctions.byLastCommonOnlineControl(
        earlierChangeoverSlowerRadio,
        laterChangeoverFasterRadio,
        NOW,
      ),
    ).toBeGreaterThan(0)
  })

  it("ties teams with no online reading in common", () => {
    const withoutReadings = teamOnSecondLeg("C", "2025-10-26T09:30:00.000+00:00", [null, null])

    expect(
      relayCompareFunctions.byLastCommonOnlineControl(
        withoutReadings,
        laterChangeoverFasterRadio,
        NOW,
      ),
    ).toBe(0)
  })

  it("ties teams running different legs", () => {
    const onFirstLeg = buildTeamFixture("D", TEAM_START, [
      buildLegFixture(1, {
        finish_time: null,
        online_splits: [buildRadioSplitFixture("40", 200)],
        start_time: TEAM_START,
      }),
    ])

    expect(
      relayCompareFunctions.byLastCommonOnlineControl(onFirstLeg, laterChangeoverFasterRadio, NOW),
    ).toBe(0)
  })

  it("ties a team without members without reporting it", () => {
    expect(
      relayCompareFunctions.byLastCommonOnlineControl(
        teamWithoutMembers,
        laterChangeoverFasterRadio,
        NOW,
      ),
    ).toBe(0)
    expect(captureExceptionOnce).not.toHaveBeenCalled()
  })
})

describe("byOnlineControlRunningTowards", () => {
  const atSecondControl = teamOnSecondLeg("A", "2025-10-26T09:30:00.000+00:00", [400, 900])

  it("puts behind a team still heading to a control the other passed in less team time", () => {
    const stillHeadingToSecond = teamOnSecondLeg("B", "2025-10-26T09:31:00.000+00:00", [420, null])

    expect(
      relayCompareFunctions.byOnlineControlRunningTowards(
        stillHeadingToSecond,
        atSecondControl,
        NOW,
      ),
    ).toBeGreaterThan(0)
    expect(
      relayCompareFunctions.byOnlineControlRunningTowards(
        atSecondControl,
        stillHeadingToSecond,
        NOW,
      ),
    ).toBeLessThan(0)
  })

  it("ties while the team behind can still be ahead at that control", () => {
    const fastAtSecond = teamOnSecondLeg("C", "2025-10-26T09:30:00.000+00:00", [400, 3500])
    const stillHeadingToSecond = teamOnSecondLeg("D", "2025-10-26T09:31:00.000+00:00", [420, null])

    expect(
      relayCompareFunctions.byOnlineControlRunningTowards(stillHeadingToSecond, fastAtSecond, NOW),
    ).toBe(0)
  })

  it("ties teams heading to the same control", () => {
    const alsoAtSecond = teamOnSecondLeg("E", "2025-10-26T09:31:00.000+00:00", [300, 800])

    expect(
      relayCompareFunctions.byOnlineControlRunningTowards(alsoAtSecond, atSecondControl, NOW),
    ).toBe(0)
  })
})
