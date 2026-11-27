import { DateTime } from "luxon"
import { describe, expect, it } from "vitest"
import { ONLINE_COURSE_NODE_KIND } from "../../FootO/pages/Results/shared/onlineCourse/onlineCourse.ts"
import { buildLegFixture, buildRadioSplitFixture, buildTeamFixture } from "./relayFixtures.ts"
import { findLeg, legAsRunner } from "./relayLegs.ts"
import {
  bestOnlineCumulativeSecondsByLeg,
  buildLegOnlineCourse,
  buildRunningLegOnlineCourse,
  isLegOnCourse,
  teamSecondsAtOnlineSplit,
} from "./relayOnlineCourse.ts"

const NOW = DateTime.fromISO("2025-10-26T10:00:00.000+00:00") as DateTime<true>
const TEAM_START = "2025-10-26T09:00:00.000+00:00"
const CHANGEOVER = "2025-10-26T09:30:00.000+00:00"
const LATER_THAN_NOW = "2025-10-26T11:00:00.000+00:00"
const SECONDS_TO_CHANGEOVER = 1800

const finishedLeg = buildLegFixture(1, {
  finish_time: CHANGEOVER,
  online_splits: [
    buildRadioSplitFixture("40", 300),
    buildRadioSplitFixture("42", 900),
    buildRadioSplitFixture(null, SECONDS_TO_CHANGEOVER),
  ],
  start_time: TEAM_START,
})
const runningLeg = buildLegFixture(2, {
  finish_time: null,
  online_splits: [
    buildRadioSplitFixture("40", 400),
    buildRadioSplitFixture("42", null),
    buildRadioSplitFixture(null, null),
  ],
  start_time: CHANGEOVER,
})
const team = buildTeamFixture("A", TEAM_START, [finishedLeg, runningLeg])
const teamRunningLeg = findLeg(team, 2)!
const teamFinishedLeg = findLeg(team, 1)!

describe("teamSecondsAtOnlineSplit", () => {
  it("adds the time to the leg's start to the leg time at the split", () => {
    expect(teamSecondsAtOnlineSplit(team, teamRunningLeg, 0)).toBe(SECONDS_TO_CHANGEOVER + 400)
  })

  it("has no team time where the leg has no reading", () => {
    expect(teamSecondsAtOnlineSplit(team, teamRunningLeg, 1)).toBeNull()
  })

  it("has no team time for a leg without a start", () => {
    const waitingLeg = { ...teamRunningLeg, stage: { ...teamRunningLeg.stage, start_time: null } }

    expect(teamSecondsAtOnlineSplit(team, waitingLeg, 0)).toBeNull()
  })
})

describe("isLegOnCourse", () => {
  it("is true for a leg that started and has not finished", () => {
    expect(isLegOnCourse(legAsRunner(team, teamRunningLeg), NOW)).toBe(true)
  })

  it("is true for a leg without a start that has punched an online control", () => {
    const punchedWithoutStart = {
      ...teamRunningLeg,
      stage: {
        ...teamRunningLeg.stage,
        online_splits: [{ ...buildRadioSplitFixture("42", null), reading_time: CHANGEOVER }],
        start_time: null,
      },
    }

    expect(isLegOnCourse(legAsRunner(team, punchedWithoutStart), NOW)).toBe(true)
  })

  it("is false for a finished leg", () => {
    expect(isLegOnCourse(legAsRunner(team, teamFinishedLeg), NOW)).toBe(false)
  })

  it("is false for a leg that starts later", () => {
    const laterLeg = {
      ...teamRunningLeg,
      stage: { ...teamRunningLeg.stage, start_time: LATER_THAN_NOW },
    }

    expect(isLegOnCourse(legAsRunner(team, laterLeg), NOW)).toBe(false)
  })
})

describe("buildLegOnlineCourse", () => {
  it("draws the start, each online control and the finish of a finished leg", () => {
    const course = buildLegOnlineCourse(legAsRunner(team, teamFinishedLeg), null, NOW)

    expect(course?.nodes.map((node) => node.kind)).toEqual([
      ONLINE_COURSE_NODE_KIND.Start,
      ONLINE_COURSE_NODE_KIND.Control,
      ONLINE_COURSE_NODE_KIND.Control,
      ONLINE_COURSE_NODE_KIND.Finish,
    ])
  })

  it("draws nothing for a leg without online controls", () => {
    const legWithoutRadios = {
      ...teamRunningLeg,
      stage: { ...teamRunningLeg.stage, online_splits: [] },
    }

    expect(buildLegOnlineCourse(legAsRunner(team, legWithoutRadios), null, NOW)).toBeNull()
  })
})

describe("buildRunningLegOnlineCourse", () => {
  it("draws the course of the leg being run", () => {
    const course = buildRunningLegOnlineCourse(team, teamRunningLeg, null, NOW)

    expect(course?.nodes.map((node) => node.label)).toEqual([null, "40", "42", null])
  })

  it("draws nothing for a finished leg", () => {
    expect(buildRunningLegOnlineCourse(team, teamFinishedLeg, null, NOW)).toBeNull()
  })
})

describe("bestOnlineCumulativeSecondsByLeg", () => {
  it("keeps the best leg time at each online split, leg by leg", () => {
    const rival = buildTeamFixture("B", TEAM_START, [
      buildLegFixture(1, {
        ...finishedLeg.stage,
        online_splits: [buildRadioSplitFixture("40", 280)],
      }),
      buildLegFixture(2, {
        ...runningLeg.stage,
        online_splits: [buildRadioSplitFixture("40", 450), buildRadioSplitFixture("42", 1000)],
      }),
    ])

    const best = bestOnlineCumulativeSecondsByLeg([team, rival])

    expect(best.get(1)).toEqual([280, 900, SECONDS_TO_CHANGEOVER])
    expect(best.get(2)).toEqual([400, 1000, null])
  })
})
