import { DateTime } from "luxon"
import { findLastFinishedRelayLeg, findLegsNumberRunning, liveRelayTime } from "./functions.ts"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { captureException as sentryCaptureException, withScope } from "@sentry/react"

function byLiveRelayTime(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now?: DateTime<true>,
): number {
  try {
    const aRelayTime = liveRelayTime(a, now)
    const bRelayTime = liveRelayTime(b, now)

    if (aRelayTime !== null && bRelayTime !== null) {
      return aRelayTime - bRelayTime
    }
  } catch (error) {
    console.error(error)

    withScope((scope) => {
      scope.setExtra("runnerA", a)
      scope.setExtra("runnerB", b)
      scope.setExtra("origin", "relayCompareFunctions.byLiveRelayTime")

      sentryCaptureException(error)
    })
  }

  return 0
}

function byLastCommonLegTime(a: ProcessedRunnerModel, b: ProcessedRunnerModel): number {
  try {
    // Sanitize
    if (!a.runners || !b.runners) {
      throw new Error("Relay teams must have team members in `.runners` attribute")
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
    console.error(error)

    withScope((scope) => {
      scope.setExtra("runnerA", a)
      scope.setExtra("runnerB", b)
      scope.setExtra("origin", "relayCompareFunctions.byLastCommonLegTime")

      sentryCaptureException(error)
    })
  }

  return 0
}

function isSameLegRunning(
  a: ProcessedRunnerModel,
  b: ProcessedRunnerModel,
  now?: DateTime<true>,
): boolean {
  const aRunningLeg = Math.max(...findLegsNumberRunning(a, now))
  const bRunningLeg = Math.max(...findLegsNumberRunning(b, now))

  return aRunningLeg === bRunningLeg
}

export const relayCompareFunctions = {
  byLastCommonLegTime,
  byLiveRelayTime,
  isSameLegRunning,
}
