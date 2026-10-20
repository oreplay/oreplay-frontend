import RogaineVirtualTicketSplit from "./components/RogaineVirtualTicketSplits.tsx"
import { ProcessedSplitModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import VirtualTicketSplitsTable from "../../../../../../../../components/VirtualTicket/components/VirtualTicketSplitsTable.tsx"

interface RogaineVirtualTicketSplitsTabProps {
  splitList: ProcessedSplitModel[] | null
}

/**
 * Splits of a rogaine team: every punched control with its points, split and cumulative time.
 *
 * @param props.splitList The team's splits; `null` when it has none.
 */
export default function RogaineVirtualTicketSplitsTab({
  splitList,
}: RogaineVirtualTicketSplitsTabProps) {
  return (
    <VirtualTicketSplitsTable>
      {splitList?.map((split) => <RogaineVirtualTicketSplit key={split.id} split={split} />)}
    </VirtualTicketSplitsTable>
  )
}
