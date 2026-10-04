import { ElementType, FunctionComponent, useContext } from "react"
import { AnimatePresence, AnimatePresenceProps, MotionProps } from "framer-motion"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { ResultListLayoutContext } from "../../ResultsList/shared/resultListLayoutContext.ts"
import { RunnerRowBaseProps } from "../RunnerSorter.tsx"

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.8,
} as const

const STAGGER_DELAY_SECONDS = 0.025

interface RunnerSorterItemsProps<T extends RunnerRowBaseProps> {
  runners: ProcessedRunnerModel[]
  RunnerRow: FunctionComponent<T>
  runnerRowProps: Omit<T, "runner">
  ItemComponent: ElementType<MotionProps>
  animatePresenceProps?: AnimatePresenceProps
}

export default function RunnerSorterItems<T extends RunnerRowBaseProps>({
  runners,
  RunnerRow,
  runnerRowProps,
  ItemComponent,
  animatePresenceProps,
}: RunnerSorterItemsProps<T>) {
  useContext(ResultListLayoutContext)

  return (
    <AnimatePresence {...animatePresenceProps}>
      {runners.map((runner, index) => (
        <ItemComponent
          key={runner.id}
          layout="position"
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{
            ...SPRING_TRANSITION,
            delay: index * STAGGER_DELAY_SECONDS,
            layout: SPRING_TRANSITION,
          }}
        >
          {/** @ts-expect-error typescript doesn't pick up that runner & omit<T,"runner"> = T **/}
          <RunnerRow runner={runner} {...runnerRowProps} />
        </ItemComponent>
      ))}
    </AnimatePresence>
  )
}
