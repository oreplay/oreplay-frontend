import React from "react"
import { ProcessedSplitModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketControl from "../../../../../../../../../components/VirtualTicket/VirtualTicketControl.tsx"
import VirtualTicketSplitTime from "../../../../../../../../../components/VirtualTicket/VirtualTicketSplitTime.tsx"
import VirtualTicketSplitRow from "../../../../../../../../../components/VirtualTicket/components/VirtualTicketSplitRow.tsx"
import { isMissedSplit } from "../../../../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"

type RogaineVirtualTicketProps = {
  split: ProcessedSplitModel
}

/**
 * Display a splits line with times only within a virtual ticket: the control (with its points
 * when it gives any), the split and the cumulative time. Rogaine and relay legs use it.
 *
 * @param props.split Split to be displayed.
 */
const RogaineVirtualTicketSplit: React.FC<RogaineVirtualTicketProps> = ({ split }) => {
  const isMissed = isMissedSplit(split)

  return (
    <VirtualTicketSplitRow isMissed={isMissed}>
      <VirtualTicketControl
        control={split.control}
        order_number={split.order_number}
        points={split.points}
        isMissed={isMissed}
      />
      <VirtualTicketSplitTime time={split.time} isMissed={isMissed} />
      <VirtualTicketSplitTime time={split.cumulative_time} isMissed={isMissed} />
    </VirtualTicketSplitRow>
  )
}

export default RogaineVirtualTicketSplit
