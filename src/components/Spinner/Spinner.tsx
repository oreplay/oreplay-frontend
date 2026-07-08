interface SpinnerProps {
  label: string
  className?: string
}

export default function Spinner({ label, className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={["rk-spinner flex justify-center py-12", className].filter(Boolean).join(" ")}
    >
      <span
        aria-hidden="true"
        className="inline-block h-16 w-16 animate-spin rounded-full border-[6px] border-primary border-t-transparent"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
