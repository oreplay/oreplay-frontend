import { OnlineCourseSymbolProps } from "../shared/onlineCourseStyles.ts"
import OnlineCourseLiveNodeTimes from "./OnlineCourseLiveNodeTimes.tsx"
import OnlineCourseTimesText from "./OnlineCourseTimesText.tsx"

/**
 * Picks the times written under a node of the course: the reading when the runner has one, the
 * live running time when they are heading to it, and nothing otherwise.
 *
 * @param props.node Node of the course the times belong to.
 */
export default function OnlineCourseNodeTimes({ node }: OnlineCourseSymbolProps) {
  if (node.cumulativeSeconds !== null) {
    return (
      <OnlineCourseTimesText
        cumulativeSeconds={node.cumulativeSeconds}
        differenceSeconds={node.behindSeconds}
      />
    )
  }

  if (node.liveTiming !== null) return <OnlineCourseLiveNodeTimes liveTiming={node.liveTiming} />

  return null
}
