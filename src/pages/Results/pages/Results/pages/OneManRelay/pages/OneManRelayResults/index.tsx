import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import { useVirtualTicket } from "../../../../../../components/VirtualTicket/shared/hooks.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import RadiosExperimentalAlert from "../../../FootO/components/RadiosExperimentalAlert.tsx"
import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx"
import OneManRelayVirtualTicket from "../../components/OneManRelayVirtualTicket"
import OneManRelayResultItem from "./components/OneManRelayResultItem.tsx"

interface OneManRelayResultProps
  extends ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>> {
  setClassClubId: (newClassClubId: string, isClass: boolean) => void
}

export default function OneManRelayResults(props: OneManRelayResultProps) {
  const runnersList = props.runnersQuery.data
  const [isVirtualTicketOpen, selectedRunner, handleRowClick, handleCloseVirtualTicket] =
    useVirtualTicket()

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
        {
          // @ts-expect-error TS2339 If props.isClass is True, props.activeItem is StageClassModel
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          props.isClass && props.activeItem.splits.length > 0 ? <RadiosExperimentalAlert /> : <></>
        }
        <ResultListContainer>
          {runnersList?.map((runner: ProcessedRunnerModel) => {
            return (
              <OneManRelayResultItem
                runner={runner}
                isClass={props.isClass}
                onClick={handleRowClick}
              />
            )
          })}
          <OneManRelayVirtualTicket
            isTicketOpen={isVirtualTicketOpen}
            runner={selectedRunner}
            handleCloseTicket={handleCloseVirtualTicket}
            setClassClubId={props.setClassClubId}
          />
        </ResultListContainer>
      </>
    )
  }
}
