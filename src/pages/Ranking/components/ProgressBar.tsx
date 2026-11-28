interface ProgressBarProps {
  value: number
  max: number
  className?: string
}

export default function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={[
        "rk-progress-bar h-2 w-full overflow-hidden rounded-full bg-neutral-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="h-full bg-primary transition-[width] duration-200"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
