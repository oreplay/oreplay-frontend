import { FunctionComponent } from "react"
import {
  ONLINE_COURSE_NODE_KIND,
  OnlineCourseNodeKind,
} from "../../../../../shared/onlineCourse/onlineCourse.ts"
import { OnlineCourseSymbolProps } from "../shared/onlineCourseStyles.ts"
import OnlineCourseControl from "./OnlineCourseControl.tsx"
import OnlineCourseFinish from "./OnlineCourseFinish.tsx"
import OnlineCourseNodeTimes from "./OnlineCourseNodeTimes.tsx"
import OnlineCourseStart from "./OnlineCourseStart.tsx"

const SYMBOL_BY_KIND: Record<OnlineCourseNodeKind, FunctionComponent<OnlineCourseSymbolProps>> = {
  [ONLINE_COURSE_NODE_KIND.Control]: OnlineCourseControl,
  [ONLINE_COURSE_NODE_KIND.Finish]: OnlineCourseFinish,
  [ONLINE_COURSE_NODE_KIND.Start]: OnlineCourseStart,
}

export default function OnlineCourseNode({ node, x }: OnlineCourseSymbolProps) {
  const Symbol = SYMBOL_BY_KIND[node.kind]

  return (
    <>
      <Symbol node={node} x={x} />
      <OnlineCourseNodeTimes node={node} x={x} />
    </>
  )
}
