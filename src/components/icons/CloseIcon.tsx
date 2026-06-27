interface CloseIconProps {
  className?: string
}

export default function CloseIcon({ className }: CloseIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={["rk-close-icon h-5 w-5", className].filter(Boolean).join(" ")}
    >
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  )
}
