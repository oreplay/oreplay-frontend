import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import CheckboxField from "../../../../components/form/CheckboxField.tsx"
import {
  ProcessResultsWarning,
  ProcessResultsWarningId,
  summarizeWarningNames,
  warningLabelKey,
} from "./shared/processResultsWarnings.ts"

interface ProcessResultsWarningListProps {
  warnings: ProcessResultsWarning[]
  acknowledgedIds: ProcessResultsWarningId[]
  onToggle: (id: ProcessResultsWarningId) => void
}

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
              names: summarizeWarningNames(warning.names),
              total: warning.names.length,
            })}
            checked={acknowledgedIds.includes(warning.id)}
            onChange={() => onToggle(warning.id)}
          />
        </li>
      ))}
    </ul>
  )
}
