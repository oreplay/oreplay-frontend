import { ReactNode, useState } from "react"
import FieldLabel from "./FieldLabel.tsx"
import SettingsIcon from "../icons/SettingsIcon.tsx"
import TextField from "./TextField.tsx"

interface EditableTextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  /** Accessible name of the button that turns the text into an input. */
  editLabel: string
  /** Shown in place of an empty value while not editing. */
  emptyLabel: string
  /** Replaces the plain text shown while not editing (e.g. highlighted parts). */
  display?: ReactNode
  onBlur?: () => void
  error?: string
  description?: string
  className?: string
}

export default function EditableTextField({
  label,
  value,
  onChange,
  editLabel,
  emptyLabel,
  display,
  onBlur,
  error,
  description,
  className,
}: EditableTextFieldProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        description={description}
        className={className}
      />
    )
  }

  return (
    <div
      className={["rk-editable-text-field flex flex-col gap-1", className]
        .filter(Boolean)
        .join(" ")}
    >
      <FieldLabel label={label} />
      {description && <span className="text-xs text-neutral-500">{description}</span>}
      <div className="flex items-center gap-2">
        {value ? (
          (display ?? <p className="m-0 text-sm">{value}</p>)
        ) : (
          <p className="m-0 text-sm text-neutral-500">{emptyLabel}</p>
        )}
        <button
          type="button"
          aria-label={editLabel}
          onClick={() => setIsEditing(true)}
          className="text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <SettingsIcon />
        </button>
      </div>
    </div>
  )
}
