import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx"
import { useVirtualTicket } from "../../../../../../components/VirtualTicket/shared/hooks.ts"
import RogaineVirtualTicket from "../../components/RogaineVirtualTicket/RogaineVirtualTicket.tsx"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import RogaineResultItemRow from "./components/RogaineResultItemRow"

interface RogainePointsProps
  extends ResultsPageProps<[ProcessedRunnerModel[], bigint[]], AxiosError<RunnerModel[]>> {
  setClassClubId: (newClassOrClubId: string, isClass: boolean) => void
}

export default function RogainePoints(props: RogainePointsProps) {
  const [isVirtualTicketOpen, selectedRunner, handleRowClick, handleCloseVirtualTicket] =
    useVirtualTicket()

  // Gather runners data
  const runnersList = props.runnersQuery.data ? props.runnersQuery.data[0] : null

  // Render component
  if (!props.activeItem) {
    return <ChooseClassMsg />
  } else if (props.runnersQuery.isFetching || props.runnersQuery.isLoading) {
    return <ResultsListSkeleton />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return (
      <ResultListContainer>
        {runnersList?.map((runner) => {
          return (
            <RogaineResultItemRow
              runner={runner}
              isClass={props.isClass}
              onClick={handleRowClick}
            />
          )
        })}
        <RogaineVirtualTicket
          isTicketOpen={isVirtualTicketOpen}
          runner={selectedRunner}
          handleCloseTicket={handleCloseVirtualTicket}
          setClassClubId={props.setClassClubId}
        />
      </ResultListContainer>
    )
  }
}
