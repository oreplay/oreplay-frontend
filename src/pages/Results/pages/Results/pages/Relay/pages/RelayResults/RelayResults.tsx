import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import ResultsListSkeleton from "../../../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import RelayResultItem from "./components/RelayResultItem.tsx"
import ExperimentalFeatureAlert from "../../../../../../../../components/ExperimentalFeatureAlert.tsx"
import RelayResultContainer from "./components/RelayResultContainer.tsx"
import RelayVirtualTicket from "./components/RelayVirtualTicket/RelayVirtualTicket.tsx"
import { useVirtualTicket } from "../../../../../../components/VirtualTicket/shared/hooks.ts"

interface RelayResultProps
  extends ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>> {
  setClassClubId: (classOrClubId: string, isClass: boolean) => void
}

export default function RelayResults(props: RelayResultProps) {
  const runnersList = props.runnersQuery.data

  const [isTicketOpen, selectedRunner, handleRowClick, handleCloseTicket] = useVirtualTicket()

  if (!props.activeItem) {
    return <ChooseClassMsg />
  }
  if (props.runnersQuery.isFetching) {
    return <ResultsListSkeleton />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return (
      <>
        <ExperimentalFeatureAlert />
        <RelayResultContainer>
          {runnersList?.map((runner: ProcessedRunnerModel) => (
            <RelayResultItem key={runner.id} runner={runner} handleRowClick={handleRowClick} />
          ))}
        </RelayResultContainer>
        <RelayVirtualTicket
          isTicketOpen={isTicketOpen}
          runner={selectedRunner}
          handleCloseTicket={handleCloseTicket}
          setClassClubId={props.setClassClubId}
        />
      </>
    )
  }
}
