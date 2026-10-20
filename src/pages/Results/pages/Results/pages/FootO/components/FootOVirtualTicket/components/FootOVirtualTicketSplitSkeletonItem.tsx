import VirtualTicketSplitRow from "../../../../../../../components/VirtualTicket/components/VirtualTicketSplitRow.tsx"

const BAR_CLASS = "animate-pulse rounded-md bg-[#ededed]"

/**
 * Placeholder row of the FootO splits table, shown while the class-wide splits load.
 */
export default function FootOVirtualTicketSplitSkeletonItem() {
  return (
    <VirtualTicketSplitRow>
      <span className={`h-[18px] w-10 ${BAR_CLASS}`} />
      <span className="flex items-center gap-2">
        <span className={`h-4 w-10 ${BAR_CLASS}`} />
        <span className={`h-3 w-[52px] ${BAR_CLASS}`} />
      </span>
      <span className="flex items-center gap-2">
        <span className={`h-4 w-10 ${BAR_CLASS}`} />
        <span className={`h-3 w-[52px] ${BAR_CLASS}`} />
      </span>
    </VirtualTicketSplitRow>
  )
}
