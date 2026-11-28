import FieldError from "./FieldError.tsx"
import FieldLabel from "./FieldLabel.tsx"
import { fieldClass } from "./shared/fieldStyles.ts"
import { isoToDatePart, isoToTimePart, withDateChange, withTimeChange } from "./dateTimeField.ts"

interface DateTimeFieldProps {
  label: string
  value: string
  onChange: (iso: string) => void
  onBlur?: () => void
  error?: string
  required?: boolean
  defaultTime?: string
  className?: string
}

export default function DateTimeField({
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  defaultTime,
  className,
}: DateTimeFieldProps) {
  return (
    <div
      className={["rk-date-time-field flex flex-col gap-1", className].filter(Boolean).join(" ")}
    >
      <FieldLabel label={label} required={required} error={!!error} />
      <div className="flex gap-2">
        <input
          type="date"
          aria-required={required}
          aria-invalid={!!error}
          value={isoToDatePart(value)}
          onChange={(event) => onChange(withDateChange(event.target.value, value, defaultTime))}
          onBlur={onBlur}
          className={[fieldClass(!!error), "flex-1"].join(" ")}
        />
        <input
          type="time"
          aria-invalid={!!error}
          value={isoToTimePart(value)}
          onChange={(event) => onChange(withTimeChange(event.target.value, value))}
          onBlur={onBlur}
          className={fieldClass(!!error)}
        />
      </div>
      <FieldError message={error} />
    </div>
  )
}
