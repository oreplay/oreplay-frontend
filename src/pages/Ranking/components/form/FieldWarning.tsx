interface FieldWarningProps {
  message?: string
}

export default function FieldWarning({ message }: FieldWarningProps) {
  if (!message) return null

  return <span className="rk-field-warning text-xs text-amber-600">{message}</span>
}
