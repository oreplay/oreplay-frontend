import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import TotalsResultItem from "./components/TotalResultItem"

export default function TotalsResults(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const runnersList = props.runnersQuery.data

  if (!props.activeItem) {
    return (
      <>
        <ChooseClassMsg />
      </>
    )
  }
  if (props.runnersQuery.isFetching) {
    return (
      <>
        <ResultsListSkeleton />
      </>
    )
  } else if (props.runnersQuery.isError) {
    return (
      <>
        <GeneralErrorFallback />
      </>
    )
  } else {
    return (
      <>
        <ResultListContainer>
          {runnersList?.map((runner: ProcessedRunnerModel) => {
            return <TotalsResultItem key={runner.id} runner={runner} isClass={props.isClass} />
          })}
        </ResultListContainer>
      </>
    )
  }
}
