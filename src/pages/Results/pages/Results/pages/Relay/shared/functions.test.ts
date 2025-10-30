import { describe, it, expect } from "vitest"
import {
  ProcessedRunnerModel,
  ProcessedTeamRunnerModel,
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { liveRelayTime } from "./functions.ts"
import { DateTime } from "luxon"

const baseLeg: ProcessedTeamRunnerModel = {
  id: "legId",
  bib_number: "100-1",
  is_nc: false,
  eligibility: null,
  sicard: "123456789",
  sex: "F",
  leg_number: 1,
  class: null,
  club: {
    id: "ClubId",
    short_name: "Club",
  },
  full_name: "Leg Full Name",
  stage: {
    id: "legStageId",
    result_type_id: "e4ddfa9d-3347-47e4-9d32-c6c119aeac0e",
    start_time: "2025-10-26T09:00:00.000+00:00",
    finish_time: "2025-10-26T09:01:00.000+00:00",
    upload_type: "res_finish",
    time_seconds: 60,
    position: 0,
    status_code: "0",
    time_behind: 0,
    time_neutralization: 0,
    time_adjusted: 0,
    time_penalty: 0,
    time_bonus: 0,
    points_final: 0,
    points_behind: 0,
    points_adjusted: 0,
    points_penalty: 0,
    points_bonus: 0,
    leg_number: 1,
    splits: [],
    online_splits: []
  },
  overalls: null,
}

const baseRunner: ProcessedRunnerModel = {
  id: "07ec30e6-3953-4676-a5b7-6410851a8f64",
  bib_number: "100",
  is_nc: false,
  eligibility: null,
  runners: [],
  class: {
    id: "classId",
    short_name: "ClassShort",
    long_name: "ClassLong",
  },
  club: {
    id: "clubId",
    short_name: "ClubName",
  },
  full_name: "Team name",
  stage: {
    id: "stageID",
    result_type_id: "e4ddfa9d-3347-47e4-9d32-c6c119aeac0e",
    start_time: null,
    finish_time: null,
    upload_type: "res_finish",
    time_seconds: 0,
    position: 0,
    status_code: "0",
    time_behind: 2117,
    time_neutralization: 0,
    time_adjusted: 0,
    time_penalty: 0,
    time_bonus: 0,
    points_final: 0,
    points_behind: 0,
    points_adjusted: 0,
    points_penalty: 0,
    points_bonus: 0,
    leg_number: 4,
    splits: [],
    online_splits: []
  },
  overalls: null,
}

describe("liveRelayTime", () => {
  const defaultNow: DateTime<true> = DateTime.fromISO(
    "2025-10-26T10:00:00.000+00:00",
  ) as DateTime<true>

  it("should fail if the team has no runners", () => {
    expect(() => liveRelayTime(baseRunner, defaultNow)).toThrowError(
      "A relay runner is expected to have team members",
    )
  })

  it("should handle a finished team", () => {
    const finishedRunner = {
      ...baseRunner,
      runners: [
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
          },
        },
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
            start_time: "2025-10-26T09:01:00.000+00:00",
            finish_time: "2025-10-26T09:03:00.000+00:00",
            time_seconds: 120,
          },
        },
      ],
      stage: {
        ...baseRunner.stage,
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
      ...baseRunner,
      stage: { ...baseRunner.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: "2025-10-26T09:01:00.000+00:00",
            time_seconds: 60,
          },
        },
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
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
      ...baseRunner,
      stage: { ...baseRunner.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
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

  it("Should return the right time if the team is in-race (first runner only)", ()=>{
    const teamRunning: ProcessedRunnerModel = {
      ...baseRunner,
      stage: { ...baseRunner.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
            start_time: null,
            finish_time: null,
            time_seconds: 0,
          },
        },
      ],
    }

    const now = DateTime.fromISO("2025-10-26T09:05:00.000+00:00") as DateTime<true>

    const result = liveRelayTime(teamRunning, now)
    expect(result).toEqual(5*60)
  })

  it("Should return the right time if the team is in-race (second runner only)", ()=>{
    const teamRunning: ProcessedRunnerModel = {
      ...baseRunner,
      stage: { ...baseRunner.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: "2025-10-26T09:01:00.000+00:00",
            time_seconds: 60,
          },
        },
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
            start_time: "2025-10-26T09:01:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
      ],
    }

    const now = DateTime.fromISO("2025-10-26T09:05:00.000+00:00") as DateTime<true>

    const result = liveRelayTime(teamRunning, now)
    expect(result).toEqual(5*60)
  })

  it("Should return the right time if the team is in-race (two runners running)", ()=>{
    const teamRunning: ProcessedRunnerModel = {
      ...baseRunner,
      stage: { ...baseRunner.stage, time_seconds: 0 },
      runners: [
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
            start_time: "2025-10-26T09:00:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
        {
          ...baseLeg,
          stage: {
            ...baseLeg.stage,
            start_time: "2025-10-26T09:02:00.000+00:00",
            finish_time: null,
            time_seconds: 0,
          },
        },
      ],
    }

    const now = DateTime.fromISO("2025-10-26T09:05:00.000+00:00") as DateTime<true>

    const result = liveRelayTime(teamRunning, now)
    expect(result).toEqual(8*60)
  })

  it("should respect maxLeg parameter when summing legs", () => {
    const teamThreeLegs = {
      ...baseRunner,
      stage: { ...baseRunner.stage, time_seconds: 0 },
      runners: [
        { ...baseLeg, stage: { ...baseLeg.stage, time_seconds: 60 } },
        { ...baseLeg, stage: { ...baseLeg.stage, time_seconds: 90 } },
        { ...baseLeg, stage: { ...baseLeg.stage, time_seconds: 120 } },
      ],
    }

    // maxLeg=2 means (maxLeg - 1) = 1 → only first leg counted
    const result = liveRelayTime(teamThreeLegs, defaultNow, 2)
    expect(result).toBe(60+90)
  })
})
