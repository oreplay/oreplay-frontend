import FieldError from "./FieldError.tsx"
import FieldLabel from "./FieldLabel.tsx"
import { fieldClass } from "./shared/fieldStyles.ts"

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  /** Wire to the form field's blur so `onBlur` validators run. */
  onBlur?: () => void
  /** Validation message; when set the control turns red and shows it. */
  error?: string
  description?: string
  required?: boolean
  readOnly?: boolean
  className?: string
}

export default function TextField({
  label,
  value,
  onChange,
  onBlur,
  error,
  description,
  required,
  readOnly,
  className,
}: TextFieldProps) {
  return (
    <label className={["rk-text-field flex flex-col gap-1", className].filter(Boolean).join(" ")}>
      <FieldLabel label={label} required={required} error={!!error} />
      {description && <span className="text-xs text-neutral-500">{description}</span>}
      <input
        type="text"
        aria-required={required}
        aria-invalid={!!error}
        readOnly={readOnly}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={[fieldClass(!!error), readOnly ? "bg-neutral-100" : ""]
          .filter(Boolean)
          .join(" ")}
      />
      <FieldError message={error} />
    </label>
  )
}
