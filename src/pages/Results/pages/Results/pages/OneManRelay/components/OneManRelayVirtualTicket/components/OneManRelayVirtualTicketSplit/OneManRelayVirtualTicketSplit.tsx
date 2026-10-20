import { ProcessedSplitModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketControl from "../../../../../../../../components/VirtualTicket/VirtualTicketControl.tsx"
import VirtualTicketSplitTime from "../../../../../../../../components/VirtualTicket/VirtualTicketSplitTime.tsx"
import VirtualTicketSplitRow from "../../../../../../../../components/VirtualTicket/components/VirtualTicketSplitRow.tsx"
import { isMissedSplit } from "../../../../../../../../components/VirtualTicket/shared/ticketDisplay.ts"

interface OneManRelayVirtualTicketSplitProps {
  split: ProcessedSplitModel
}

/**
 * Display a one-man relay splits line within a virtual ticket: the control, the split and the
 * cumulative time.
 *
 * @param props.split Split to be displayed.
 */
export default function OneManRelayVirtualTicketSplit({
  split,
}: OneManRelayVirtualTicketSplitProps) {
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
