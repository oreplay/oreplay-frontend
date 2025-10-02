import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { FunctionComponent, useContext } from "react"
import { NowContext } from "../../../../shared/context.ts"
import { DateTime } from "luxon"

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

  return sortedRunnerList.map((runner) => {
    // @ts-expect-error typescript doesn't pick up that runner & omit<T,"runner"> = T
    return <RunnerRow key={runner.id} runner={runner} {...runnerRowProps} />
  })
}
