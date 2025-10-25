import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { FunctionComponent, useContext } from "react"
import { NowContext } from "../../../../shared/context.ts"
import { DateTime } from "luxon"
import { AnimatePresence, motion } from "framer-motion"

interface RunnerRowBaseProps {
  runner: ProcessedRunnerModel
}

interface RunnerSorterProps<T extends RunnerRowBaseProps> {
  runnerList: ProcessedRunnerModel[]
  RunnerRow: FunctionComponent<T>
  runnerRowProps: Omit<T, "runner">
  sortingFunction: (
    runnerList: ProcessedRunnerModel[],
    now?: DateTime<true>,
  ) => ProcessedRunnerModel[]
}

export default function RunnerSorter<T extends RunnerRowBaseProps>({
  runnerList,
  RunnerRow,
  sortingFunction,
  runnerRowProps,
}: RunnerSorterProps<T>) {
  const now = useContext(NowContext)
  const sortedRunnerList = sortingFunction(runnerList, now)

  return (
    <motion.div>
      <AnimatePresence>
        {sortedRunnerList.map((runner, index) => {
          return (
            <motion.div
              key={runner.id}
              layout
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 0.8,
                delay: index * 0.025, // subtle stagger for natural motion
              }}
            >
              {/** @ts-expect-error typescript doesn't pick up that runner & omit<T,"runner"> = T **/}
              <RunnerRow key={runner.id} runner={runner} {...runnerRowProps} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}
