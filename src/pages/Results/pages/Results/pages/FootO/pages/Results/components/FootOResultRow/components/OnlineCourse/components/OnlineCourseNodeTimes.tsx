import {
  parseSecondsToMMSS,
  parseTimeBehind,
} from "../../../../../../../../../../../../../shared/Functions.tsx"
import {
  BEHIND_TIME_BASELINE_Y_PX,
  CUMULATIVE_TIME_BASELINE_Y_PX,
} from "../../../../../shared/onlineCourse/onlineCourseGeometry.ts"
import { OnlineCourseSymbolProps } from "../shared/onlineCourseStyles.ts"

export default function OnlineCourseNodeTimes({ node }: OnlineCourseSymbolProps) {
  if (node.cumulativeSeconds === null) return null

  return (
    <g className="text-[10px] tabular-nums" textAnchor="middle">
      <text className="fill-neutral-700" y={CUMULATIVE_TIME_BASELINE_Y_PX}>
        {parseSecondsToMMSS(node.cumulativeSeconds)}
      </text>
      {node.behindSeconds !== null && (
        <text className="fill-primary" y={BEHIND_TIME_BASELINE_Y_PX}>
          {parseTimeBehind(node.behindSeconds)}
        </text>
      )}
    </g>
  )
}
