import { useTranslationRanking } from "../../../../../shared/useTranslationRanking.ts"
import {
  DUPLICATED_RUNNER_COLUMNS,
  DuplicatedRunnerCellTone,
  DuplicatedRunnerPair,
  duplicatedRunnerCellTone,
  isNumericColumn,
} from "../../../shared/duplicatedRunners.ts"
import DuplicatedRunnerClassLink from "./DuplicatedRunnerClassLink.tsx"

const CELL_TONE_CLASS: Record<DuplicatedRunnerCellTone, string> = {
  muted: "text-neutral-400",
  normal: "text-neutral-900",
  warning: "font-medium text-orange-600",
}

interface DuplicatedRunnerRowProps {
  pair: DuplicatedRunnerPair
  eventId: string
  stageId: string
  rowIndex: number
  onRemove: () => void
}

export default function DuplicatedRunnerRow({
  pair,
  eventId,
  stageId,
  rowIndex,
  onRemove,
}: DuplicatedRunnerRowProps) {
  const { t } = useTranslationRanking()
  const runner = pair[rowIndex]

  return (
    <tr className="rk-duplicated-runner-row border-b border-dashed border-neutral-200 last:border-0">
      {DUPLICATED_RUNNER_COLUMNS.map((column) => {
        const alignment = isNumericColumn(column) ? "text-right" : ""
        const color = CELL_TONE_CLASS[duplicatedRunnerCellTone(pair, rowIndex, column)]
        return (
          <td key={column} className={`px-3 py-2 ${alignment} ${color}`}>
            {column === "class" ? (
              <DuplicatedRunnerClassLink
                classShortName={runner.class}
                eventId={eventId}
                stageId={stageId}
              />
            ) : (
              runner[column]
            )}
          </td>
        )
      })}
      <td className="px-3 py-2 text-right">
        <button
          type="button"
          onClick={onRemove}
          className="text-sm font-medium text-red-600 hover:underline"
        >
          {t("DuplicatedRunners.remove")}
        </button>
      </td>
    </tr>
  )
}
