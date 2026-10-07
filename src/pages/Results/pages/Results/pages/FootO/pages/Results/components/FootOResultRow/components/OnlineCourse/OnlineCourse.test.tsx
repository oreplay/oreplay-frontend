import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import buildOnlineCourse from "../../../../shared/onlineCourse/buildOnlineCourse.ts"
import {
  IN_PROGRESS_LEG_FILL_RATIO,
  ONLINE_COURSE_NODE_KIND,
  ONLINE_COURSE_PROGRESS,
} from "../../../../shared/onlineCourse/onlineCourse.ts"
import {
  buildFinishSplit,
  buildOnlineSplit,
  buildRunnerWithOnlineSplits,
} from "../../../../shared/onlineCourse/onlineCourseFixtures.ts"
import OnlineCourse from "./OnlineCourse.tsx"

const { InProgress, Pending, Reached } = ONLINE_COURSE_PROGRESS
const BEST_CUMULATIVE_SECONDS = [100, 240, 400]
const HAS_STARTED = true

function renderCourseAfterFirstControl(bestCumulativeSeconds: number[] | null) {
  const runner = buildRunnerWithOnlineSplits({
    onlineSplits: [
      buildOnlineSplit(31, 1, 130),
      buildOnlineSplit(41, 2, null),
      buildFinishSplit(null),
    ],
  })
  const course = buildOnlineCourse(runner, bestCumulativeSeconds, HAS_STARTED)
  return render(<OnlineCourse course={course} />).container
}

function symbolsOfKind(container: HTMLElement, kind: string) {
  return Array.from(container.querySelectorAll(`[data-kind="${kind}"]`))
}

function progressOf(symbols: Element[]) {
  return symbols.map((symbol) => symbol.getAttribute("data-progress"))
}

describe("OnlineCourse", () => {
  it("draws one start, one circle per online control and one finish", () => {
    const container = renderCourseAfterFirstControl(BEST_CUMULATIVE_SECONDS)

    expect(symbolsOfKind(container, ONLINE_COURSE_NODE_KIND.Start)).toHaveLength(1)
    expect(symbolsOfKind(container, ONLINE_COURSE_NODE_KIND.Control)).toHaveLength(2)
    expect(symbolsOfKind(container, ONLINE_COURSE_NODE_KIND.Finish)).toHaveLength(1)
  })

  it("marks every symbol with the progress of the runner", () => {
    const container = renderCourseAfterFirstControl(BEST_CUMULATIVE_SECONDS)

    expect(progressOf(symbolsOfKind(container, ONLINE_COURSE_NODE_KIND.Start))).toEqual([Reached])
    expect(progressOf(symbolsOfKind(container, ONLINE_COURSE_NODE_KIND.Control))).toEqual([
      Reached,
      Pending,
    ])
    expect(progressOf(symbolsOfKind(container, ONLINE_COURSE_NODE_KIND.Finish))).toEqual([Pending])
  })

  it("writes the station code inside every control", () => {
    const container = renderCourseAfterFirstControl(BEST_CUMULATIVE_SECONDS)
    const controls = symbolsOfKind(container, ONLINE_COURSE_NODE_KIND.Control)

    expect(controls.map((control) => control.textContent)).toEqual(["31", "41"])
  })

  it("fills the fixed ratio of the leg the runner is on", () => {
    const container = renderCourseAfterFirstControl(BEST_CUMULATIVE_SECONDS)
    const legs = Array.from(container.querySelectorAll("[data-leg-progress]"))
    const travelledLines = legs.map((leg) => leg.querySelector<SVGLineElement>("line[style]"))

    expect(legs.map((leg) => leg.getAttribute("data-leg-progress"))).toEqual([
      Reached,
      InProgress,
      Pending,
    ])
    expect(travelledLines.map((line) => line?.style.transform)).toEqual([
      "scaleX(1)",
      `scaleX(${IN_PROGRESS_LEG_FILL_RATIO})`,
      "scaleX(0)",
    ])
  })

  it("shows the accumulated time and the difference under a control with a reading", () => {
    const container = renderCourseAfterFirstControl(BEST_CUMULATIVE_SECONDS)

    expect(container).toHaveTextContent("02:10")
    expect(container).toHaveTextContent("+00:30")
  })

  it("shows no difference without a class reference", () => {
    const container = renderCourseAfterFirstControl(null)

    expect(container).toHaveTextContent("02:10")
    expect(container).not.toHaveTextContent("+")
  })

  it("is a single image for assistive technology", () => {
    const container = renderCourseAfterFirstControl(BEST_CUMULATIVE_SECONDS)

    expect(container.querySelectorAll('svg[role="img"][aria-label]')).toHaveLength(1)
  })
})
