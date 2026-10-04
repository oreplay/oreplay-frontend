import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { ElementType, FunctionComponent, ReactNode, useContext } from "react"
import { NowContext } from "../../../../shared/context.ts"
import { DateTime } from "luxon"
import { AnimatePresence, AnimatePresenceProps, motion, MotionProps } from "framer-motion"
import NowProvider from "../NowProvider.tsx"
import ResultListContainer from "../ResultsList/ResultListContainer.tsx"

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
      <AnimatePresence {...animatePresenceProps}>
        {sortedRunnerList.map((runner, index) => (
          <ItemComponent
            key={runner.id}
            layout="position"
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 20,
              mass: 0.8,
              delay: index * 0.025,
            }}
          >
            {/** @ts-expect-error typescript doesn't pick up that runner & omit<T,"runner"> = T **/}
            <RunnerRow runner={runner} {...runnerRowProps} />
          </ItemComponent>
        ))}
      </AnimatePresence>
    </ContainerComponent>
  )
}
