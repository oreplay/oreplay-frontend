import ResultListContainer from "../../../../../../components/ResultsList/ResultListContainer.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import ResultsListSkeleton from "../../../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import EnhancedTotalsResultItem from "./components/EnhancedTotalsResultItem.tsx"
import NotImplementedAlertBox from "../../../../../../../../components/NotImplementedAlertBox.tsx"

export default function TotalsResults(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const runnersList = props.runnersQuery.data

  // @ts-expect-error TS6133: variable is declared but never used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRowClick = (runner: RunnerModel) => {}

  if (!props.activeItem) {
    return (
      <>
        <NotImplementedAlertBox />
        <ChooseClassMsg />
      </>
    )
  }
  if (props.runnersQuery.isFetching) {
    return (
      <>
        <NotImplementedAlertBox />
        <ResultsListSkeleton />
      </>
    )
  } else if (props.runnersQuery.isError) {
    return (
      <>
        <NotImplementedAlertBox />
        <GeneralErrorFallback />
      </>
    )
  } else {
    return (
      <ResultListContainer>
        <NotImplementedAlertBox />
        {runnersList?.map((runner: ProcessedRunnerModel) => {
          return (
            <EnhancedTotalsResultItem
              key={runner.id}
              runner={runner}
              handleRowClick={handleRowClick}
              isClass={props.isClass}
            />
          )
        })}
      </ResultListContainer>
    )
  }
}
