import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { ElementType, FunctionComponent, ReactNode, useContext } from "react"
import { NowContext } from "../../../../shared/context.ts"
import { DateTime } from "luxon"
import { AnimatePresenceProps, motion, MotionProps } from "framer-motion"
import NowProvider from "../NowProvider.tsx"
import ResultListContainer from "../ResultsList/ResultListContainer.tsx"
import RunnerSorterItems from "./components/RunnerSorterItems.tsx"

export interface RunnerRowBaseProps {
  runner: ProcessedRunnerModel
}

export interface RunnerSorterProps<T extends RunnerRowBaseProps> {
  runnerList: ProcessedRunnerModel[]
  RunnerRow: FunctionComponent<T>
  runnerRowProps: Omit<T, "runner">
  sortingFunction: (
    runnerList: ProcessedRunnerModel[],
    now?: DateTime<true>,
  ) => ProcessedRunnerModel[]
  ContainerComponent?: ElementType<{ children?: ReactNode }>
  ItemComponent?: ElementType<MotionProps>
  animatePresenceProps?: AnimatePresenceProps
}

export default function RunnerSorter<T extends RunnerRowBaseProps>(props: RunnerSorterProps<T>) {
  return (
    <NowProvider>
      <RunnerSorterContent {...props} />
    </NowProvider>
  )
}

function RunnerSorterContent<T extends RunnerRowBaseProps>({
  runnerList,
  RunnerRow,
  sortingFunction,
  runnerRowProps,
  ContainerComponent = ResultListContainer,
  ItemComponent = motion.div,
  animatePresenceProps,
}: RunnerSorterProps<T>) {
  const now = useContext(NowContext)
  const sortedRunnerList = sortingFunction(runnerList, now)

  return (
    <ContainerComponent>
      <RunnerSorterItems
        runners={sortedRunnerList}
        RunnerRow={RunnerRow}
        runnerRowProps={runnerRowProps}
        ItemComponent={ItemComponent}
        animatePresenceProps={animatePresenceProps}
      />
    </ContainerComponent>
  )
}
