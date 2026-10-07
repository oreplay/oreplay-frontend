import { memo, useMemo } from "react"
import GeneralErrorFallback from "../../../../../../../../../components/GeneralErrorFallback.tsx"
import { useVirtualTicket } from "../../../../../../../components/VirtualTicket/shared/hooks.ts"
import ResultsListSkeleton from "../../../../../components/ResultsList/ResultListSkeleton.tsx"
import RunnerSorter from "../../../../../components/RunnerSorter/RunnerSorter.tsx"
import FootOVirtualTicket from "../../../components/FootOVirtualTicket/FootOVirtualTicket.tsx"
import RadiosExperimentalAlert from "../../../components/RadiosExperimentalAlert.tsx"
import { sortFootORunners } from "../../../shared/functions.ts"
import { FootOResultProps } from "../shared/footOResultProps.ts"
import bestOnlineCumulativeSeconds from "../shared/onlineCourse/bestOnlineCumulativeSeconds.ts"
import FootOResultRow from "./FootOResultRow/FootOResultRow.tsx"

const FootOResultRowMemo = memo(FootOResultRow)

export default function FootOResultsContent(props: FootOResultProps) {
  const runnersList = props.runnersQuery.data

  const [isVirtualTicketOpen, selectedRunner, handleRowClick, handleCloseVirtualTicket] =
    useVirtualTicket()

  const bestCumulativeSeconds = useMemo(
    () => (props.isClass && runnersList ? bestOnlineCumulativeSeconds(runnersList) : null),
    [props.isClass, runnersList],
  )

  const runnerRowProps = useMemo(
    () => ({
      bestOnlineCumulativeSeconds: bestCumulativeSeconds,
      isClass: props.isClass,
      isOnlineCourseVisible: props.isOnlineCourseVisible,
      onClick: handleRowClick,
    }),
    [bestCumulativeSeconds, props.isClass, props.isOnlineCourseVisible, handleRowClick],
  )

  if (props.runnersQuery.isLoading) {
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
      </>
    )
  }
}
