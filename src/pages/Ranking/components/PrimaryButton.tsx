import { ButtonHTMLAttributes } from "react"
import SpinnerRing from "./SpinnerRing.tsx"

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

const baseClassName =
  "rk-primary-button inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2 font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"

export default function PrimaryButton({
  type = "button",
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={[baseClassName, className].filter(Boolean).join(" ")}
      {...props}
    >
      {isLoading && <SpinnerRing className="h-4 w-4 border-2 border-current" />}
      {children}
    </button>
  )
}
