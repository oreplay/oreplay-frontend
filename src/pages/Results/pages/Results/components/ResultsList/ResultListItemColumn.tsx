import { ReactNode } from "react"

interface ResultListItemColumnSlotProps {
  /** Additional classNames merged onto the column's root element. */
  className?: string
}

interface ResultListItemColumnProps {
  /** Content to render inside the column. */
  children?: ReactNode
  /** Slot overrides for internal elements. */
  slotProps?: ResultListItemColumnSlotProps
}

/**
 * A single column within a `ResultListItem` row.
 *
 * @example
 * ```tsx
 * <ResultListItemColumn slotProps={{ className: "flex-grow flex items-start" }}>
 *   <span>Content</span>
 * </ResultListItemColumn>
 * ```
 */
export default function ResultListItemColumn({ children, slotProps }: ResultListItemColumnProps) {
  return (
    <div className={["px-0.5 py-1", slotProps?.className].filter(Boolean).join(" ")}>
      {children}
    </div>
  )
}
