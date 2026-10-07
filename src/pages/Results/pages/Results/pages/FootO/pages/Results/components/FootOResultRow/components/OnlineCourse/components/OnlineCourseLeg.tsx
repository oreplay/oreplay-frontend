import { OnlineCourseProgress } from "../../../../../shared/onlineCourse/onlineCourse.ts"
import {
  fractionToPercent,
  OnlineCourseLegGeometry,
  SYMBOL_CENTER_Y_PX,
  SYMBOL_STROKE_WIDTH_PX,
} from "../../../../../shared/onlineCourse/onlineCourseGeometry.ts"
import { legFillRatio } from "../../../../../shared/onlineCourse/onlineCourseProgress.ts"

const LINE_END_X = "100%"

const TRAVELLED_LINE_CLASS_NAME = [
  "origin-left",
  "text-course",
  "transition-transform",
  "duration-500",
  "[transform-box:fill-box]",
  "motion-reduce:transition-none",
].join(" ")

interface OnlineCourseLegProps {
  geometry: OnlineCourseLegGeometry
  progress: OnlineCourseProgress
}

/**
 * Draws the line between two nodes and, over it, the part the runner has travelled.
 *
 * @param props.geometry Where the leg is drawn.
 * @param props.progress Progress of the runner on the leg.
 */
export default function OnlineCourseLeg({ geometry, progress }: OnlineCourseLegProps) {
  const travelledStyle = { transform: `scaleX(${legFillRatio(progress)})` }

  return (
    <g
      data-leg-progress={progress}
      strokeWidth={SYMBOL_STROKE_WIDTH_PX}
      transform={`translate(${geometry.offsetX})`}
    >
      <svg
        overflow="visible"
        width={fractionToPercent(geometry.widthFraction)}
        x={fractionToPercent(geometry.xFraction)}
      >
        <line
          className="text-neutral-400"
          stroke="currentColor"
          x1={geometry.lineStartX}
          x2={LINE_END_X}
          y1={SYMBOL_CENTER_Y_PX}
          y2={SYMBOL_CENTER_Y_PX}
        />
        <line
          className={TRAVELLED_LINE_CLASS_NAME}
          stroke="currentColor"
          style={travelledStyle}
          x1={geometry.lineStartX}
          x2={LINE_END_X}
          y1={SYMBOL_CENTER_Y_PX}
          y2={SYMBOL_CENTER_Y_PX}
        />
      </svg>
    </g>
  )
}
