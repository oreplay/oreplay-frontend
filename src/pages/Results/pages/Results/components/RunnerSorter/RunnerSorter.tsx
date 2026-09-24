import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { ElementType, FunctionComponent, useContext, useRef } from "react"
import { NowContext } from "../../../../shared/context.ts"
import { DateTime } from "luxon"
import { AnimatePresence, AnimatePresenceProps, motion, MotionProps } from "framer-motion"
import NowProvider from "../NowProvider.tsx"
import "../ResultsList/result-list-grid.css"
import useResultGridColumns from "../ResultsList/shared/useResultGridColumns.ts"

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
  ContainerComponent?: ElementType<MotionProps & { className?: string }>
  ItemComponent?: ElementType<MotionProps>
  containerClassName?: string
  animatePresenceProps?: AnimatePresenceProps
}

export default function RunnerSorter<T extends RunnerRowBaseProps>({
  runnerList,
  RunnerRow,
  sortingFunction,
  runnerRowProps,
  ContainerComponent = motion.div,
  ItemComponent = motion.div,
  containerClassName,
  animatePresenceProps,
}: RunnerSorterProps<T>) {
  return (
    <NowProvider>
      <RunnerSorterContent
        runnerList={runnerList}
        RunnerRow={RunnerRow}
        sortingFunction={sortingFunction}
        runnerRowProps={runnerRowProps}
        ContainerComponent={ContainerComponent}
        ItemComponent={ItemComponent}
        containerClassName={containerClassName}
        animatePresenceProps={animatePresenceProps}
      />
    </NowProvider>
  )
}

function RunnerSorterContent<T extends RunnerRowBaseProps>({
  runnerList,
  RunnerRow,
  sortingFunction,
  runnerRowProps,
  ContainerComponent = motion.div,
  ItemComponent = motion.div,
  containerClassName,
  animatePresenceProps,
}: RunnerSorterProps<T>) {
  const now = useContext(NowContext)
  const sortedRunnerList = sortingFunction(runnerList, now)
  const isGrid = containerClassName?.includes("result-list-grid") ?? false
  const containerRef = useRef<HTMLElement>(null)
  const columnCount = useResultGridColumns(containerRef)
  const itemsPerColumn = Math.max(1, Math.ceil(sortedRunnerList.length / columnCount))
  const columns = Array.from({ length: columnCount }, (_, columnIndex) =>
    sortedRunnerList.slice(columnIndex * itemsPerColumn, (columnIndex + 1) * itemsPerColumn),
  )

  const renderItems = (runners: ProcessedRunnerModel[]) =>
    <AnimatePresence {...animatePresenceProps}>
      {runners.map((runner, index) => (
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

  return (
    <ContainerComponent
      className={containerClassName}
      ref={containerRef}
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {isGrid ? (
        columns.map((column, columnIndex) => (
          <div className="flex min-w-0 flex-col" key={columnIndex}>
            {renderItems(column)}
          </div>
        ))
      ) : (
        <AnimatePresence {...animatePresenceProps}>{renderItems(sortedRunnerList)}</AnimatePresence>
      )}
    </ContainerComponent>
  )
}
