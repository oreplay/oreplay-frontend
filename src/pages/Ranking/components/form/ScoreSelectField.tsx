import FieldError from "./FieldError.tsx"
import FieldLabel from "./FieldLabel.tsx"
import { fieldClass } from "./fieldStyles.ts"

interface ScoreSelectFieldProps {
  label: string
  value: number | null
  onChange: (value: number | null) => void
  values: readonly (number | null)[]
  emptyLabel: string
  /** Wire to the form field's blur so `onBlur` validators run. */
  onBlur?: () => void
  /** Validation message; when set the control turns red and shows it. */
  error?: string
  description?: string
  className?: string
}

// `null` ⇄ "" so a numeric/empty score can live in a string-valued <select>.
const toOption = (value: number | null) => (value === null ? "" : String(value))

export default function ScoreSelectField({
  label,
  value,
  onChange,
  values,
  emptyLabel,
  onBlur,
  error,
  description,
  className,
}: ScoreSelectFieldProps) {
  return (
    <label
      className={["rk-score-select-field flex flex-col gap-1", className].filter(Boolean).join(" ")}
    >
      <FieldLabel label={label} error={!!error} />
      {description && <span className="text-xs text-neutral-500">{description}</span>}
      <select
        aria-invalid={!!error}
        value={toOption(value)}
        onChange={(event) =>
          onChange(event.target.value === "" ? null : Number(event.target.value))
        }
        onBlur={onBlur}
        className={fieldClass(!!error)}
      >
        {values.map((option) => (
          <option key={toOption(option)} value={toOption(option)}>
            {option === null ? emptyLabel : String(option)}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </label>
  )
}
