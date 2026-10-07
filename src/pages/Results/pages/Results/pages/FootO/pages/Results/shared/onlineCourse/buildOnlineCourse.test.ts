import { describe, expect, it } from "vitest"
import { RESULT_STATUS } from "../../../../../../../../shared/constants.ts"
import buildOnlineCourse from "./buildOnlineCourse.ts"
import { ONLINE_COURSE_NODE_KIND, ONLINE_COURSE_PROGRESS, OnlineCourse } from "./onlineCourse.ts"
import {
  buildFinishSplit,
  buildOnlineSplit,
  buildRunnerWithOnlineSplits,
} from "./onlineCourseFixtures.ts"

const { InProgress, Pending, Reached } = ONLINE_COURSE_PROGRESS
const BEST_CUMULATIVE_SECONDS = [100, 240, 400]
const FINISH_TIME = "2026-01-01T11:00:00.000+00:00"
const HAS_STARTED = true
const HAS_NOT_STARTED = false
const START_TIME = "2026-01-01T10:00:00.000+00:00"

function buildOnlineSplits(
  firstRadioSeconds: number | null,
  secondRadioSeconds: number | null,
  finishSeconds: number | null,
) {
  return [
    buildOnlineSplit(31, 1, firstRadioSeconds),
    buildOnlineSplit(41, 2, secondRadioSeconds),
    buildFinishSplit(finishSeconds),
  ]
}

function nodeProgresses(course: OnlineCourse) {
  return course.nodes.map((node) => node.progress)
}

function legProgresses(course: OnlineCourse) {
  return course.legs.map((leg) => leg.progress)
}

function liveTimings(course: OnlineCourse) {
  return course.nodes.map((node) => node.liveTiming)
}

