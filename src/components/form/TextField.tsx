import FieldLabel from "./FieldLabel.tsx"
import { FIELD_CLASS } from "./fieldStyles.ts"

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
  required?: boolean
  className?: string
}

export default function TextField({
  label,
  value,
  onChange,
  description,
  required,
  className,
}: TextFieldProps) {
  return (
    <label
      className={["rk-text-field flex flex-col gap-1", className]
        .filter(Boolean)
        .join(" ")}
    >
      <FieldLabel label={label} required={required} />
      {description && (
        <span className="text-xs text-neutral-500">{description}</span>
      )}
      <input
        type="text"
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD_CLASS}
      />
    </label>
  )
}
