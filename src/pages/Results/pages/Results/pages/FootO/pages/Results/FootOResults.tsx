import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx"
import { useVirtualTicket } from "../../../../../../components/VirtualTicket/shared/hooks.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import FootOVirtualTicket from "../../components/FootOVirtualTicket/FootOVirtualTicket.tsx"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import { AxiosError } from "axios"
import RadiosExperimentalAlert from "../../components/RadiosExperimentalAlert.tsx"
import { sortFootORunners } from "../../shared/functions.ts"

import { memo, useMemo } from "react"
import RunnerSorter from "../../../../components/RunnerSorter"
import FootOResultRow from "./components/FootOResultRow"

interface FootOResultProps
  extends ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>> {
  setClassClubId: (newClassClubId: string, isClass: boolean) => void
}

export default function FootOResults(props: FootOResultProps) {
  const runnersList = props.runnersQuery.data

  const [isVirtualTicketOpen, selectedRunner, handleRowClick, handleCloseVirtualTicket] =
    useVirtualTicket()

  const runnerRowProps = useMemo(
    () => ({
      isClass: props.isClass,
      onClick: handleRowClick,
    }),
    [props.isClass, handleRowClick],
  )

  const FootOResultRowMemo = memo(FootOResultRow)

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
          <RunnerSorter
            runnerList={runnersList ? runnersList : []}
            RunnerRow={FootOResultRowMemo}
            sortingFunction={sortFootORunners}
            runnerRowProps={runnerRowProps}
          />
          <FootOVirtualTicket
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
