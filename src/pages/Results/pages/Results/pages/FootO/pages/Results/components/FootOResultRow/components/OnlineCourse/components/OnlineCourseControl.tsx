import {
  CONTROL_RADIUS_PX,
  SYMBOL_CENTER_Y_PX,
  SYMBOL_STROKE_WIDTH_PX,
} from "../../../../../shared/onlineCourse/onlineCourseGeometry.ts"
import { OnlineCourseSymbolProps, PROGRESS_COLOR_CLASS_NAME } from "../shared/onlineCourseStyles.ts"

export default function OnlineCourseControl({ node }: OnlineCourseSymbolProps) {
  return (
    <g className={PROGRESS_COLOR_CLASS_NAME} data-kind={node.kind} data-progress={node.progress}>
      <circle
        cy={SYMBOL_CENTER_Y_PX}
        fill="none"
        r={CONTROL_RADIUS_PX}
        stroke="currentColor"
        strokeWidth={SYMBOL_STROKE_WIDTH_PX}
      />
      <text
        className="text-[9px] font-semibold tabular-nums"
        dominantBaseline="central"
        fill="currentColor"
        textAnchor="middle"
        y={SYMBOL_CENTER_Y_PX}
      >
        {node.label}
      </text>
    </g>
  )
}
