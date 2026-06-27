interface ArrowBackIconProps {
  className?: string
}

export default function ArrowBackIcon({ className }: ArrowBackIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={["rk-arrow-back-icon h-5 w-5", className]
        .filter(Boolean)
        .join(" ")}
    >
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  )
}
