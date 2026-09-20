import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import CheckboxField from "../../../../components/form/CheckboxField.tsx"
import {
  ProcessResultsWarning,
  ProcessResultsWarningId,
  warningLabelKey,
} from "./shared/processResultsWarnings.ts"

interface ProcessResultsWarningListProps {
  warnings: ProcessResultsWarning[]
  acknowledgedIds: ProcessResultsWarningId[]
  onToggle: (id: ProcessResultsWarningId) => void
}

const CLASS_NAMES_SEPARATOR = ", "

export default function ProcessResultsWarningList({
  warnings,
  acknowledgedIds,
  onToggle,
}: ProcessResultsWarningListProps) {
  const { t } = useTranslationRanking()

  return (
    <ul className="rk-process-results-warning-list m-0 flex list-none flex-col gap-3 p-0">
      {warnings.map((warning) => (
        <li key={warning.id} className="rounded-md bg-amber-50 p-3">
          <CheckboxField
            label={t(warningLabelKey(warning.id), {
              classNames: warning.classNames.join(CLASS_NAMES_SEPARATOR),
            })}
            checked={acknowledgedIds.includes(warning.id)}
            onChange={() => onToggle(warning.id)}
          />
        </li>
      ))}
    </ul>
  )
}
