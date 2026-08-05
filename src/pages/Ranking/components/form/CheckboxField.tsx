import FieldError from "./FieldError.tsx"
import FieldLabel from "./FieldLabel.tsx"

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  /** Wire to the form field's blur so `onBlur` validators run. */
  onBlur?: () => void
  /** Validation message; when set the label turns red and shows it. */
  error?: string
  description?: string
  className?: string
}

export default function CheckboxField({
  label,
  checked,
  onChange,
  onBlur,
  error,
  description,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={["rk-checkbox-field flex flex-col gap-1", className].filter(Boolean).join(" ")}>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          onBlur={onBlur}
          aria-invalid={!!error}
          className="h-4 w-4 accent-primary"
        />
        <FieldLabel label={label} error={!!error} />
      </label>
      {description && <span className="text-xs text-neutral-500">{description}</span>}
      <FieldError message={error} />
    </div>
  )
}
