import React from "react"
import { parseSecondsToMMSS } from "../../../../shared/Functions.tsx"
import { EMPTY_SPLIT, isBestPosition, splitStandingText } from "./shared/ticketDisplay.ts"

type VirtualTicketSplitTimeProp = {
  time: number | null
  time_behind?: number | null
  position?: number | null
  isMissed?: boolean
}

/**
 * Split or cumulative cell of a splits row, on one line: the time, then how far behind the
 * fastest runner and the position, as "3:12 +0:08 (4)". The time sits in a fixed-width slot so
 * the rest lines up across rows, and the line wraps only when the cell is too narrow. The fastest
 * time is bold, together with its time behind and position, which then take the time's colour. It handles null values.
 *
 * @param props.time Time in seconds; `null` shows "--".
 * @param props.time_behind Difference to the best time in seconds; with `position`, leaving
 * either out shows only the time.
 * @param props.position Position at this control.
 * @param props.isMissed Whether the runner missed the control, which turns the cell red.
 */
const VirtualTicketSplitTime: React.FC<VirtualTicketSplitTimeProp> = ({
  time,
  time_behind = null,
  position = null,
  isMissed,
}) => {
  const timeText = time !== null ? parseSecondsToMMSS(Math.max(time, 0)) : EMPTY_SPLIT
  const standing = splitStandingText(time_behind, position)
  const isBest = isBestPosition(position)
  const weightClass = isBest ? "font-bold" : "font-normal"
  const colorClass = isMissed ? "text-red-700" : "text-neutral-800"
  const standingColorClass = isBest ? colorClass : "text-neutral-500"

  return (
    <span
      role="cell"
      className={`virtual-ticket-split-time flex flex-wrap items-baseline gap-x-2 gap-y-px tabular-nums ${weightClass}`}
    >
      <span className={`min-w-[38px] text-sm sm:min-w-[42px] sm:text-[15px] ${colorClass}`}>
        {timeText}
      </span>
      {standing && <span className={`text-xs ${standingColorClass}`}>{standing}</span>}
    </span>
  )
}

export default VirtualTicketSplitTime
