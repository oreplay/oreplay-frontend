import { describe, it, expect } from "vitest"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { liveRelayTime } from "./functions.ts"
import { DateTime } from "luxon"
import { baseLegFixture, baseRelayRunnerFixture } from "./relayFixtures.test.ts"

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
