import FieldError from "./FieldError.tsx"
import FieldLabel from "./FieldLabel.tsx"
import SpinnerRing from "../SpinnerRing.tsx"
import { fieldClass } from "./shared/fieldStyles.ts"
import { useDropdown } from "./useDropdown.ts"

export interface AutocompleteOption {
  id: string
  label: string
}

interface AutocompleteTextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  /** Called with the picked option id; the parent decides what to fill. */
  onSelect: (id: string) => void
  options: AutocompleteOption[]
  onBlur?: () => void
  required?: boolean
  error?: string
  loading?: boolean
  className?: string
}

export default function AutocompleteTextField({
  label,
  value,
  onChange,
  onSelect,
  options,
  onBlur,
  required,
  error,
  loading,
  className,
}: AutocompleteTextFieldProps) {
  const { open, setOpen, containerRef } = useDropdown()

  const select = (id: string) => {
    onSelect(id)
    setOpen(false)
  }

  return (
    <div
      className={["rk-autocomplete-text-field flex flex-col gap-1", className]
        .filter(Boolean)
        .join(" ")}
    >
      <FieldLabel label={label} required={required} error={!!error} />
      <div ref={containerRef} className="relative">
        <input
          type="text"
          aria-required={required}
          aria-invalid={!!error}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={onBlur}
          className={[fieldClass(!!error), "w-full", loading ? "pr-10" : ""].join(" ")}
        />
        {loading && (
          <SpinnerRing className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 border-2 border-primary" />
        )}
        {open && options.length > 0 && (
          <ul className="absolute top-full z-10 mt-1 max-h-56 w-full list-none overflow-auto rounded-md border border-neutral-200 bg-white p-1 shadow-md">
            {options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => select(option.id)}
                  className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <FieldError message={error} />
    </div>
  )
}
