import { describe, it, expect } from "vitest"
import {
  ProcessedRunnerModel,
  ProcessedTeamRunnerModel,
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { computeTeamStatus, liveRelayTime } from "./functions.ts"
import { DateTime } from "luxon"
import { baseLegFixture, baseRelayRunnerFixture } from "./relayFixtures.ts"
import { RESULT_STATUS } from "../../../../../shared/constants.ts"

describe("liveRelayTime", () => {
  const defaultNow: DateTime<true> = DateTime.fromISO(
    "2025-10-26T10:00:00.000+00:00",
  ) as DateTime<true>

  it("should fail if the team has no runners", () => {
    expect(() => liveRelayTime(baseRelayRunnerFixture, defaultNow)).toThrowError(
      "A relay runner is expected to have team members",
    )
  })

  it("should handle a finished team", () => {
    const finishedRunner = {
      ...baseRelayRunnerFixture,
      runners: [
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
          },
        },
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:01:00.000+00:00",
            finish_time: "2025-10-26T09:03:00.000+00:00",
            time_seconds: 120,
          },
        },
      ],
      stage: {
        ...baseRelayRunnerFixture.stage,
        time_seconds: 180,
        start_time: "2025-10-26T09:01:00.000+00:00",
        finish_time: "2025-10-26T09:03:00.000+00:00",
        position: 5,
      },
    }

    expect(liveRelayTime(finishedRunner, defaultNow)).toBe(180)
  })

  it("should handle a finished team when using maxLeg", () => {
    const finishedRunner = {
      ...baseRelayRunnerFixture,
      runners: [
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            time_seconds: 60,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: "2025-10-26T09:01:00.000+00:00",
          },
        },
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:01:00.000+00:00",
            finish_time: "2025-10-26T09:03:00.000+00:00",
            time_seconds: 120,
          },
        },
      ],
      stage: {
        ...baseRelayRunnerFixture.stage,
        time_seconds: 180,
        start_time: "2025-10-26T09:00:00.000+00:00",
        finish_time: "2025-10-26T09:03:00.000+00:00",
        position: 5,
      },
    }

    expect(liveRelayTime(finishedRunner, defaultNow, 1)).toBe(60)
  })

  it("should compute team time by summing finished leg times when no team time exists", () => {
    const activeTeam = {
      ...baseRelayRunnerFixture,
      stage: { ...baseRelayRunnerFixture.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: "2025-10-26T09:01:00.000+00:00",
            time_seconds: 60,
          },
        },
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:01:00.000+00:00",
            finish_time: "2025-10-26T09:04:00.000+00:00",
            time_seconds: 180,
          },
        },
      ],
    }

    expect(liveRelayTime(activeTeam, defaultNow)).toBe(240)
  })

  it("should return null if no legs have started yet", () => {
    const runnerNotStarted: ProcessedRunnerModel = {
      ...baseRelayRunnerFixture,
      stage: { ...baseRelayRunnerFixture.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: null,
            finish_time: null,
            time_seconds: 0,
          },
        },
      ],
    }

    const now = DateTime.fromISO("2025-10-26T08:00:00.000+00:00") as DateTime<true>

    const result = liveRelayTime(runnerNotStarted, now)
    expect(result).toBeNull()
  })

  it("Should return the right time if the team is in-race (first runner only)", () => {
    const teamRunning: ProcessedRunnerModel = {
      ...baseRelayRunnerFixture,
      stage: { ...baseRelayRunnerFixture.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: null,
            finish_time: null,
            time_seconds: 0,
          },
        },
      ],
    }

    const now = DateTime.fromISO("2025-10-26T09:05:00.000+00:00") as DateTime<true>

    const result = liveRelayTime(teamRunning, now)
    expect(result).toEqual(5 * 60)
  })

  it("Should return the right time if the team is in-race (second runner only)", () => {
    const teamRunning: ProcessedRunnerModel = {
      ...baseRelayRunnerFixture,
      stage: { ...baseRelayRunnerFixture.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: "2025-10-26T09:01:00.000+00:00",
            time_seconds: 60,
          },
        },
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:01:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
      ],
    }

    const now = DateTime.fromISO("2025-10-26T09:05:00.000+00:00") as DateTime<true>

    const result = liveRelayTime(teamRunning, now)
    expect(result).toEqual(5 * 60)
  })

  it("Should return the right time if the team is in-race (two runners running)", () => {
    const teamRunning: ProcessedRunnerModel = {
      ...baseRelayRunnerFixture,
      stage: { ...baseRelayRunnerFixture.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
        {
          ...baseLegFixture,
          stage: {
            ...baseLegFixture.stage,
            start_time: "2025-10-26T09:02:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
      ],
    }

    const now = DateTime.fromISO("2025-10-26T09:05:00.000+00:00") as DateTime<true>

    const result = liveRelayTime(teamRunning, now)
    expect(result).toEqual(8 * 60)
  })

  it("should respect maxLeg parameter when summing legs", () => {
    const teamThreeLegs = {
      ...baseRelayRunnerFixture,
      stage: { ...baseRelayRunnerFixture.stage, time_seconds: 0 },
      runners: [
        { ...baseLegFixture, stage: { ...baseLegFixture.stage, time_seconds: 60 } },
        { ...baseLegFixture, stage: { ...baseLegFixture.stage, time_seconds: 90 } },
        { ...baseLegFixture, stage: { ...baseLegFixture.stage, time_seconds: 120 } },
      ],
    }

    // maxLeg=2 means (maxLeg - 1) = 1 → only first leg counted
    const result = liveRelayTime(teamThreeLegs, defaultNow, 2)
    expect(result).toBe(60 + 90)
  })
})

describe("computeTeamStatus", () => {
  const makeRunner = (statusList: (string | null)[]): ProcessedRunnerModel => {
    const legs = statusList.map(
      (status): ProcessedTeamRunnerModel => ({
        ...baseLegFixture,
        stage: { ...baseLegFixture.stage, status_code: status },
      }),
    )

    return {
      ...baseRelayRunnerFixture,
      runners: legs,
    }
  }

  it("should return the worst status", () => {
    const runner = makeRunner([RESULT_STATUS.mp, RESULT_STATUS.ok, RESULT_STATUS.dsq])

    const result = computeTeamStatus(runner)

    expect(result).toBe(RESULT_STATUS.dsq)
  })

  it("should handle maxLeg appropriately", () => {
    const runner = makeRunner([
      RESULT_STATUS.ok,
      RESULT_STATUS.mp,
      RESULT_STATUS.ok,
      RESULT_STATUS.dns,
    ])

    const result1 = computeTeamStatus(runner, 1)
    const result2 = computeTeamStatus(runner, 2)
    const result3 = computeTeamStatus(runner, 3)
    const result4 = computeTeamStatus(runner, 4)

    expect(result1).toBe(RESULT_STATUS.ok)
    expect(result2).toBe(RESULT_STATUS.mp)
    expect(result3).toBe(RESULT_STATUS.mp)
    expect(result4).toBe(RESULT_STATUS.dns)
  })

  it("should return null if any status is null", () => {
    const runner = makeRunner([RESULT_STATUS.ok, null])

    const result = computeTeamStatus(runner)
    expect(result).toBeNull()
  })

  it("should throw error if runners is undefined", () => {
    const runner = makeRunner([])

    expect(() => computeTeamStatus(runner)).toThrow()
  })

  it("should throw error on unknown status", () => {
    const runner = makeRunner(["weird_status"])

    expect(() => computeTeamStatus(runner)).toThrow(/Unknown status/)
  })
})
