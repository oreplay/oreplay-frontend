import { ReactNode } from "react"

interface ResultListItemProps {
  /** Content to render inside the item. */
  children: ReactNode
  /** Optional click handler. When provided, the item becomes keyboard-operable and focusable. */
  onClick?: () => void
}

/**
 * A single cell within a `ResultListContainer` grid.
 *
 * When `onClick` is provided, the item is rendered as an accessible,
 * keyboard-operable pseudo-button (`role="button"`, focusable, responds to
 * Enter/Space, and shows hover/focus styling). When `onClick` is omitted,
 * it renders as a plain, non-interactive container.
 *
 * @example
 * ```tsx
 * <ResultListItem onClick={() => navigate(`/results/${id}`)}>
 *   <span>{title}</span>
 *   <span>{date}</span>
 * </ResultListItem>
 * ```
 */
export default function ResultListItem({ children, onClick }: ResultListItemProps) {
  const clickable = Boolean(onClick)

  /**
   * Handles keyboard activation (Enter/Space) for clickable items,
   * mirroring native button behavior.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={clickable ? handleKeyDown : undefined}
      className={[
        "flex min-w-0 flex-row items-center justify-between gap-1 px-2 py-1",
        clickable
          ? "cursor-pointer hover:bg-amber-50 hover:rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          : "",
      ].join(" ")}
    >
      {children}
    </div>
  )
}
