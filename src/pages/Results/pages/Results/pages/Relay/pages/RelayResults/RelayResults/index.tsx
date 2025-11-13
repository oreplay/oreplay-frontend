import { ResultsPageProps } from "../../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../../shared/EntityTypes.ts"
import ResultsListSkeleton from "../../../../../components/ResultsList/ResultListSkeleton.tsx"
import RelayResultItem from "../components/RelayResultItem"
import RelayResultContainer from "../components/RelayResultContainer.tsx"
import RelayVirtualTicket from "../components/RelayVirtualTicket/RelayVirtualTicket.tsx"
import { useVirtualTicket } from "../../../../../../../components/VirtualTicket/shared/hooks.ts"
import NotImplementedAlertBox from "../../../../../../../../../components/NotImplementedAlertBox.tsx"
import RunnerSorter from "../../../../../components/RunnerSorter"
import { FC, memo, useMemo } from "react"
import { sortRelayRunners } from "../../../shared/sortRelayRunners.ts"
import LoadingStateManager from "../../../../../components/LoadingStateManager"
import { motion, MotionProps } from "framer-motion"
import "./styles.css"

interface RelayResultProps
  extends ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>> {
  setClassClubId: (classOrClubId: string, isClass: boolean) => void
}

const MotionTrWithClass: FC<MotionProps> = (props) => (
  <motion.tr {...props} className="relay-results-row" />
)

export default function RelayResults(props: RelayResultProps) {
  const runnersList = props.runnersQuery.data || []

  const [isTicketOpen, selectedRunner, handleRowClick, handleCloseTicket, leg] = useVirtualTicket()

  const runnerRowProps = useMemo(
    () => ({
      isClass: props.isClass,
      handleRowClick: handleRowClick,
    }),
    [props.isClass, handleRowClick],
  )

  const RelayResultItemMemo = memo(RelayResultItem)

  return (
    <>
      <NotImplementedAlertBox />
      <LoadingStateManager
        query={props.runnersQuery}
        skeleton={<ResultsListSkeleton />}
        isActiveItem={props.activeItem !== null}
      >
        <RelayResultContainer>
          <RunnerSorter
            runnerList={runnersList}
            RunnerRow={RelayResultItemMemo}
            runnerRowProps={runnerRowProps}
            sortingFunction={sortRelayRunners}
            ContainerComponent={motion.tbody}
            ItemComponent={MotionTrWithClass}
          />
        </RelayResultContainer>
        <RelayVirtualTicket
          isTicketOpen={isTicketOpen}
          runner={selectedRunner}
          handleCloseTicket={handleCloseTicket}
          setClassClubId={props.setClassClubId}
          leg={leg}
        />
      </LoadingStateManager>
    </>
  )
}
