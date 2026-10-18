import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import {
  DUPLICATED_RUNNER_COLUMNS,
  DUPLICATED_RUNNER_COLUMN_LABEL_KEYS,
  DuplicatedRunner,
  DuplicatedRunnerPair,
  isNumericColumn,
} from "../../shared/duplicatedRunners.ts"
import DuplicatedRunnerPairRows from "./components/DuplicatedRunnerPairRows.tsx"

interface DuplicatedRunnersTableProps {
  pairs: DuplicatedRunnerPair[]
  eventId: string
  stageId: string
  onRemove: (runner: DuplicatedRunner) => void
}

export default function DuplicatedRunnersTable({
  pairs,
  eventId,
  stageId,
  onRemove,
}: DuplicatedRunnersTableProps) {
  const { t } = useTranslationRanking()

  return (
    <table className="rk-duplicated-runners-table w-full border-collapse text-sm">
      <thead>
        <tr className="text-left text-neutral-500">
          {DUPLICATED_RUNNER_COLUMNS.map((column) => {
            const alignment = isNumericColumn(column) ? "text-right" : ""
            return (
              <th key={column} className={`px-3 py-2 font-medium ${alignment}`}>
                {t(DUPLICATED_RUNNER_COLUMN_LABEL_KEYS[column])}
              </th>
            )
          })}
          <th className="px-3 py-2 text-right font-medium">{t("DuplicatedRunners.action")}</th>
        </tr>
      </thead>
      {pairs.map((pair, pairIndex) => (
        <DuplicatedRunnerPairRows
          key={pair.map(({ id }) => id).join("-")}
          pair={pair}
          eventId={eventId}
          stageId={stageId}
          isShaded={pairIndex % 2 === 0}
          onRemove={onRemove}
        />
      ))}
    </table>
  )
}
