import { UseQueryResult } from "react-query"
import GeneralErrorFallback from "../../../../../../../components/GeneralErrorFallback.tsx"
import { PaginatedControlPunch } from "../../../../../../../domain/types/v1api"
import NoDataInStageMsg from "../../../components/NoDataInStageMsg.tsx"
import ResultListContainer from "../../../components/ResultsList/ResultListContainer.tsx"
import ResultsListSkeleton from "../../../components/ResultsList/ResultListSkeleton.tsx"
import { toPunchRows } from "../shared/punchRows.ts"
import PunchRow from "./PunchRow/PunchRow.tsx"

interface ControlPunchesListProps {
  punchesQuery: UseQueryResult<PaginatedControlPunch>
}

/**
 * The punches at the control, newest first, in the same list as the results: a skeleton while the
 * first page loads, then one row per punch.
 * @param props.punchesQuery Query of the latest page of punches.
 */
export default function ControlPunchesList({ punchesQuery }: ControlPunchesListProps) {
  if (punchesQuery.isLoading) {
    return <ResultsListSkeleton />
  }
  if (punchesQuery.isError || !punchesQuery.data) {
    return <GeneralErrorFallback />
  }
  const rows = toPunchRows(punchesQuery.data.data)
  if (rows.length === 0) {
    return <NoDataInStageMsg />
  }
  return (
    <ResultListContainer>
      {rows.map((row) => (
        <PunchRow key={row.id} row={row} />
      ))}
    </ResultListContainer>
  )
}
