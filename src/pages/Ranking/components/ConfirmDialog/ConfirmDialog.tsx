import { ReactNode, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import CloseIcon from "../icons/CloseIcon.tsx"
import SpinnerRing from "../SpinnerRing.tsx"

interface ConfirmDialogProps {
  open: boolean
  title: string
  confirmLabel: string
  closeLabel: string
  isConfirming?: boolean
  confirmDisabled?: boolean
  destructive?: boolean
  /** Panel width; "lg" suits wide content like a board. Defaults to "sm". */
  size?: "sm" | "lg"
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
  confirmDisabled,
  destructive,
  size = "sm",
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) {
  const requestClose = useCallback(() => {
    if (isConfirming) return
    onClose()
  }, [isConfirming, onClose])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, requestClose])

  if (!open) return null

  const confirmClass = destructive ? "bg-red-600 text-white" : "bg-primary text-neutral-900"

  return createPortal(
    <div
      role="presentation"
      onClick={(event) => {
        event.stopPropagation()
        requestClose()
      }}
      className="rk-confirm-dialog tw-root fixed inset-0 font-sans z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={[
          "flex max-h-[calc(100vh-2rem)] w-full flex-col rounded-xl bg-white py-6 shadow-xl",
          size === "lg" ? "max-w-4xl" : "max-w-sm",
        ].join(" ")}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-6">
          <p className="m-0 text-lg font-semibold text-neutral-900">{title}</p>
          <button
            type="button"
            aria-label={closeLabel}
            disabled={isConfirming}
            onClick={requestClose}
            className="text-neutral-500 transition-colors hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseIcon />
          </button>
        </div>

        {children && <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-6">{children}</div>}
        <div className="mt-6 flex shrink-0 justify-end px-6">
          <button
            type="button"
            disabled={isConfirming || confirmDisabled}
            onClick={onConfirm}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50",
              confirmClass,
            ].join(" ")}
          >
            {isConfirming && <SpinnerRing className="h-4 w-4 border-2 border-current" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
