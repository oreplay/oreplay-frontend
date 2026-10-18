import { DuplicatedRunner, DuplicatedRunnerPair } from "../../../shared/duplicatedRunners.ts"
import DuplicatedRunnerRow from "./DuplicatedRunnerRow.tsx"

interface DuplicatedRunnerPairRowsProps {
  pair: DuplicatedRunnerPair
  eventId: string
  stageId: string
  isShaded: boolean
  onRemove: (runner: DuplicatedRunner) => void
}

export default function DuplicatedRunnerPairRows({
  pair,
  eventId,
  stageId,
  isShaded,
  onRemove,
}: DuplicatedRunnerPairRowsProps) {
  const background = isShaded ? "bg-neutral-50" : "bg-white"

  return (
    <tbody className={`rk-duplicated-runner-pair-rows border-t-2 border-neutral-300 ${background}`}>
      {pair.map((runner, rowIndex) => (
        <DuplicatedRunnerRow
          key={runner.id}
          pair={pair}
          eventId={eventId}
          stageId={stageId}
          rowIndex={rowIndex}
          onRemove={() => onRemove(runner)}
        />
      ))}
    </tbody>
  )
}
