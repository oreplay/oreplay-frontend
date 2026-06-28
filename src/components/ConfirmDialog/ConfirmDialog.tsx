import { ReactNode, useEffect } from "react"
import CloseIcon from "../icons/CloseIcon.tsx"

interface ConfirmDialogProps {
  open: boolean
  title: string
  confirmLabel: string
  closeLabel: string
  isConfirming?: boolean
  destructive?: boolean
  onConfirm: () => void
  onClose: () => void
  /** Optional content between the title and the buttons (e.g. extra options). */
  children?: ReactNode
}

export default function ConfirmDialog({
  open,
  title,
  confirmLabel,
  closeLabel,
  isConfirming,
  destructive,
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const confirmClass = destructive
    ? "bg-red-600 text-white"
    : "bg-primary text-neutral-900"

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="rk-confirm-dialog fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="m-0 text-lg font-semibold text-neutral-900">{title}</p>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <CloseIcon />
          </button>
        </div>

        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className={[
              "inline-flex items-center justify-center gap-2 rounded px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50",
              confirmClass,
            ].join(" ")}
          >
            {isConfirming && (
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
