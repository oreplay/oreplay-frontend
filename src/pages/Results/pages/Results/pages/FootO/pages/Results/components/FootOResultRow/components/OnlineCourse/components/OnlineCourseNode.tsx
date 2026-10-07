import { FunctionComponent } from "react"
import {
  ONLINE_COURSE_NODE_KIND,
  OnlineCourseNode as OnlineCourseNodeModel,
  OnlineCourseNodeKind,
} from "../../../../../shared/onlineCourse/onlineCourse.ts"
import {
  fractionToPercent,
  OnlineCourseNodeGeometry,
} from "../../../../../shared/onlineCourse/onlineCourseGeometry.ts"
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

interface OnlineCourseNodeProps {
  geometry: OnlineCourseNodeGeometry
  node: OnlineCourseNodeModel
}

/**
 * Places a node of the course: the symbol of its kind and the times under it.
 *
 * @param props.geometry Where the node is drawn.
 * @param props.node Node to draw.
 */
export default function OnlineCourseNode({ geometry, node }: OnlineCourseNodeProps) {
  const Symbol = SYMBOL_BY_KIND[node.kind]

  return (
    <g transform={`translate(${geometry.offsetX})`}>
      <svg overflow="visible" x={fractionToPercent(geometry.xFraction)}>
        <Symbol node={node} />
        <OnlineCourseNodeTimes node={node} />
      </svg>
    </g>
  )
}
