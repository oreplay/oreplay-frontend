import {
  parseSecondsToMMSS,
  parseTimeBehind,
} from "../../../../../../../../../../../../../shared/Functions.tsx"
import {
  BEHIND_TIME_BASELINE_Y_PX,
  CUMULATIVE_TIME_BASELINE_Y_PX,
} from "../../../../../shared/onlineCourse/onlineCourseGeometry.ts"

const LIVE_TIME_CLASS_NAME = "fill-neutral-400"

interface OnlineCourseTimesTextProps {
  cumulativeSeconds: number
  differenceSeconds: number | null
  isLive?: boolean
}

/**
 * Writes the time at a control and, under it, the signed difference with the best time there.
 *
 * @param props.cumulativeSeconds Time since the start, in seconds.
 * @param props.differenceSeconds Seconds behind (positive) or ahead of (negative) the best time,
 * or `null` to leave the second line out.
 * @param props.isLive Whether the times are still running instead of read at the control. Live
 * times are drawn in grey.
 */
export default function OnlineCourseTimesText({
  cumulativeSeconds,
  differenceSeconds,
  isLive = false,
}: OnlineCourseTimesTextProps) {
  const cumulativeClassName = isLive ? LIVE_TIME_CLASS_NAME : "fill-neutral-700"
  const differenceClassName = isLive ? LIVE_TIME_CLASS_NAME : "fill-primary"

  return (
    <g className="text-[10px] tabular-nums" data-live={isLive} textAnchor="middle">
      <text className={cumulativeClassName} y={CUMULATIVE_TIME_BASELINE_Y_PX}>
        {parseSecondsToMMSS(cumulativeSeconds)}
      </text>
      {differenceSeconds !== null && (
        <text className={differenceClassName} y={BEHIND_TIME_BASELINE_Y_PX}>
          {parseTimeBehind(differenceSeconds)}
        </text>
      )}
    </g>
  )
}
