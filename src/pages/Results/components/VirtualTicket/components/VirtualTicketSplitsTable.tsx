import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { TICKET_GRID_CLASS } from "../shared/ticketLayout.ts"

interface VirtualTicketSplitsTableProps {
  children: ReactNode
}

/**
 * Table of the splits of a virtual ticket, with the control, split and cumulative columns. Its
 * rows are drawn by the result type, each a `VirtualTicketSplitRow` with the same columns, which
 * line up with the summary above.
 *
 * @param props.children The rows, or a skeleton or error while they are not available.
 */
export default function VirtualTicketSplitsTable({ children }: VirtualTicketSplitsTableProps) {
  const { t } = useTranslation()

  return (
    <div role="table" className="virtual-ticket-splits-table text-neutral-800">
      <div
        role="row"
        className={`${TICKET_GRID_CLASS} border-b border-[#f0f0f0] py-2.5 text-xs font-medium text-neutral-500`}
      >
        <span role="columnheader">{t("ResultsStage.VirtualTicket.Control")}</span>
        <span role="columnheader">{t("ResultsStage.VirtualTicket.Partial")}</span>
        <span role="columnheader">{t("ResultsStage.VirtualTicket.Cumulative")}</span>
      </div>
      <div role="rowgroup">{children}</div>
    </div>
  )
}
