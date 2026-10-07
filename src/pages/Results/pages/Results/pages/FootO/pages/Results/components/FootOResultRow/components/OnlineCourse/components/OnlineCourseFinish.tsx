import {
  CONTROL_RADIUS_PX,
  FINISH_INNER_RADIUS_PX,
  SYMBOL_CENTER_Y_PX,
  SYMBOL_STROKE_WIDTH_PX,
} from "../../../../../shared/onlineCourse/onlineCourseGeometry.ts"
import { OnlineCourseSymbolProps, PROGRESS_COLOR_CLASS_NAME } from "../shared/onlineCourseStyles.ts"

export default function OnlineCourseFinish({ node }: OnlineCourseSymbolProps) {
  return (
    <g
      className={PROGRESS_COLOR_CLASS_NAME}
      data-kind={node.kind}
      data-progress={node.progress}
      fill="none"
      stroke="currentColor"
      strokeWidth={SYMBOL_STROKE_WIDTH_PX}
    >
      <circle cy={SYMBOL_CENTER_Y_PX} r={CONTROL_RADIUS_PX} />
      <circle cy={SYMBOL_CENTER_Y_PX} r={FINISH_INNER_RADIUS_PX} />
    </g>
  )
}
