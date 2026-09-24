import { Children, ReactNode, useRef } from "react"
import NowProvider from "../NowProvider.tsx"
import "./result-list-grid.css"
import useResultGridColumns from "./shared/useResultGridColumns.ts"

interface ResultListContainerProps {
  /** Items to render inside the responsive grid, typically `ResultListItem` elements. */
  children: ReactNode
}

/**
 * Responsive grid container for a list of results.
 *
 * Renders `children` in a CSS grid that shows 1 column on small screens,
 * 2 columns on medium screens, and 3 columns on large screens. Wraps
 * everything in `NowProvider` so descendants have access to the current
 * time context.
 *
 * @example
 * ```tsx
 * <ResultListContainer>
 *   <ResultListItem>Result A</ResultListItem>
 *   <ResultListItem>Result B</ResultListItem>
 * </ResultListContainer>
 * ```
 */
export default function ResultListContainer({ children }: ResultListContainerProps) {
  const items = Children.toArray(children)
  const containerRef = useRef<HTMLDivElement>(null)
  const columnCount = useResultGridColumns(containerRef)
  const itemsPerColumn = Math.max(1, Math.ceil(items.length / columnCount))
  const columns = Array.from({ length: columnCount }, (_, columnIndex) =>
    items.slice(columnIndex * itemsPerColumn, (columnIndex + 1) * itemsPerColumn),
  )

  return (
    <NowProvider>
      <div
        className="result-list-grid"
        ref={containerRef}
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {columns.map((column, columnIndex) => (
          <div className="flex min-w-0 flex-col" key={columnIndex}>
            {column}
          </div>
        ))}
      </div>
    </NowProvider>
  )
}
