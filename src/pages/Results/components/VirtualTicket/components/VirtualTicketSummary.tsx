import { ReactNode } from "react"
import { TICKET_GRID_CLASS } from "../shared/ticketLayout.ts"

interface VirtualTicketSummaryProps {
  children: ReactNode
}

/**
 * Three-column grid that holds the figures of a result. Its rows share the columns, so a large
 * figure and the small one below it line up, and so do the splits columns below.
 * It anchors the info tips of its stats, so their explanation opens below it, within the ticket.
 *
 * @param props.children The stats, three per row.
 */
export default function VirtualTicketSummary({ children }: VirtualTicketSummaryProps) {
  return (
    <div className={`virtual-ticket-summary relative ${TICKET_GRID_CLASS} gap-y-2.5 sm:gap-y-3`}>
      {children}
    </div>
  )
}
