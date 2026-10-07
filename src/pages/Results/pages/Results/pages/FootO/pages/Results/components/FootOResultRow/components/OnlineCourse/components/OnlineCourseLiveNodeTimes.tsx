import { useContext } from "react"
import { NowContext } from "../../../../../../../../../../../shared/context.ts"
import liveNodeTimes from "../../../../../shared/onlineCourse/liveNodeTimes.ts"
import { OnlineCourseLiveTiming } from "../../../../../shared/onlineCourse/onlineCourse.ts"
import OnlineCourseTimesText from "./OnlineCourseTimesText.tsx"

interface OnlineCourseLiveNodeTimesProps {
  liveTiming: OnlineCourseLiveTiming
}

/**
 * Shows, ticking with the shared clock, the running time of a runner under the control they are
 * heading to and its difference with the best time there.
 *
 * @param props.liveTiming Start time of the runner and best time at the control.
 */
export default function OnlineCourseLiveNodeTimes({ liveTiming }: OnlineCourseLiveNodeTimesProps) {
  const now = useContext(NowContext)
  const times = liveNodeTimes(liveTiming, now)

  if (times === null) return null

  return (
    <OnlineCourseTimesText
      cumulativeSeconds={times.cumulativeSeconds}
      differenceSeconds={times.differenceSeconds}
      isLive
    />
  )
}
