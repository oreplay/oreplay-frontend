import { OnlineCourseProgress } from "../../../../../shared/onlineCourse/onlineCourse.ts"
import {
  SYMBOL_CENTER_Y_PX,
  SYMBOL_STROKE_WIDTH_PX,
} from "../../../../../shared/onlineCourse/onlineCourseGeometry.ts"
import { legFillRatio } from "../../../../../shared/onlineCourse/onlineCourseProgress.ts"

const TRAVELLED_LINE_CLASS_NAME = [
  "origin-left",
  "text-course",
  "transition-transform",
  "duration-500",
  "[transform-box:fill-box]",
  "motion-reduce:transition-none",
].join(" ")

interface OnlineCourseLegProps {
  endX: number
  progress: OnlineCourseProgress
  startX: number
}

export default function OnlineCourseLeg({ endX, progress, startX }: OnlineCourseLegProps) {
  const travelledStyle = { transform: `scaleX(${legFillRatio(progress)})` }

  return (
    <g data-leg-progress={progress} strokeWidth={SYMBOL_STROKE_WIDTH_PX}>
      <line
        className="text-neutral-400"
        stroke="currentColor"
        x1={startX}
        x2={endX}
        y1={SYMBOL_CENTER_Y_PX}
        y2={SYMBOL_CENTER_Y_PX}
      />
      <line
        className={TRAVELLED_LINE_CLASS_NAME}
        stroke="currentColor"
        style={travelledStyle}
        x1={startX}
        x2={endX}
        y1={SYMBOL_CENTER_Y_PX}
        y2={SYMBOL_CENTER_Y_PX}
      />
    </g>
  )
}
