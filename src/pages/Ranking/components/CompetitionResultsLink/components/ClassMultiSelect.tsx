import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import CheckboxField from "../../form/CheckboxField.tsx"

export interface ClassOption {
  id: string
  name: string
}

interface ClassMultiSelectProps {
  label: string
  options: ClassOption[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

export default function ClassMultiSelect({
  label,
  options,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
}: ClassMultiSelectProps) {
  const { t } = useTranslationRanking()

  return (
    <div className="rk-class-multi-select flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <div className="flex gap-3 text-sm">
          <button type="button" onClick={onSelectAll} className="text-primary hover:underline">
            {t("ExportResults.selectAll")}
          </button>
          <button type="button" onClick={onClearAll} className="text-primary hover:underline">
            {t("ExportResults.clearAll")}
          </button>
        </div>
      </div>
      <ul className="m-0 flex max-h-56 list-none flex-col gap-1 overflow-auto p-0">
        {options.map((option) => (
          <li key={option.id}>
            <CheckboxField
              label={option.name}
              checked={selectedIds.includes(option.id)}
              onChange={() => onToggle(option.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
