import FieldLabel from "./FieldLabel.tsx"
import { FIELD_CLASS } from "./fieldStyles.ts"

interface NumberFieldProps {
  label: string
  value: number | null
  onChange: (value: number | null) => void
  description?: string
  required?: boolean
  className?: string
}

export default function NumberField({
  label,
  value,
  onChange,
  description,
  required,
  className,
}: NumberFieldProps) {
  return (
    <label
      className={["rk-number-field flex flex-col gap-1", className]
        .filter(Boolean)
        .join(" ")}
    >
      <FieldLabel label={label} required={required} />
      {description && (
        <span className="text-xs text-neutral-500">{description}</span>
      )}
      <input
        type="number"
        step="any"
        required={required}
        value={value ?? ""}
        onChange={(event) =>
          onChange(
            event.target.value === "" ? null : Number(event.target.value),
          )
        }
        className={FIELD_CLASS}
      />
    </label>
  )
}
