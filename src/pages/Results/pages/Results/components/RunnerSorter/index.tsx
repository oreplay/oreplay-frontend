import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { FunctionComponent, memo, useContext } from "react"
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
  const RunnerRowMemo = memo<T>(RunnerRow)

  return sortedRunnerList.map((runner) => {
    const props = { runner, ...runnerRowProps } as T

    return <RunnerRowMemo key={runner.id} {...props} />
  })
}
