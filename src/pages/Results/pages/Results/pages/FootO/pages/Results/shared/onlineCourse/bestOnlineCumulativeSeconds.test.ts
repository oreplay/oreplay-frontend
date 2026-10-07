import { describe, expect, it } from "vitest"
import { RESULT_STATUS } from "../../../../../../../../shared/constants.ts"
import bestOnlineCumulativeSeconds from "./bestOnlineCumulativeSeconds.ts"
import {
  buildFinishSplit,
  buildOnlineSplit,
  buildRunnerWithOnlineSplits,
} from "./onlineCourseFixtures.ts"

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

describe("bestOnlineCumulativeSeconds", () => {
  it("keeps the lowest cumulative time of every online control and the finish", () => {
    const runners = [
      buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(100, 260, 400) }),
      buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(120, 240, 410) }),
    ]

    expect(bestOnlineCumulativeSeconds(runners)).toEqual([100, 240, 400])
  })

  it("has no best time at a control that nobody has passed", () => {
    const runners = [
      buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(100, null, null) }),
      buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(null, null, null) }),
    ]

    expect(bestOnlineCumulativeSeconds(runners)).toEqual([100, null, null])
  })

  it("leaves out the runners that do not compete", () => {
    const runners = [
      buildRunnerWithOnlineSplits({ isNC: true, onlineSplits: buildOnlineSplits(50, 150, 250) }),
      buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(100, 260, 400) }),
    ]

    expect(bestOnlineCumulativeSeconds(runners)).toEqual([100, 260, 400])
  })

  it("leaves out the runners whose status is not OK", () => {
    const runners = [
      buildRunnerWithOnlineSplits({
        onlineSplits: buildOnlineSplits(50, 150, 250),
        statusCode: RESULT_STATUS.mp,
      }),
      buildRunnerWithOnlineSplits({ onlineSplits: buildOnlineSplits(100, 260, 400) }),
    ]

    expect(bestOnlineCumulativeSeconds(runners)).toEqual([100, 260, 400])
  })

  it("has no best times when the class has no online controls", () => {
    expect(
      bestOnlineCumulativeSeconds([buildRunnerWithOnlineSplits({ onlineSplits: [] })]),
    ).toEqual([])
  })

  it("has no best times without runners", () => {
    expect(bestOnlineCumulativeSeconds([])).toEqual([])
  })
})
