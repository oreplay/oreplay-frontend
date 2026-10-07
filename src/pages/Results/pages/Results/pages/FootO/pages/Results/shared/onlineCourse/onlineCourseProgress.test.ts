import { describe, expect, it } from "vitest"
import buildOnlineCourse from "./buildOnlineCourse.ts"
import { IN_PROGRESS_LEG_FILL_RATIO, ONLINE_COURSE_PROGRESS } from "./onlineCourse.ts"
import {
  buildFinishSplit,
  buildOnlineSplit,
  buildRunnerWithOnlineSplits,
} from "./onlineCourseFixtures.ts"
import { countControls, countReachedControls, legFillRatio } from "./onlineCourseProgress.ts"

const HAS_STARTED = true
const COURSE_AFTER_FIRST_CONTROL = buildOnlineCourse(
  buildRunnerWithOnlineSplits({
    onlineSplits: [
      buildOnlineSplit(31, 1, 130),
      buildOnlineSplit(41, 2, null),
      buildFinishSplit(null),
    ],
  }),
  null,
  HAS_STARTED,
)

describe("countControls", () => {
  it("counts the online controls without the start and the finish", () => {
    expect(countControls(COURSE_AFTER_FIRST_CONTROL)).toBe(2)
  })
})

describe("countReachedControls", () => {
  it("counts the reached online controls without the start", () => {
    expect(countReachedControls(COURSE_AFTER_FIRST_CONTROL)).toBe(1)
  })
})

describe("legFillRatio", () => {
  it("leaves a pending leg empty", () => {
    expect(legFillRatio(ONLINE_COURSE_PROGRESS.Pending)).toBe(0)
  })

  it("fills a fixed part of the leg the runner is on", () => {
    expect(legFillRatio(ONLINE_COURSE_PROGRESS.InProgress)).toBe(IN_PROGRESS_LEG_FILL_RATIO)
  })

  it("fills a reached leg completely", () => {
    expect(legFillRatio(ONLINE_COURSE_PROGRESS.Reached)).toBe(1)
  })
})
