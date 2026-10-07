import { DateTime } from "luxon"
import { OnlineCourseLiveTiming } from "./onlineCourse.ts"

export const APPROACHING_BEST_TIME_RATIO = 0.1

const LONGEST_LIVE_RACE_SECONDS = 24 * 60 * 60

export interface LiveNodeTimes {
  cumulativeSeconds: number
  differenceSeconds: number | null
}

/**
 * Tells whether a running time can belong to a runner that is out on the course right now.
 *
 * @param seconds Seconds elapsed since the start time of the runner.
 * @returns `false` before the start and once the runner has been out for a whole day.
 */
function isPlausibleRaceTime(seconds: number) {
  return seconds >= 0 && seconds < LONGEST_LIVE_RACE_SECONDS
}

/**
 * Compares the running time of a runner with the best time at the control they are heading to.
 *
 * The difference only matters once the runner gets close to the best time: it is negative while
 * they are still ahead by no more than `APPROACHING_BEST_TIME_RATIO` of the best time, and
 * positive once they are behind it.
 *
 * @param cumulativeSeconds Whole seconds the runner has been out.
 * @param bestSeconds Best time at the control, or `null` when nobody has a reading there.
 * @returns The signed difference in seconds, or `null` while the runner is still far ahead or
 * there is no best time to compare with.
 */
function secondsAgainstBest(cumulativeSeconds: number, bestSeconds: number | null) {
  if (bestSeconds === null) return null

  const differenceSeconds = cumulativeSeconds - bestSeconds
  const earliestShownDifferenceSeconds = -bestSeconds * APPROACHING_BEST_TIME_RATIO

  return differenceSeconds >= earliestShownDifferenceSeconds ? differenceSeconds : null
}

/**
 * Computes the times shown under the control a runner is heading to at a given instant.
 *
 * @param liveTiming Start time of the runner and best time at the control they are heading to.
 * @param now Instant the times are computed for.
 * @returns The running time and its difference with the best time, or `null` when the running
 * time is not plausible (before the start or more than a day after it).
 */
export default function liveNodeTimes(
  liveTiming: OnlineCourseLiveTiming,
  now: DateTime,
): LiveNodeTimes | null {
  const secondsSinceStart = now.diff(DateTime.fromISO(liveTiming.startTime)).as("seconds")
  if (!isPlausibleRaceTime(secondsSinceStart)) return null

  const cumulativeSeconds = Math.floor(secondsSinceStart)

  return {
    cumulativeSeconds,
    differenceSeconds: secondsAgainstBest(cumulativeSeconds, liveTiming.bestSeconds),
  }
}
