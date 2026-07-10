interface FieldErrorProps {
  /** Validation message; nothing renders when empty. */
  message?: string
}

// `role="alert"` so the message is announced as soon as validation fails.
export default function FieldError({ message }: FieldErrorProps) {
  if (!message) return null

  return (
    <span role="alert" className="rk-field-error text-xs text-red-600">
      {message}
    </span>
  )
}
