interface SpinnerRingProps {
  className?: string
}

export default function SpinnerRing({ className }: SpinnerRingProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        "rk-spinner-ring inline-block animate-spin rounded-full border-t-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
