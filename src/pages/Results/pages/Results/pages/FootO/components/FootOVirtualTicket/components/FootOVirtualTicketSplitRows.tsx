import GeneralErrorFallback from "../../../../../../../../../components/GeneralErrorFallback.tsx"
import ListSkeleton from "../../../../../../../../../components/ListSkeleton/ListSkeleton.tsx"
import { ProcessedSplitModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import FootOVirtualTicketSplit from "./FootOVirtualTicketSplit.tsx"
import FootOVirtualTicketSplitSkeletonItem from "./FootOVirtualTicketSplitSkeletonItem.tsx"

const SKELETON_MIN_ROWS = 10

interface FootOVirtualTicketSplitRowsProps {
  isError: boolean
  isLoading: boolean
  splits: ProcessedSplitModel[]
}

/**
 * Rows of the FootO splits table: skeleton rows while the class-wide splits load, an error if
 * they fail, and one row per control otherwise.
 *
 * @param props.isError Whether loading the class-wide splits failed.
 * @param props.isLoading Whether the class-wide splits are loading.
 * @param props.splits The runner's splits, finish included.
 */
export default function FootOVirtualTicketSplitRows({
  isError,
  isLoading,
  splits,
}: FootOVirtualTicketSplitRowsProps) {
  if (isError) return <GeneralErrorFallback />

  if (isLoading) {
    return (
      <ListSkeleton
        SkeletonItem={FootOVirtualTicketSplitSkeletonItem}
        gap="0px"
        minItems={SKELETON_MIN_ROWS}
      />
    )
  }

  return splits.map((split) => <FootOVirtualTicketSplit key={split.id} split={split} />)
}