describe("buildOnlineCourse", () => {
  it("builds a start, one control per online control and a finish joined by legs", () => {
    const runner = buildRunnerWithOnlineSplits({
      onlineSplits: buildOnlineSplits(null, null, null),
    })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_NOT_STARTED)

    expect(course.nodes.map((node) => node.kind)).toEqual([
      ONLINE_COURSE_NODE_KIND.Start,
      ONLINE_COURSE_NODE_KIND.Control,
      ONLINE_COURSE_NODE_KIND.Control,
      ONLINE_COURSE_NODE_KIND.Finish,
    ])
    expect(course.nodes.map((node) => node.label)).toEqual([null, "31", "41", null])
    expect(course.legs).toHaveLength(3)
  })

  it("leaves everything pending for a runner that has not started", () => {
    const runner = buildRunnerWithOnlineSplits({
      onlineSplits: buildOnlineSplits(null, null, null),
    })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_NOT_STARTED)

    expect(nodeProgresses(course)).toEqual([Pending, Pending, Pending, Pending])
    expect(legProgresses(course)).toEqual([Pending, Pending, Pending])
  })

  it("puts a started runner on the leg to the first control", () => {
    const runner = buildRunnerWithOnlineSplits({
      onlineSplits: buildOnlineSplits(null, null, null),
    })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_STARTED)

    expect(nodeProgresses(course)).toEqual([Reached, Pending, Pending, Pending])
    expect(legProgresses(course)).toEqual([InProgress, Pending, Pending])
  })

  it("puts a runner in the middle of the course on the leg after the last reading", () => {
    const runner = buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(130, null, null) })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_STARTED)

    expect(nodeProgresses(course)).toEqual([Reached, Reached, Pending, Pending])
    expect(legProgresses(course)).toEqual([Reached, InProgress, Pending])
    expect(course.nodes[1]).toMatchObject({ behindSeconds: 30, cumulativeSeconds: 130 })
  })

  it("draws a control without reading as reached when a later control has one", () => {
    const runner = buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(null, 250, null) })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_STARTED)

    expect(nodeProgresses(course)).toEqual([Reached, Reached, Reached, Pending])
    expect(legProgresses(course)).toEqual([Reached, Reached, InProgress])
    expect(course.nodes[1]).toMatchObject({ behindSeconds: null, cumulativeSeconds: null })
    expect(course.nodes[2]).toMatchObject({ behindSeconds: 10, cumulativeSeconds: 250 })
  })

  it("marks the start as reached from a reading even without a start time", () => {
    const runner = buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(130, null, null) })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_NOT_STARTED)

    expect(nodeProgresses(course)).toEqual([Reached, Reached, Pending, Pending])
    expect(legProgresses(course)).toEqual([Reached, InProgress, Pending])
  })

  it("keeps the whole course reached for a runner that finished and downloaded", () => {
    const runner = buildRunnerWithOnlineSplits({
      finishTime: FINISH_TIME,
      onlineSplits: buildOnlineSplits(130, 250, 420),
      position: 2,
    })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_STARTED)

    expect(nodeProgresses(course)).toEqual([Reached, Reached, Reached, Reached])
    expect(legProgresses(course)).toEqual([Reached, Reached, Reached])
    expect(course.nodes[3]).toMatchObject({ behindSeconds: 20, cumulativeSeconds: 420 })
  })

  it("keeps the whole course reached for a finished runner without any online reading", () => {
    const runner = buildRunnerWithOnlineSplits({
      finishTime: FINISH_TIME,
      onlineSplits: buildOnlineSplits(null, null, null),
    })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_STARTED)

    expect(nodeProgresses(course)).toEqual([Reached, Reached, Reached, Reached])
    expect(legProgresses(course)).toEqual([Reached, Reached, Reached])
  })

  it("keeps the whole course reached for a runner read only at the radio finish", () => {
    const runner = buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(130, null, 420) })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_STARTED)

    expect(nodeProgresses(course)).toEqual([Reached, Reached, Reached, Reached])
    expect(legProgresses(course)).toEqual([Reached, Reached, Reached])
  })

  it.each([RESULT_STATUS.mp, RESULT_STATUS.dnf, RESULT_STATUS.dsq])(
    "keeps the reached controls but no leg in progress for status %s",
    (statusCode) => {
      const runner = buildRunnerWithOnlineSplits({
        onlineSplits: buildOnlineSplits(130, null, null),
        statusCode,
      })

      const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_STARTED)

      expect(nodeProgresses(course)).toEqual([Reached, Reached, Pending, Pending])
      expect(legProgresses(course)).toEqual([Reached, Pending, Pending])
    },
  )

  it("leaves everything pending for a runner that did not start", () => {
    const runner = buildRunnerWithOnlineSplits({
      onlineSplits: buildOnlineSplits(null, null, null),
      statusCode: RESULT_STATUS.dns,
    })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_STARTED)

    expect(nodeProgresses(course)).toEqual([Pending, Pending, Pending, Pending])
    expect(legProgresses(course)).toEqual([Pending, Pending, Pending])
  })

  it("has no time behind when there is no class reference, as in club view", () => {
    const runner = buildRunnerWithOnlineSplits({
      finishTime: FINISH_TIME,
      onlineSplits: buildOnlineSplits(130, 250, 420),
      position: 2,
    })

    const course = buildOnlineCourse(runner, null, HAS_STARTED)

    expect(course.nodes.map((node) => node.behindSeconds)).toEqual([null, null, null, null])
    expect(course.nodes.map((node) => node.cumulativeSeconds)).toEqual([null, 130, 250, 420])
  })

  it("has no time behind at a control that nobody in the reference has passed", () => {
    const runner = buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(130, null, null) })

    const course = buildOnlineCourse(runner, [null, null, null], HAS_STARTED)

    expect(course.nodes[1]).toMatchObject({ behindSeconds: null, cumulativeSeconds: 130 })
  })

  it("times live the control a running runner is heading to against the best time there", () => {
    const runner = buildRunnerWithOnlineSplits({
      onlineSplits: buildOnlineSplits(130, null, null),
      startTime: START_TIME,
    })

    const course = buildOnlineCourse(runner, BEST_CUMULATIVE_SECONDS, HAS_STARTED)

    expect(liveTimings(course)).toEqual([
      null,
      null,
      { bestSeconds: BEST_CUMULATIVE_SECONDS[1], startTime: START_TIME },
      null,
    ])
  })

  it("times live the first control for a runner that has just started", () => {
    const runner = buildRunnerWithOnlineSplits({
      onlineSplits: buildOnlineSplits(null, null, null),
      startTime: START_TIME,
    })

    const course = buildOnlineCourse(runner, null, HAS_STARTED)

    expect(liveTimings(course)).toEqual([
      null,
      { bestSeconds: null, startTime: START_TIME },
      null,
      null,
    ])
  })

  it("times nothing live before the start, after the finish or without a start time", () => {
    const beforeStart = buildRunnerWithOnlineSplits({
      onlineSplits: buildOnlineSplits(null, null, null),
      startTime: START_TIME,
    })
    const finished = buildRunnerWithOnlineSplits({
      finishTime: FINISH_TIME,
      onlineSplits: buildOnlineSplits(130, 250, 420),
      position: 2,
      startTime: START_TIME,
    })
    const withoutStartTime = buildRunnerWithOnlineSplits({
      onlineSplits: buildOnlineSplits(130, null, null),
    })
    const nothingLive = [null, null, null, null]

    expect(
      liveTimings(buildOnlineCourse(beforeStart, BEST_CUMULATIVE_SECONDS, HAS_NOT_STARTED)),
    ).toEqual(nothingLive)
    expect(liveTimings(buildOnlineCourse(finished, BEST_CUMULATIVE_SECONDS, HAS_STARTED))).toEqual(
      nothingLive,
    )
    expect(
      liveTimings(buildOnlineCourse(withoutStartTime, BEST_CUMULATIVE_SECONDS, HAS_STARTED)),
    ).toEqual(nothingLive)
  })
})
