import React from "react"
import { ProcessedSplitModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketControl from "../../../../../../../components/VirtualTicket/VirtualTicketControl.tsx"
import VirtualTicketSplitTime from "../../../../../../../components/VirtualTicket/VirtualTicketSplitTime.tsx"
import VirtualTicketSplitRow from "../../../../../../../components/VirtualTicket/components/VirtualTicketSplitRow.tsx"
import { isMissedSplit } from "../../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"

type FootOVirtualTicketProps = {
  split: ProcessedSplitModel
}

/**
 * Display a foot-o splits line within a virtual ticket: the control, then the split and the
 * cumulative time, each with the time behind and the position.
 *
 * @param props.split Split to be displayed.
 */
const FootOVirtualTicketSplit: React.FC<FootOVirtualTicketProps> = ({ split }) => {
  const isMissed = isMissedSplit(split)

  return (
    <VirtualTicketSplitRow isMissed={isMissed}>
      <VirtualTicketControl
        control={split.control}
        order_number={split.order_number}
        isMissed={isMissed}
      />
      <VirtualTicketSplitTime
        time={split.time}
        time_behind={split.time_behind}
        position={split.position}
        isMissed={isMissed}
      />
      <VirtualTicketSplitTime
        time={split.cumulative_time}
        time_behind={split.cumulative_behind}
        position={split.cumulative_position}
        isMissed={isMissed}
      />
    </VirtualTicketSplitRow>
  )
}

export default FootOVirtualTicketSplit
