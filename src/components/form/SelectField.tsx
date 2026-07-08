import FieldLabel from "./FieldLabel.tsx"
import { FIELD_CLASS } from "./fieldStyles.ts"

interface SelectFieldOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectFieldOption[]
  description?: string
  required?: boolean
  className?: string
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  description,
  required,
  className,
}: SelectFieldProps) {
  return (
    <label className={["rk-select-field flex flex-col gap-1", className].filter(Boolean).join(" ")}>
      <FieldLabel label={label} />
      {description && <span className="text-xs text-neutral-500">{description}</span>}
      <select
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD_CLASS}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
