interface FieldLabelProps {
  label: string
  required?: boolean
}

// Required fields get a red `*` after the label (via a CSS pseudo-element, so
// there's no literal text node). Selects pass no `required` here — per design
// they don't show the asterisk even when the underlying field is required.
export default function FieldLabel({ label, required }: FieldLabelProps) {
  return (
    <span
      className={[
        "text-sm font-medium text-neutral-700",
        required && "after:ml-0.5 after:text-red-500 after:content-['*']",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  )
}
