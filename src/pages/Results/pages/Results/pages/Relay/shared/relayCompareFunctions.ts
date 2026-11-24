import { DateTime } from "luxon"
import { findLastFinishedRelayLeg, findLegsNumberRunning, liveRelayTime } from "./functions.ts"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { captureExceptionOnce } from "../../../shared/captureExceptionOnce.ts"
import { MissingTeamMembersError } from "./MissingTeamMembersError.ts"

/**
 * Reports an unexpected error thrown while comparing two relay teams.
 *
 * Teams without members are valid data, so a `MissingTeamMembersError` is ignored and the
 * comparison falls through to the next criterion. Any other error is reported once per page
 * load: comparators run many times per sort, and reporting every call floods Sentry.
 *
 * @param error The value thrown by the comparison.
 * @param a The first team being compared.
 * @param b The second team being compared.
 * @param origin Name of the comparator that caught the error.
 */
function reportComparisonError(
  error: unknown,
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  origin: string,
): void {
  if (error instanceof MissingTeamMembersError) {
    return
  }

  console.error(error)
  captureExceptionOnce(error, origin, { teamA: a.id, teamB: b.id })
}

function byLiveRelayTime(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now?: DateTime<true>,
): number {
  try {
    const aRelayTime = liveRelayTime(a, now)
    const bRelayTime = liveRelayTime(b, now)

    if (aRelayTime !== null && bRelayTime !== null) {
      // Time must be rounded with milliseconds precision to avoid
      // errors on sorting due to numerical stability computing
      // `aRelayTime` and `bRelayTime`. You may get
      // 124.56799999999, 124.568, 124.56800000000001 seconds
      // enough difference to break sorting.
      return Math.round((aRelayTime - bRelayTime) * 1000)
    }
  } catch (error) {
    reportComparisonError(error, a, b, "relayCompareFunctions.byLiveRelayTime")
  }

  return 0
}

function byLastCommonLegTime(a: ProcessedRunnerModel, b: ProcessedRunnerModel): number {
  try {
    // Sanitize
    if (!a.runners || !b.runners) {
      throw new MissingTeamMembersError()
    }

    // Find last common time
    const aLastLegIndex = findLastFinishedRelayLeg(a.runners)
    const bLastLegIndex = findLastFinishedRelayLeg(b.runners)

    if (aLastLegIndex !== -1 && bLastLegIndex !== -1) {
      const lastCommon = Math.min(aLastLegIndex, bLastLegIndex)

      // Compute team time until last finished common leg
      const aCommonTime = liveRelayTime(a, undefined, lastCommon + 1)
      const bCommonTime = liveRelayTime(b, undefined, lastCommon + 1)

      if (aCommonTime !== null && bCommonTime !== null) {
        return aCommonTime - bCommonTime
      }
    }
  } catch (error) {
    reportComparisonError(error, a, b, "relayCompareFunctions.byLastCommonLegTime")
  }

  return 0
}

function byNumberOfLegsFinished(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now?: DateTime<true>,
): number {
  const aRunningLeg = Math.max(...findLegsNumberRunning(a, now))
  const bRunningLeg = Math.max(...findLegsNumberRunning(b, now))

  return bRunningLeg - aRunningLeg
}

export const relayCompareFunctions = {
  byLastCommonLegTime,
  byLiveRelayTime,
  byNumberOfLegsFinished,
}
