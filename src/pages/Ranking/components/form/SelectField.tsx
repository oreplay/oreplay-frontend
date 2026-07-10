import FieldError from "./FieldError.tsx"
import FieldLabel from "./FieldLabel.tsx"
import { fieldClass } from "./fieldStyles.ts"

interface SelectFieldOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectFieldOption[]
  /** Wire to the form field's blur so `onBlur` validators run. */
  onBlur?: () => void
  /** Validation message; when set the control turns red and shows it. */
  error?: string
  description?: string
  required?: boolean
  className?: string
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  onBlur,
  error,
  description,
  required,
  className,
}: SelectFieldProps) {
  return (
    <label className={["rk-select-field flex flex-col gap-1", className].filter(Boolean).join(" ")}>
      <FieldLabel label={label} error={!!error} />
      {description && <span className="text-xs text-neutral-500">{description}</span>}
      <select
        aria-required={required}
        aria-invalid={!!error}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={fieldClass(!!error)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </label>
  )
}
