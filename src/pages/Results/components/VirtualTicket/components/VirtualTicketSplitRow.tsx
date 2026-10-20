import { ReactNode } from "react"
import { TICKET_GRID_CLASS } from "../shared/ticketLayout.ts"

interface VirtualTicketSplitRowProps {
  children: ReactNode
  isMissed?: boolean
}

/**
 * One row of the splits table of a virtual ticket. A control the runner missed is tinted red.
 *
 * @param props.children The control, split and cumulative cells.
 * @param props.isMissed Whether the runner missed this control.
 */
export default function VirtualTicketSplitRow({ children, isMissed }: VirtualTicketSplitRowProps) {
  const missedClass = isMissed ? "-mx-1.5 bg-red-50 px-1.5" : ""

  return (
    <div
      role="row"
      className={`virtual-ticket-split-row ${TICKET_GRID_CLASS} items-center border-t border-neutral-100 py-2 first:border-t-0 ${missedClass}`}
    >
      {children}
    </div>
  )
}
