import { DateTime } from "luxon"
import { describe, expect, it } from "vitest"
import liveNodeTimes, { APPROACHING_BEST_TIME_RATIO } from "./liveNodeTimes.ts"

const START_TIME = "2026-01-01T10:00:00.000+00:00"
const BEST_SECONDS = 100
const APPROACHING_WINDOW_SECONDS = BEST_SECONDS * APPROACHING_BEST_TIME_RATIO
const LIVE_TIMING = { bestSeconds: BEST_SECONDS, startTime: START_TIME }

/**
 * Builds the instant a given number of seconds after the start time of the tests.
 *
 * @param seconds Seconds after the start, negative for an instant before it.
 * @returns The instant.
 */
function secondsAfterStart(seconds: number) {
  return DateTime.fromISO(START_TIME).plus({ seconds })
}

describe("liveNodeTimes", () => {
  it("counts the whole seconds the runner has been out", () => {
    const liveTiming = { bestSeconds: null, startTime: START_TIME }

    expect(liveNodeTimes(liveTiming, secondsAfterStart(75.8))).toEqual({
      cumulativeSeconds: 75,
      differenceSeconds: null,
    })
  })

  it("has no difference while the runner is still far ahead of the best time", () => {
    const farAhead = secondsAfterStart(BEST_SECONDS - APPROACHING_WINDOW_SECONDS - 1)

    expect(liveNodeTimes(LIVE_TIMING, farAhead)?.differenceSeconds).toBeNull()
  })

  it("counts down the difference once the runner gets close to the best time", () => {
    const enteringWindow = secondsAfterStart(BEST_SECONDS - APPROACHING_WINDOW_SECONDS)
    const almostThere = secondsAfterStart(BEST_SECONDS - 1)

    expect(liveNodeTimes(LIVE_TIMING, enteringWindow)?.differenceSeconds).toBe(
      -APPROACHING_WINDOW_SECONDS,
    )
    expect(liveNodeTimes(LIVE_TIMING, almostThere)?.differenceSeconds).toBe(-1)
  })

  it("grows the difference once the runner is behind the best time", () => {
    expect(liveNodeTimes(LIVE_TIMING, secondsAfterStart(BEST_SECONDS + 1))?.differenceSeconds).toBe(
      1,
    )
    expect(
      liveNodeTimes(LIVE_TIMING, secondsAfterStart(BEST_SECONDS + 42))?.differenceSeconds,
    ).toBe(42)
  })

  it("has no times before the start", () => {
    expect(liveNodeTimes(LIVE_TIMING, secondsAfterStart(-1))).toBeNull()
  })

  it("has no times for a runner that has been out for more than a day", () => {
    expect(liveNodeTimes(LIVE_TIMING, DateTime.fromISO(START_TIME).plus({ days: 1 }))).toBeNull()
  })
})
