import { render } from "@testing-library/react"
import { DateTime } from "luxon"
import { afterEach, describe, expect, it, vi } from "vitest"
import { NowContext } from "../../../../../../../../shared/context.ts"
import buildOnlineCourse from "../../shared/onlineCourse/buildOnlineCourse.ts"
import {
  buildFinishSplit,
  buildOnlineSplit,
  buildRunnerWithOnlineSplits,
} from "../../shared/onlineCourse/onlineCourseFixtures.ts"
import FootOResultRow from "./FootOResultRow.tsx"

const START_TIME = "2026-10-21T10:00:00.000Z"
const BEFORE_START = DateTime.fromISO("2026-10-21T09:59:00.000Z") as DateTime<true>
const AFTER_START = DateTime.fromISO("2026-10-21T10:01:00.000Z") as DateTime<true>

vi.mock("../../shared/onlineCourse/buildOnlineCourse.ts", () => ({ default: vi.fn(() => null) }))

vi.mock(
  "../../../../../../components/ResultsList/IndividualOrTeamResult/IndividualOrTeamResult.tsx",
  () => ({ default: () => null }),
)

const runner = buildRunnerWithOnlineSplits({
  onlineSplits: [buildOnlineSplit(31, 1, null), buildFinishSplit(null)],
  startTime: START_TIME,
})

/**
 * Renders the row of the fixture runner as seen at the given instant.
 *
 * @param now Current instant provided to the row.
 * @returns The row element, ready to be rerendered at another instant.
 */
function renderRowAt(now: DateTime<true>) {
  return (
    <NowContext.Provider value={now}>
      <FootOResultRow
        bestOnlineCumulativeSeconds={null}
        isClass
        isOnlineCourseVisible
        onClick={vi.fn()}
        runner={runner}
      />
    </NowContext.Provider>
  )
}

describe("FootOResultRow", () => {
  afterEach(() => {
    vi.mocked(buildOnlineCourse).mockClear()
  })

  it("should rebuild the online course once the runner crosses their start time", () => {
    const { rerender } = render(renderRowAt(BEFORE_START))
    rerender(renderRowAt(AFTER_START))

    expect(vi.mocked(buildOnlineCourse).mock.calls.map((call) => call[2])).toEqual([false, true])
  })

  it("should not rebuild the online course while the start status is unchanged", () => {
    const { rerender } = render(renderRowAt(AFTER_START))
    rerender(renderRowAt(AFTER_START.plus({ seconds: 1 })))

    expect(buildOnlineCourse).toHaveBeenCalledTimes(1)
  })
})
