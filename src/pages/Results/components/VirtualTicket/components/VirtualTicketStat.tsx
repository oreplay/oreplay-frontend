import { ReactNode } from "react"
import { STAT_GAP_CLASS, STAT_SIZE, STAT_VALUE_CLASS, StatSize } from "../shared/ticketLayout.ts"

interface VirtualTicketStatProps {
  children: ReactNode
  label: string
  size?: StatSize
  className?: string
}

/**
 * One figure of a result summary: a small grey label above its value.
 *
 * @param props.children The value.
 * @param props.label Already translated name of the figure, e.g. "Time".
 * @param props.size How prominent the value is: `large` for the main figures, `small` for the
 * secondary ones, `detail` for the least important.
 * @param props.className Extra classes for the cell, such as a column span.
 */
export default function VirtualTicketStat({
  children,
  label,
  size = STAT_SIZE.Small,
  className = "",
}: VirtualTicketStatProps) {
  return (
    <div
      className={`virtual-ticket-stat flex min-w-0 flex-col ${STAT_GAP_CLASS[size]} ${className}`}
    >
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      <span
        className={`flex min-w-0 flex-wrap items-center gap-x-2 tabular-nums ${STAT_VALUE_CLASS[size]}`}
      >
        {children}
      </span>
    </div>
  )
}
