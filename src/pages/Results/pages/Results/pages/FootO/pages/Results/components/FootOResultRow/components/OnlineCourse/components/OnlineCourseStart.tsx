import {
  startTrianglePoints,
  SYMBOL_CENTER_Y_PX,
  SYMBOL_STROKE_WIDTH_PX,
} from "../../../../../shared/onlineCourse/onlineCourseGeometry.ts"
import { OnlineCourseSymbolProps, PROGRESS_COLOR_CLASS_NAME } from "../shared/onlineCourseStyles.ts"

export default function OnlineCourseStart({ node, x }: OnlineCourseSymbolProps) {
  return (
    <g className={PROGRESS_COLOR_CLASS_NAME} data-kind={node.kind} data-progress={node.progress}>
      <polygon
        fill="none"
        points={startTrianglePoints(x, SYMBOL_CENTER_Y_PX)}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={SYMBOL_STROKE_WIDTH_PX}
      />
    </g>
  )
}
